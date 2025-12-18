# PDF Page Size Inspector

A modern, browser-based tool to upload a PDF and analyze comprehensive page dimensions with professional features and a beautiful, responsive interface. Detect page sizes in **pixels**, **points**, **inches**, **millimeters**, and **centimeters**, along with orientation, aspect ratio, and standard paper format matching.

This project uses **HTML**, **CSS**, **JavaScript**, and **PDF.js** to run entirely in the browser with no backend required.

## ✨ Features

### 📤 Upload & Analysis
- **Drag-and-drop support** - Simply drag PDF files into the browser
- **File information display** - Shows filename, file size, and total pages
- **Real-time analysis** - Instant processing with loading indicator
- **Multi-page support** - Analyzes every page individually

### 📏 Comprehensive Measurements
Report sizes in multiple units:
  - **Pixels (px)** - Screen/digital dimensions
  - **Points (pt)** - PDF native unit (1/72 inch)
  - **Inches (in)** - Imperial measurement
  - **Millimeters (mm)** - Metric measurement
  - **Centimeters (cm)** - Metric measurement

### 📊 Advanced Information
- **Page orientation detection** - Portrait, Landscape, or Square
- **Aspect ratio calculation** - Shows width:height ratio for each page
- **Paper size matching** - Identifies standard formats (A-series, Letter, Legal, Tabloid)
- **Uniformity detection** - Indicates if all pages have the same dimensions
- **Statistics summary** - Min/max dimensions, most common size, orientation counts

### 💾 Export & Share
- **Export to CSV** - Download analysis results in spreadsheet format
- **Export to JSON** - Get structured data for developers
- **Copy to clipboard** - Quick copy of results for sharing

### 🎨 Modern UI/UX
- **Beautiful gradient design** - Eye-catching purple/blue gradient theme
- **Card-based layout** - Clean, organized information display
- **SVG icons** - Crisp, scalable vector graphics
- **Smooth animations** - Polished transitions and hover effects
- **Fully responsive** - Perfect on mobile, tablet, and desktop
- **Professional table design** - Easy-to-read data presentation

## 🚀 Live Demo

Deploy on **GitHub Pages** or any static hosting provider for instant access.

## 📸 Screenshots

