import puppeteer, { Browser, Page } from "puppeteer-core";
import { v2 as translate } from "@google-cloud/translate";
import * as fs from "fs";
import * as path from "path";
import { defaultConfig, Config, selectors } from "./config";

// Interfaces for data structures
interface StudentComment {
	studentName: string;
	originalComment: string;
	translatedComment?: string;
	timestamp?: string;
}

interface TranslationResult {
	originalText: string;
	translatedText: string;
	detectedLanguage?: string;
}

// Translation service setup
class TranslationService {
	private translator: translate.Translate;

	constructor() {
		// Initialize Google Translate (you can also use other services like Azure Translator)
		this.translator = new translate.Translate();
	}

	async translateText(
		text: string,
		targetLanguage: string = "en"
	): Promise<TranslationResult> {
		try {
			const [translation, detection] = await Promise.all([
				this.translator.translate(text, targetLanguage),
				this.translator.detect(text),
			]);

			return {
				originalText: text,
				translatedText: translation[0],
				detectedLanguage: detection[0].language,
			};
		} catch (error) {
			console.error("Translation error:", error);
			// Fallback: return original text if translation fails
			return {
				originalText: text,
				translatedText: text,
			};
		}
	}

	// Alternative method using free translation API
	async translateTextFree(
		text: string,
		targetLanguage: string = "en"
	): Promise<TranslationResult> {
		try {
			const axios = require("axios");
			const response = await axios.post(
				"https://libretranslate.de/translate",
				{
					q: text,
					source: "auto",
					target: targetLanguage,
					format: "text",
				}
			);

			return {
				originalText: text,
				translatedText: response.data.translatedText || text,
			};
		} catch (error) {
			console.error("Free translation error:", error);
			return {
				originalText: text,
				translatedText: text,
			};
		}
	}
}

// launch a browser
async function initBrowserAndPage(
	config: Config = defaultConfig
): Promise<Page> {
	const browser = await puppeteer.launch({
		channel: "chrome",
		headless: config.headless,
		devtools: config.devtools,
	});
	const page = await browser.newPage();
	await page.goto("https://lms.apollo.edu.vn/login", {
		waitUntil: "networkidle2",
	});
	return page;
}

// login
async function login(
	page: Page,
	email: string,
	password: string
): Promise<Page> {
	await page.type(selectors.emailInput, email, { delay: 50 });
	await page.type(selectors.passwordInput, password, { delay: 50 });
	await page.waitForFunction(
		() => {
			const btn = document.querySelector("button[type='submit']");
			return btn;
		},
		{ timeout: 5000 }
	);
	await page.click(selectors.submitButton);
	await page.waitForNavigation({ waitUntil: "networkidle2" });

	await page.goto(
		"https://lms.apollo.edu.vn/workspace/113/teacher-dashboard/pending-student-report"
	);
	return page;
}

async function goIntoThePage(config: Config = defaultConfig): Promise<Page> {
	const page = await initBrowserAndPage(config);
	return await login(page, config.email, config.password);
}

// Drop down action
async function dropDownAction(page: Page) {
	await page.click(selectors.dropdownControl);
	await page.waitForSelector(selectors.comboboxInput, { visible: true });

	await page.evaluate((gradebookOption) => {
		const options = Array.from(
			document.querySelectorAll("input[role='combobox']")
		) as HTMLElement[];
		const option = options.find((el) =>
			el.textContent?.includes(gradebookOption)
		);
		if (option) option.click();
	}, selectors.gradebookOption);
	// Wait for the page to load the gradebook data
	await new Promise((resolve) => setTimeout(resolve, 3000));
}

// Extract student comments from the page
async function extractStudentComments(page: Page): Promise<StudentComment[]> {
	try {
		const comments = await page.evaluate((commentSelectors) => {
			const studentComments: StudentComment[] = [];

			// Look for comment sections using configurable selectors
			const selectorString = commentSelectors.join(", ");
			const commentElements = document.querySelectorAll(selectorString);

			commentElements.forEach((element, index) => {
				const commentText = element.textContent?.trim();
				if (commentText && commentText.length > 0) {
					// Try to find student name from nearby elements
					const studentNameElement = element
						.closest(".student-row, .student-item")
						?.querySelector(".student-name, .name, .student-info");
					const studentName =
						studentNameElement?.textContent?.trim() ||
						`Student ${index + 1}`;

					studentComments.push({
						studentName,
						originalComment: commentText,
						timestamp: new Date().toISOString(),
					});
				}
			});

			// Alternative: look for table rows with comments
			const tableRows = document.querySelectorAll("tr");
			tableRows.forEach((row, index) => {
				const cells = row.querySelectorAll("td");
				if (cells.length >= 2) {
					const potentialName = cells[0]?.textContent?.trim();
					const potentialComment =
						cells[cells.length - 1]?.textContent?.trim();

					if (
						potentialComment &&
						potentialComment.length > 10 &&
						!potentialComment.match(/^\d+(\.\d+)?$/) && // Not just a number (grade)
						potentialName &&
						potentialName.length > 0
					) {
						studentComments.push({
							studentName: potentialName,
							originalComment: potentialComment,
							timestamp: new Date().toISOString(),
						});
					}
				}
			});

			return studentComments;
		}, selectors.commentSelectors);

		console.log(`Extracted ${comments.length} student comments`);
		return comments;
	} catch (error) {
		console.error("Error extracting comments:", error);
		return [];
	}
}

