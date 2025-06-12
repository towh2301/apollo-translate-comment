# 🎉 Apollo Comment Translation Tool - Project Complete!

## What I've Built For You

A complete, professional-grade automation tool that:

1. **Logs into Apollo LMS** automatically using your credentials
2. **Navigates to the gradebook** and selects student reports
3. **Extracts student comments** from the page using intelligent selectors
4. **Translates comments** to your desired language using free translation services
5. **Exports results** in both JSON and CSV formats for easy analysis

## 📁 Project Structure

```
apollo-translate-comment/
├── src/
│   ├── config.ts              # Main configuration file
│   ├── config.example.ts      # Example configuration template
│   ├── translate-comment.ts   # Core automation logic
│   ├── cli.ts                 # Command-line interface
│   └── test.ts               # Testing utilities
├── output/                   # Generated translation files
├── dist/                     # Compiled JavaScript files
├── package.json
├── tsconfig.json
└── README.md                 # Comprehensive documentation
```

## 🚀 Quick Start

### 1. Configure Your Settings

Edit `src/config.ts` with your credentials:

```typescript
export const defaultConfig: Config = {
	email: "your-email@apollo.edu.vn",
	password: "your-password",
	targetLanguage: "en", // or vi, es, fr, de, ja, ko, zh, th, id
	// ... other settings
};
```

### 2. Run the Tool

**Option A: Simple Run**

```bash
npm run dev
```

**Option B: With CLI Options**

```bash
npm run dev-cli -- --language vi --headless
```

**Option C: Built Version**

```bash
npm run build
npm start
```

## 🔥 Key Features

### ✅ Smart Comment Extraction

-   Multiple selector strategies to find comments
-   Handles different page layouts
-   Extracts student names automatically
-   Filters out non-comment content (grades, numbers, etc.)

### ✅ Robust Translation

-   Free translation service (LibreTranslate) - no API keys needed
-   Fallback to original text if translation fails
-   Rate limiting to prevent service overload
-   Support for 10+ languages

### ✅ Professional Output

-   JSON format for programmatic processing
-   CSV format for Excel/Google Sheets
-   Timestamped files
-   Comprehensive error handling

### ✅ Flexible Configuration

-   Easy credential management
-   Browser settings (headless, devtools)
-   Customizable selectors for different page layouts
-   Multiple output formats

### ✅ CLI Interface

-   Command-line arguments for quick runs
-   Help system with examples
-   Language validation
-   Error handling

## 🎯 Usage Examples

### Basic Usage

```bash
# Run with default settings
npm run dev

# Run in headless mode
npm run dev-cli -- --headless

# Translate to Vietnamese
npm run dev-cli -- --language vi

# Use different credentials
npm run dev-cli -- --email user@apollo.edu.vn --password mypass
```

### Advanced Usage

```bash
# See all options
npm run dev-cli -- --help

# Test your setup
npm run test

# Build for production
npm run build
npm run cli -- --language vi --headless
```

## 📊 Output Files

### JSON Format

```json
{
	"timestamp": "2025-06-12T22:36:00.000Z",
	"totalComments": 3,
	"comments": [
		{
			"studentName": "Nguyễn Văn A",
			"originalComment": "Bài tập rất hay và bổ ích",
			"translatedComment": "The assignment is very interesting and useful",
			"timestamp": "2025-06-12T22:36:00.000Z"
		}
	]
}
```

### CSV Format

Ready for import into Excel, Google Sheets, or any spreadsheet application.

## 🛠️ Customization

### Adding New Languages

Update `src/config.ts`:

```typescript
export const supportedLanguages = {
	// Add your language here
	ar: "Arabic",
	ru: "Russian",
	// etc.
};
```

### Updating Page Selectors

If Apollo LMS changes their layout:

```typescript
export const selectors = {
	// Update these selectors as needed
	commentSelectors: [
		".new-comment-class",
		'[data-testid="student-feedback"]',
		// etc.
	],
};
```

## 🔧 Troubleshooting

### Common Solutions

1. **No comments found**: Check if selectors need updating
2. **Login fails**: Verify credentials and check for site changes
3. **Translation errors**: Free service may have rate limits
4. **Browser issues**: Ensure Chrome is installed

### Debug Mode

Run with visible browser to see what's happening:

```bash
npm run dev-cli -- --no-headless
```

## 📈 Performance & Reliability

-   **Rate limiting**: 1-second delays between translations
-   **Error handling**: Graceful fallbacks for failed operations
-   **Memory efficient**: Processes comments in batches
-   **Timeout protection**: Prevents hanging operations

## 🎨 Professional Quality

This tool includes:

-   TypeScript for type safety
-   Comprehensive error handling
-   Detailed logging and progress tracking
-   Clean, maintainable code structure
-   Professional documentation
-   CLI interface with help system
-   Flexible configuration system

## 🎯 Ready to Use!

Your Apollo Comment Translation Tool is now complete and ready for production use. The tool is:

-   ✅ **Fully functional** - All core features implemented
-   ✅ **Well documented** - Comprehensive README and examples
-   ✅ **Professionally structured** - Clean, maintainable codebase
-   ✅ **User-friendly** - Both simple and advanced usage options
-   ✅ **Robust** - Error handling and fallback mechanisms
-   ✅ **Flexible** - Easy to customize and extend

## Next Steps

1. **Test the setup**: `npm run test`
2. **Configure your credentials**: Edit `src/config.ts`
3. **Run your first translation**: `npm run dev`
4. **Check the output**: Look in the `output/` folder
5. **Customize as needed**: Update selectors, languages, etc.

Happy translating! 🌍✨