### Desktop View
![Desktop Interface](https://github.com/user-attachments/assets/559408d2-06cc-4e4a-a82f-0bbd583deae3)

### Mobile View
![Mobile Interface](https://github.com/user-attachments/assets/3fc13bb5-19de-4ce9-b80e-47f02c939827)

### Tablet View
![Tablet Interface](https://github.com/user-attachments/assets/a2086ed0-440a-41d8-8b3b-346c88c5a285)

## 🎯 Getting Started

### Prerequisites

This tool runs entirely in the browser. There are no build tools or backend servers required. You only need:

- A modern web browser (Chrome, Firefox, Edge, Safari)
- The project files

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/BaseMax/pdf-page-size-inspector.git
   cd pdf-page-size-inspector
   ```

2. Open `index.html` in your browser, or serve it using any static web server:
   ```sh
   # Using Python
   python -m http.server 8080
   
   # Using Node.js
   npx serve
   ```

3. Navigate to `http://localhost:8080` in your browser.

Alternatively, you can deploy it on **GitHub Pages** or any static hosting provider like Netlify or Vercel.

## 📖 Usage

### Basic Usage
1. Open the app in your browser
2. **Drag and drop** a PDF file into the drop zone, or click **browse** to select a file
3. Wait for the analysis to complete (loading spinner will appear)
4. View comprehensive results including:
   - File information (name, size, page count)
   - Detailed page dimensions in all units
   - Orientation and aspect ratio for each page
   - Paper size identification
   - Statistical summary

### Export Results
- **CSV Export**: Click "Export CSV" to download a spreadsheet with all measurements
- **JSON Export**: Click "Export JSON" to get structured data for programmatic use
- **Copy Results**: Click "Copy Results" to copy a text summary to your clipboard

### Understanding the Results
- **Green summary bar**: All pages have uniform dimensions
- **Yellow summary bar**: PDF contains pages with varying sizes
- **Statistics section**: Shows dimension ranges, most common paper size, and orientation counts

## 📄 Supported Paper Sizes

The application automatically identifies these standard paper formats:

### ISO A-Series
* **A0** - 841 × 1189 mm (33.1 × 46.8 in)
* **A1** - 594 × 841 mm (23.4 × 33.1 in)
* **A2** - 420 × 594 mm (16.5 × 23.4 in)
* **A3** - 297 × 420 mm (11.7 × 16.5 in)
* **A4** - 210 × 297 mm (8.3 × 11.7 in)
* **A5** - 148 × 210 mm (5.8 × 8.3 in)
* **A6** - 105 × 148 mm (4.1 × 5.8 in)

### North American Standards
* **Letter** - 216 × 279 mm (8.5 × 11 in)
* **Legal** - 216 × 356 mm (8.5 × 14 in)
* **Tabloid** - 279 × 432 mm (11 × 17 in)

Pages that don't match standard formats are marked as **Custom**.

## 📁 File Structure

```
pdf-page-size-inspector/
├── index.html         # Main HTML interface with semantic structure
├── style.css          # Modern CSS with responsive design
├── script.js          # Analysis logic and interactive features
├── pdf.min.js         # PDF.js library (Mozilla)
├── pdf.worker.min.js  # PDF.js web worker
├── .gitignore         # Git ignore patterns
├── LICENSE            # MIT License
└── README.md          # This file
```

## 🛠️ Built With

* **HTML5** - Semantic structure with accessibility in mind
* **CSS3** - Modern responsive design with CSS Grid and Flexbox
* **Vanilla JavaScript** - No framework dependencies, pure ES6+
* **PDF.js** (Mozilla) - Industry-standard PDF parsing and rendering
* **SVG Icons** - Crisp, scalable vector graphics

### Key Technologies & Features
- **CSS Custom Properties** - Dynamic theming with CSS variables
- **CSS Grid & Flexbox** - Responsive layouts that adapt to any screen
- **Async/Await** - Modern asynchronous JavaScript
- **File API** - Browser-native file handling
- **Clipboard API** - One-click copy functionality
- **Drag and Drop API** - Intuitive file upload experience

## 🤝 Contributing

Contributions are welcome! Here are some ways you can contribute:

### Ideas for Contribution
* 🐛 Fix bugs or improve error handling
* 🎨 Enhance UI/UX with new features or improvements
* 📊 Add support for additional paper formats
* 🌐 Add internationalization (i18n) support
* ⚡ Performance optimizations
* 📱 PWA (Progressive Web App) support
* 🔒 Security improvements
* 📝 Documentation improvements
* ♿ Accessibility enhancements

### Steps to Contribute

1. **Fork** the repository
2. **Create** a feature branch
   ```sh
   git checkout -b feature/amazing-feature
   ```
3. **Make** your changes
4. **Test** thoroughly across different browsers and devices
5. **Commit** your changes
   ```sh
   git commit -m 'Add some amazing feature'
   ```
6. **Push** to your branch
   ```sh
   git push origin feature/amazing-feature
   ```
7. **Open** a Pull Request

Please ensure your code follows the existing style and includes appropriate comments.

## 🌟 Changelog

### Version 2.0 (Latest)
- ✨ Complete UI/UX redesign with modern gradient theme
- 🖱️ Drag-and-drop file upload support
- 📊 Statistics dashboard with detailed metrics
- 📏 Added Points (pt) and Inches (in) measurements
- 📐 Orientation detection (Portrait/Landscape/Square)
- 📊 Aspect ratio calculation
- 💾 Export to CSV and JSON formats
- 📋 Copy results to clipboard
- 📱 Fully responsive design for all devices
- 🎨 SVG icons throughout the interface
- ⚡ Loading spinner and better user feedback
- 📄 File information display (name, size, pages)
- 📈 Enhanced statistics (min/max, most common size, orientation counts)

### Version 1.0
- Basic PDF page size detection
- Support for multiple measurement units
- Standard paper size matching
- Simple table display

## 📄 License

This project is released under the **MIT License**.

Copyright 2025, Seyyed Ali Mohammadiyeh (Max Base)

## 🙏 Acknowledgments

- **PDF.js** by Mozilla - Excellent PDF rendering library
- **Contributors** - Thank you to all who have contributed to this project

## 📧 Contact & Support

- **Author**: Seyyed Ali Mohammadiyeh (Max Base)
- **GitHub**: [@BaseMax](https://github.com/BaseMax)
- **Repository**: [pdf-page-size-inspector](https://github.com/BaseMax/pdf-page-size-inspector)

Found a bug or have a feature request? [Open an issue](https://github.com/BaseMax/pdf-page-size-inspector/issues) on GitHub!

---

Made with ❤️ by [Max Base](https://github.com/BaseMax)
