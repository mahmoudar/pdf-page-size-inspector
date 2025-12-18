// DOM Elements
const pdfInput = document.getElementById("pdfInput");
const dropZone = document.getElementById("dropZone");
const table = document.getElementById("resultTable");
const tbody = table.querySelector("tbody");
const summary = document.getElementById("summary");
const loadingSpinner = document.getElementById("loadingSpinner");
const fileInfo = document.getElementById("fileInfo");
const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const totalPages = document.getElementById("totalPages");
const statistics = document.getElementById("statistics");
const actions = document.getElementById("actions");
const exportCSVBtn = document.getElementById("exportCSV");
const exportJSONBtn = document.getElementById("exportJSON");
const copyResultsBtn = document.getElementById("copyResults");

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = "pdf.worker.min.js";

// Paper sizes database (in mm)
const PAPER_SIZES = [
  { name: "A0", w: 841, h: 1189 },
  { name: "A1", w: 594, h: 841 },
  { name: "A2", w: 420, h: 594 },
  { name: "A3", w: 297, h: 420 },
  { name: "A4", w: 210, h: 297 },
  { name: "A5", w: 148, h: 210 },
  { name: "A6", w: 105, h: 148 },
  { name: "Letter", w: 216, h: 279 },
  { name: "Legal", w: 216, h: 356 },
  { name: "Tabloid", w: 279, h: 432 }
];

// Store results globally for export
let analysisResults = [];
let currentFileName = "";

// Utility functions
function ptToMm(pt) {
  return (pt * 25.4) / 72;
}

function ptToInch(pt) {
  return pt / 72;
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function getOrientation(width, height) {
  if (Math.abs(width - height) < 5) return "Square";
  return width > height ? "Landscape" : "Portrait";
}

function calculateAspectRatio(width, height) {
  // Iterative GCD to avoid stack overflow with large numbers
  const gcd = (a, b) => {
    while (b !== 0) {
      [a, b] = [b, a % b];
    }
    return a;
  };
  const divisor = gcd(Math.round(width), Math.round(height));
  const w = Math.round(width / divisor);
  const h = Math.round(height / divisor);
  return `${w}:${h}`;
}

function matchPaper(mmW, mmH) {
  const tolerance = 3;
  for (const p of PAPER_SIZES) {
    const match =
      (Math.abs(mmW - p.w) < tolerance &&
       Math.abs(mmH - p.h) < tolerance) ||
      (Math.abs(mmW - p.h) < tolerance &&
       Math.abs(mmH - p.w) < tolerance);
    if (match) return p.name;
  }
  return "Custom";
}

// Drag and drop handlers
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drag-over");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  const files = e.dataTransfer.files;
  if (files.length > 0 && files[0].type === "application/pdf") {
    pdfInput.files = files;
    handleFileUpload(files[0]);
  }
});

dropZone.addEventListener("click", () => {
  pdfInput.click();
});

// File input handler
pdfInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    handleFileUpload(file);
  }
});

