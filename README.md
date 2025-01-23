# Web Feedback Scraper

A flexible Chrome extension designed to collect and analyze feedback data from public feature request pages. This tool allows you to easily collect feedback posts while browsing and manage them through a convenient dashboard.

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

## Installation
1. Clone the repository:
```bash
git clone https://github.com/katrinavassell/web-feedback-scraper.git
cd web-feedback-scraper
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
streamlit run main.py
```

## Usage
1. Enter the URL of a public feedback page in the input field
2. Wait for the scraping process to complete
3. Use the filters to analyze the data:
   - Set minimum vote count
   - Search within titles
4. Export the filtered data as CSV

## GitHub Pages Setup

To deploy the landing page:

1. Go to repository Settings > Pages
2. Under "Build and deployment", set:
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/docs"
3. Click Save
4. Wait a few minutes for the site to be deployed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.# web-scraper
