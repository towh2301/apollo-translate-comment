#!/usr/bin/env node

import { defaultConfig, Config, supportedLanguages } from "./config";
import { main } from "./translate-comment";

// Simple CLI argument parsing
function parseArgs(): Partial<Config> {
	const args = process.argv.slice(2);
	const config: Partial<Config> = {};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		const nextArg = args[i + 1];

		switch (arg) {
			case "--email":
				if (nextArg) config.email = nextArg;
				i++;
				break;
			case "--password":
				if (nextArg) config.password = nextArg;
				i++;
				break;
			case "--language":
				if (nextArg && nextArg in supportedLanguages) {
					config.targetLanguage = nextArg;
				}
				i++;
				break;
			case "--headless":
				config.headless = true;
				break;
			case "--no-devtools":
				config.devtools = false;
				break;
			case "--help":
			case "-h":
				showHelp();
				process.exit(0);
				break;
		}
	}

	return config;
}

function showHelp() {
	console.log(`
Apollo Comment Translation Tool

Usage: node dist/cli.js [options]

Options:
  --email <email>       Apollo LMS email address
  --password <password> Apollo LMS password
  --language <code>     Target language code (default: en)
  --headless           Run browser in headless mode
  --no-devtools        Disable browser dev tools
  --help, -h           Show this help message

Supported Languages:
${Object.entries(supportedLanguages)
	.map(([code, name]) => `  ${code.padEnd(4)} ${name}`)
	.join("\n")}

Examples:
  node dist/cli.js --language vi --headless
  node dist/cli.js --email user@apollo.edu.vn --password mypass
  node dist/cli.js --help
`);
}

// Run the CLI
async function runCLI() {
	try {
		const cliConfig = parseArgs();
		const finalConfig: Config = { ...defaultConfig, ...cliConfig };

		console.log("🚀 Starting Apollo Comment Translation Tool...\n");

		// Call the main function with the merged configuration
		await main(finalConfig);
	} catch (error) {
		console.error("❌ CLI Error:", error);
		process.exit(1);
	}
}

// Export the main function for use in other files
export { main };

// Run CLI if this file is executed directly
if (require.main === module) {
	runCLI();
}