// Translate all student comments
async function translateComments(
	comments: StudentComment[],
	targetLanguage: string = "en"
): Promise<StudentComment[]> {
	const translationService = new TranslationService();
	const translatedComments: StudentComment[] = [];

	console.log("Starting translation process...");

	for (let i = 0; i < comments.length; i++) {
		const comment = comments[i];
		console.log(
			`Translating comment ${i + 1}/${comments.length} for ${
				comment.studentName
			}`
		);

		try {
			// Use free translation service to avoid API costs
			const result = await translationService.translateTextFree(
				comment.originalComment,
				targetLanguage
			);

			translatedComments.push({
				...comment,
				translatedComment: result.translatedText,
			});

			// Add delay to avoid rate limiting
			await new Promise((resolve) => setTimeout(resolve, 1000));
		} catch (error) {
			console.error(
				`Error translating comment for ${comment.studentName}:`,
				error
			);
			// Keep original comment if translation fails
			translatedComments.push({
				...comment,
				translatedComment: comment.originalComment,
			});
		}
	}

	return translatedComments;
}

// Save results to file
async function saveResults(
	comments: StudentComment[],
	outputPath: string = "./translated_comments.json"
): Promise<void> {
	try {
		const outputDir = path.dirname(outputPath);
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		const data = {
			timestamp: new Date().toISOString(),
			totalComments: comments.length,
			comments: comments,
		};

		fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
		console.log(`Results saved to: ${outputPath}`);

		// Also create a CSV file for easy viewing
		const csvPath = outputPath.replace(".json", ".csv");
		const csvHeader =
			"Student Name,Original Comment,Translated Comment,Timestamp\n";
		const csvRows = comments
			.map(
				(comment) =>
					`"${
						comment.studentName
					}","${comment.originalComment.replace(/"/g, '""')}","${
						comment.translatedComment?.replace(/"/g, '""') || ""
					}","${comment.timestamp || ""}"`
			)
			.join("\n");

		fs.writeFileSync(csvPath, csvHeader + csvRows);
		console.log(`CSV file saved to: ${csvPath}`);
	} catch (error) {
		console.error("Error saving results:", error);
	}
}

// Main process function
async function processCommentsTranslation(
	page: Page,
	targetLanguage: string = "en"
): Promise<void> {
	try {
		console.log("Starting comment extraction...");
		const comments = await extractStudentComments(page);

		if (comments.length === 0) {
			console.log(
				"No comments found on the page. Please check if you're on the correct page."
			);
			return;
		}

		console.log(
			`Found ${comments.length} comments. Starting translation...`
		);
		const translatedComments = await translateComments(
			comments,
			targetLanguage
		);

		const outputPath = path.join(
			__dirname,
			"..",
			"output",
			`translated_comments_${Date.now()}.json`
		);
		await saveResults(translatedComments, outputPath);

		console.log("Translation process completed successfully!");

		// Display summary
		console.log("\n=== TRANSLATION SUMMARY ===");
		translatedComments.forEach((comment, index) => {
			console.log(`\n${index + 1}. ${comment.studentName}`);
			console.log(
				`   Original: ${comment.originalComment.substring(0, 100)}${
					comment.originalComment.length > 100 ? "..." : ""
				}`
			);
			console.log(
				`   Translated: ${comment.translatedComment?.substring(
					0,
					100
				)}${
					(comment.translatedComment?.length || 0) > 100 ? "..." : ""
				}`
			);
		});
	} catch (error) {
		console.error("Error in translation process:", error);
	}
}

// fetch the page data with type
async function fetchPageData(page: Page): Promise<void> {
	const pageData = await page.evaluate(() => {
		const data = document.querySelector(
			"div.css-1s2u09g-control"
		)?.textContent;
		return data;
	});
	console.log("Page data:", pageData);
}

// Main execution
async function main(config: Config = defaultConfig) {
	try {
		console.log("Starting Apollo Comment Translation Tool...");
		console.log(`Target language: ${config.targetLanguage}`);
		console.log(`Translation service: ${config.translationService}`);

		const page = await goIntoThePage(config);

		console.log("Navigating to gradebook...");
		await dropDownAction(page);

		console.log("Processing comments for translation...");
		await processCommentsTranslation(page, config.targetLanguage);

		console.log("Process completed. Closing browser...");
		await page.browser().close();
	} catch (error) {
		console.error("Error in main process:", error);
	}
}

// Export main function for CLI usage
export { main };

// Run the main function only if this file is executed directly
if (require.main === module) {
	main();
}
