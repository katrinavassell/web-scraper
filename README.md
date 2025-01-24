# Web Feedback Scraper

A flexible Chrome extension designed to collect and analyze feedback data from public feature request pages. This tool allows you to easily collect feedback posts while browsing and manage them through a convenient dashboard.

https://web-scraper-kscnbt2abkdddcmdsvae7g.streamlit.app/

## Features

- Collect feedback posts directly from the website
- Filter collected posts by vote count
- Search through collected posts by title
- Export data to CSV format
- Clean, modern UI with responsive design

## Chrome Extension Installation

1. Clone the repository:
```bash
git clone https://github.com/katrinavassell/web-feedback-scraper.git
cd web-feedback-scraper
```

2. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the repository folder

## Usage

1. Visit a feedback page (e.g., feedback.canny.io)
2. Click the "+ Collect" button next to any post you want to save
3. Click the extension icon in Chrome to:
   - View collected posts
   - Filter by minimum votes
   - Search within titles
   - Export data as CSV

## Tech Stack

- HTML/CSS for popup interface
- JavaScript for extension functionality
- Chrome Extension APIs
- Local storage for data persistence

## Local Installation

1. Clone the repository:
```bash
git clone https://github.com/katrinavassell/web-scraper.git
cd web-scraper
```

2. Install dependencies:
```bash
pip install .
```

3. Run the application locally:
```bash
streamlit run main.py
```

## Pushing Changes

1. Check changes
```bash
git status
```

2. Stage changes for commit
```bash
git add .
```

3. Commit Your Changes
```bash
git commit -m "Update Chrome extension files and deployment setup"
```

4. Push to GitHub
```bash
git push origin main
```

## Deploying on Streamlit

To deploy the landing page:

1. Go to Streamlit Community Cloud
2. Sign in with your GitHub account.
3. Click "New App"
4. Select your repository
5. Choose the branch (main) and entiry point (main.py)
6. Deploy the app

## The Extension

- Manifest: Blueprint of the extension, declares its components.
- Background Script: Event-driven backend functionality.
- Content Script: Frontend functionality injected into webpages.
- Popup Script: Logic for the extension's popup interface.

Modifying the extension:
- Interaction with webpages? → Modify content.js.
- Background processes or messaging? → Modify background.js.
- Popup behavior? → Modify popup.js.
- Permissions or file structure? → Modify manifest.json.

## Usage
1. Enter the URL of a public feedback page in the input field
2. Wait for the scraping process to complete
3. Use the filters to analyze the data:
   - Set minimum vote count
   - Search within titles
4. Export the filtered data as CSV

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.# web-scraper
