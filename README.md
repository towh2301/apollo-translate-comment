# Apollo Comment Translation Tool

An automated tool for extracting and translating student comments from Apollo LMS (Learning Management System).

## Features

-   🤖 **Automated Login**: Automatically logs into Apollo LMS
-   📊 **Data Extraction**: Extracts student comments from gradebook reports
-   🌐 **Translation**: Translates comments to your target language
-   💾 **Export Options**: Saves results in both JSON and CSV formats
-   ⚙️ **Configurable**: Easy configuration for different settings

## Prerequisites

-   Node.js (v14 or higher)
-   TypeScript
-   Chrome browser installed
-   Valid Apollo LMS credentials

## Installation

1. Clone or download this project
2. Install dependencies:
    ```bash
    npm install
    ```

## Configuration

Edit `src/config.ts` to customize your settings:

```typescript
export const defaultConfig: Config = {
	email: "your-email@apollo.edu.vn", // Your Apollo LMS email
	password: "your-password", // Your Apollo LMS password
	targetLanguage: "en", // Target language (en, vi, es, fr, etc.)
	translationService: "libre", // "libre" (free) or "google" (paid)
	headless: false, // Set to true to run browser in background
	devtools: true, // Set to false to disable dev tools
	outputFormat: "both", // "json", "csv", or "both"
	outputDirectory: "./output", // Where to save the results
};
```

### Supported Languages

-   `en` - English
-   `vi` - Vietnamese
-   `es` - Spanish
-   `fr` - French
-   `de` - German
-   `ja` - Japanese
-   `ko` - Korean
-   `zh` - Chinese
-   `th` - Thai
-   `id` - Indonesian

## Usage

### Method 1: Run with default configuration

```bash
npm run build
node dist/translate-comment.js
```

### Method 2: Use TypeScript directly

```bash
npx ts-node src/translate-comment.ts
```

### Method 3: Customize configuration

You can create a custom configuration file or modify the default settings in `src/config.ts`.

## How It Works

1. **Login**: The tool opens Chrome browser and logs into Apollo LMS
2. **Navigation**: Navigates to the teacher dashboard and selects "Gradebook Report"
3. **Extraction**: Scans the page for student comments using multiple selectors
4. **Translation**: Translates each comment using the selected translation service
5. **Export**: Saves the results to the output directory in JSON and/or CSV format

## Output

The tool generates two files in the `output/` directory:

### JSON Format (`translated_comments_[timestamp].json`)

```json
{
	"timestamp": "2025-06-12T22:36:00.000Z",
	"totalComments": 5,
	"comments": [
		{
			"studentName": "John Doe",
			"originalComment": "Bài tập rất hay và bổ ích",
			"translatedComment": "The assignment is very interesting and useful",
			"timestamp": "2025-06-12T22:36:00.000Z"
		}
	]
}
```

### CSV Format (`translated_comments_[timestamp].csv`)

| Student Name | Original Comment          | Translated Comment                            | Timestamp                |
| ------------ | ------------------------- | --------------------------------------------- | ------------------------ |
| John Doe     | Bài tập rất hay và bổ ích | The assignment is very interesting and useful | 2025-06-12T22:36:00.000Z |

## Troubleshooting

### Common Issues

1. **No comments found**:

    - Make sure you're on the correct page
    - Check if the page selectors need updating in `src/config.ts`

2. **Login fails**:

    - Verify your credentials in `src/config.ts`
    - Check if the login page layout has changed

3. **Translation errors**:

    - Free translation service (LibreTranslate) may have rate limits
    - Consider using Google Translate API for better reliability

4. **Browser doesn't open**:
    - Make sure Chrome is installed
    - Try setting `headless: true` in configuration

### Updating Selectors

If the Apollo LMS website changes its layout, you may need to update the selectors in `src/config.ts`:

```typescript
export const selectors = {
	emailInput: "#email",
	passwordInput: "#password",
	submitButton: 'button[type="submit"]',
	dropdownControl: "div.css-107uac7-control",
	// ... add new selectors as needed
};
```

## Development

### Project Structure

```
├── src/
│   ├── config.ts              # Configuration settings
│   ├── translate-comment.ts   # Main application logic
│   └── test.ts               # Test file
├── output/                   # Generated translation files
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
npm run build
```

### Adding New Translation Services

You can extend the `TranslationService` class to add support for other translation APIs:

```typescript
async translateTextCustom(text: string, targetLanguage: string): Promise<TranslationResult> {
	// Your custom translation logic here
}
```

## Security Notes

-   Keep your credentials secure and don't commit them to version control
-   Consider using environment variables for sensitive data
-   The tool runs in non-headless mode by default for transparency

## License

This project is for educational purposes. Please respect Apollo LMS terms of service and use responsibly.

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify the website hasn't changed its layout
3. Update selectors in configuration if needed
4. Try running with `headless: false` to see what's happening
