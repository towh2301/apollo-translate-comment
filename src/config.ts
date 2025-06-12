// Configuration for the Apollo Comment Translation Tool

export interface Config {
	// Login credentials
	email: string;
	password: string;

	// Translation settings
	targetLanguage: string;
	translationService: "google" | "libre";

	// Browser settings
	headless: boolean;
	devtools: boolean;

	// Output settings
	outputFormat: "json" | "csv" | "both";
	outputDirectory: string;
}

export const defaultConfig: Config = {
	email: "ec.bd3@apollo.edu.vn",
	password: "Active123!",
	targetLanguage: "en", // English
	translationService: "libre", // Free service
	headless: false,
	devtools: true,
	outputFormat: "both",
	outputDirectory: "./output",
};

// Supported languages for translation
export const supportedLanguages = {
	en: "English",
	vi: "Vietnamese",
	es: "Spanish",
	fr: "French",
	de: "German",
	ja: "Japanese",
	ko: "Korean",
	zh: "Chinese",
	th: "Thai",
	id: "Indonesian",
};

// Page selectors that might need adjustment based on site updates
export const selectors = {
	emailInput: "#email",
	passwordInput: "#password",
	submitButton: 'button[type="submit"]',
	dropdownControl: "div.css-107uac7-control",
	comboboxInput: 'input[role="combobox"]',
	gradebookOption: "Gradebook Report",
	commentSelectors: [
		".comment-section",
		".student-feedback",
		'[data-testid*="comment"]',
		".feedback-text",
		".comment-text",
		".student-comment",
	],
};
