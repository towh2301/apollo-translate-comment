import puppeteer from "puppeteer-core";
import { Browser, Page } from "puppeteer-core";
import { defaultConfig } from "./config";

// Simple test to verify browser automation works
async function testBrowserSetup() {
	console.log("Testing browser setup...");

	try {
		const browser = await puppeteer.launch({
			channel: "chrome",
			headless: false,
			devtools: true,
		});

		const page = await browser.newPage();
		console.log("✅ Browser launched successfully");

		await page.goto("https://www.google.com", {
			waitUntil: "networkidle2",
		});
		console.log("✅ Navigation works");

		const title = await page.title();
		console.log(`✅ Page title: ${title}`);

		await browser.close();
		console.log("✅ Browser closed successfully");

		console.log("\n🎉 All tests passed! Your setup is ready.");
	} catch (error) {
		console.error("❌ Test failed:", error);
		console.log("\n💡 Make sure Chrome is installed and try again.");
	}
}

// Test configuration
async function testConfiguration() {
	console.log("\nTesting configuration...");
	console.log(`Email: ${defaultConfig.email}`);
	console.log(`Target Language: ${defaultConfig.targetLanguage}`);
	console.log(`Headless: ${defaultConfig.headless}`);
	console.log(`Translation Service: ${defaultConfig.translationService}`);
	console.log("✅ Configuration loaded successfully");
}

async function runTests() {
	console.log("🧪 Running Apollo Comment Translation Tool Tests\n");

	await testConfiguration();
	await testBrowserSetup();
}

runTests();