// Main file processing function
async function handleFileUpload(file) {
  // Reset UI
  tbody.innerHTML = "";
  analysisResults = [];
  currentFileName = file.name;
  
  // Hide previous results
  summary.className = "summary hidden";
  table.classList.add("hidden");
  fileInfo.classList.add("hidden");
  statistics.classList.add("hidden");
  actions.classList.add("hidden");
  
  // Show loading
  loadingSpinner.classList.remove("hidden");

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    // Display file info
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    totalPages.textContent = pdf.numPages;
    fileInfo.classList.remove("hidden");

    const sizes = [];
    const paperTypes = [];

    // Process each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1 });

      const widthPt = viewport.width;
      const heightPt = viewport.height;

      const widthMm = ptToMm(widthPt);
      const heightMm = ptToMm(heightPt);
      const widthCm = widthMm / 10;
      const heightCm = heightMm / 10;
      const widthIn = ptToInch(widthPt);
      const heightIn = ptToInch(heightPt);

      const paper = matchPaper(widthMm, heightMm);
      const orientation = getOrientation(widthPt, heightPt);
      const aspectRatio = calculateAspectRatio(widthPt, heightPt);

      sizes.push(`${Math.round(widthMm)}x${Math.round(heightMm)}`);
      paperTypes.push(paper);

      // Store result
      const result = {
        page: i,
        widthPx: Math.round(widthPt),
        heightPx: Math.round(heightPt),
        widthPt: widthPt.toFixed(2),
        heightPt: heightPt.toFixed(2),
        widthIn: widthIn.toFixed(2),
        heightIn: heightIn.toFixed(2),
        widthMm: widthMm.toFixed(1),
        heightMm: heightMm.toFixed(1),
        widthCm: widthCm.toFixed(2),
        heightCm: heightCm.toFixed(2),
        orientation,
        aspectRatio,
        paper
      };
      analysisResults.push(result);

      // Create table row
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${i}</td>
        <td>${result.widthPx} × ${result.heightPx}</td>
        <td>${result.widthPt} × ${result.heightPt}</td>
        <td>${result.widthIn} × ${result.heightIn}</td>
        <td>${result.widthMm} × ${result.heightMm}</td>
        <td>${result.widthCm} × ${result.heightCm}</td>
        <td>${orientation}</td>
        <td>${aspectRatio}</td>
        <td><strong>${paper}</strong></td>
      `;
      tbody.appendChild(row);
    }

    // Hide loading, show results
    loadingSpinner.classList.add("hidden");
    table.classList.remove("hidden");
    actions.classList.remove("hidden");

    // Display summary
    const allSame = sizes.every(s => s === sizes[0]);
    summary.classList.remove("hidden");
    summary.classList.add(allSame ? "same" : "diff");
    summary.innerHTML = allSame
      ? `<strong>✓</strong> All pages have the same dimensions.`
      : `<strong>⚠</strong> This PDF contains pages with different sizes.`;

    // Display statistics
    displayStatistics(analysisResults, paperTypes);
    
  } catch (error) {
    loadingSpinner.classList.add("hidden");
    alert("Error processing PDF: " + error.message);
    console.error(error);
  }
}

// Display statistics
function displayStatistics(results, paperTypes) {
  // Calculate statistics
  const widthsMm = results.map(r => parseFloat(r.widthMm));
  const heightsMm = results.map(r => parseFloat(r.heightMm));
  
  const minWidth = Math.min(...widthsMm).toFixed(1);
  const maxWidth = Math.max(...widthsMm).toFixed(1);
  const minHeight = Math.min(...heightsMm).toFixed(1);
  const maxHeight = Math.max(...heightsMm).toFixed(1);

  // Most common paper size
  const paperCount = {};
  paperTypes.forEach(type => {
    paperCount[type] = (paperCount[type] || 0) + 1;
  });
  const mostCommonPaper = Object.keys(paperCount).length > 0
    ? Object.keys(paperCount).reduce((a, b) => 
        paperCount[a] > paperCount[b] ? a : b
      )
    : 'None';

  // Count orientations
  const orientations = results.map(r => r.orientation);
  const portraitCount = orientations.filter(o => o === "Portrait").length;
  const landscapeCount = orientations.filter(o => o === "Landscape").length;
  const squareCount = orientations.filter(o => o === "Square").length;

  statistics.innerHTML = `
    <h3>📊 Statistics</h3>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Dimensions Range (mm)</div>
        <div class="stat-value">${minWidth}–${maxWidth} × ${minHeight}–${maxHeight}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Most Common Size</div>
        <div class="stat-value">${mostCommonPaper} (${paperCount[mostCommonPaper]})</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Portrait Pages</div>
        <div class="stat-value">${portraitCount}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Landscape Pages</div>
        <div class="stat-value">${landscapeCount}</div>
      </div>
      ${squareCount > 0 ? `
      <div class="stat-card">
        <div class="stat-label">Square Pages</div>
        <div class="stat-value">${squareCount}</div>
      </div>
      ` : ''}
    </div>
  `;
  statistics.classList.remove("hidden");
}

// Export to CSV
exportCSVBtn.addEventListener("click", () => {
  if (analysisResults.length === 0) return;

  const headers = ["Page", "Width (px)", "Height (px)", "Width (pt)", "Height (pt)", 
                   "Width (in)", "Height (in)", "Width (mm)", "Height (mm)", 
                   "Width (cm)", "Height (cm)", "Orientation", "Aspect Ratio", "Paper Size"];
  
  const rows = analysisResults.map(r => [
    r.page,
    r.widthPx,
    r.heightPx,
    r.widthPt,
    r.heightPt,
    r.widthIn,
    r.heightIn,
    r.widthMm,
    r.heightMm,
    r.widthCm,
    r.heightCm,
    r.orientation,
    r.aspectRatio,
    r.paper
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  downloadFile(csvContent, currentFileName.replace(".pdf", "_analysis.csv"), "text/csv");
});

// Export to JSON
exportJSONBtn.addEventListener("click", () => {
  if (analysisResults.length === 0) return;

  const jsonData = {
    filename: currentFileName,
    totalPages: analysisResults.length,
    pages: analysisResults
  };

  const jsonContent = JSON.stringify(jsonData, null, 2);
  downloadFile(jsonContent, currentFileName.replace(".pdf", "_analysis.json"), "application/json");
});

// Copy results to clipboard
copyResultsBtn.addEventListener("click", async () => {
  if (analysisResults.length === 0) return;

  const textContent = analysisResults.map(r => 
    `Page ${r.page}: ${r.widthMm}×${r.heightMm} mm (${r.paper}, ${r.orientation})`
  ).join("\n");

  try {
    await navigator.clipboard.writeText(textContent);
    const originalText = copyResultsBtn.innerHTML;
    copyResultsBtn.innerHTML = `
      <svg class="icon-small" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Copied!
    `;
    setTimeout(() => {
      copyResultsBtn.innerHTML = originalText;
    }, 2000);
  } catch (err) {
    alert("Failed to copy to clipboard. Please ensure your browser supports clipboard access and try again.");
  }
});

// Download file helper
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
