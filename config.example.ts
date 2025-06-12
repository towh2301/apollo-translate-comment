// Example configuration file
// Copy this to src/config.ts and modify with your settings

import { Config } from "./src/config";

export const myConfig: Config = {
	// Your Apollo LMS credentials
	email: "your-email@apollo.edu.vn",
	password: "your-password-here",

	// Translation settings
	targetLanguage: "en", // Change to: vi, es, fr, de, ja, ko, zh, th, id
	translationService: "libre", // "libre" (free) or "google" (requires API key)

	// Browser settings
	headless: false, // Set to true to hide browser window
	devtools: true, // Set to false to disable dev tools

	// Output settings
	outputFormat: "both", // "json", "csv", or "both"
	outputDirectory: "./output",
};

// Usage examples:
// npm run dev-cli -- --language vi --headless
// npm run dev-cli -- --email your@email.com --password yourpass
// npm run dev-cli -- --help
