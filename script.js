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

pdfjsLib.GlobalWorkerOptions.workerSrc = "pdf.worker.min.js";

const PAGE_SIZES = [
  // ISO 216 (A series)
  { name: "A0", w: 841, h: 1189 },
  { name: "A1", w: 594, h: 841 },
  { name: "A2", w: 420, h: 594 },
  { name: "A3", w: 297, h: 420 },
  { name: "A4", w: 210, h: 297 },
  { name: "A5", w: 148, h: 210 },
  { name: "A6", w: 105, h: 148 },
  { name: "A7", w: 74, h: 105 },
  { name: "A8", w: 52, h: 74 },

  // ISO 216 (B series – books, posters)
  { name: "B0", w: 1000, h: 1414 },
  { name: "B1", w: 707, h: 1000 },
  { name: "B2", w: 500, h: 707 },
  { name: "B3", w: 353, h: 500 },
  { name: "B4", w: 250, h: 353 },
  { name: "B5", w: 176, h: 250 },
  { name: "B6", w: 125, h: 176 },

  // ISO 269 (C series – envelopes)
  { name: "C4", w: 229, h: 324 },
  { name: "C5", w: 162, h: 229 },
  { name: "C6", w: 114, h: 162 },

  // US sizes
  { name: "Letter", w: 216, h: 279 },
  { name: "Legal", w: 216, h: 356 },
  { name: "Tabloid", w: 279, h: 432 },
  { name: "Executive", w: 184, h: 267 },

  // ANSI sizes
  { name: "ANSI A", w: 216, h: 279 },
  { name: "ANSI B", w: 279, h: 432 },
  { name: "ANSI C", w: 432, h: 559 },
  { name: "ANSI D", w: 559, h: 864 },
  { name: "ANSI E", w: 864, h: 1118 },

  // Common book / publishing trims
  { name: "Mass Market Paperback", w: 107, h: 174 },
  { name: "Digest", w: 140, h: 216 },
  { name: "Trade Paperback", w: 152, h: 229 },
  { name: "US Trade", w: 152, h: 229 },
  { name: "Royal", w: 156, h: 234 },
  { name: "Crown Quarto", w: 189, h: 246 },
  { name: "Demy Octavo", w: 138, h: 216 },

  // Comic / manga
  { name: "Comic Book", w: 170, h: 260 },
  { name: "Manga (Tankōbon)", w: 128, h: 182 },

  // Photo sizes (common in PDFs)
  { name: "4x6 Photo", w: 102, h: 152 },
  { name: "5x7 Photo", w: 127, h: 178 },
  { name: "8x10 Photo", w: 203, h: 254 }
];

let analysisResults = [];
let currentFileName = "";

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

pdfInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    handleFileUpload(file);
  }
});

async function handleFileUpload(file) {
  tbody.innerHTML = "";
  analysisResults = [];
  currentFileName = file.name;
  
  summary.className = "summary hidden";
  table.classList.add("hidden");
  fileInfo.classList.add("hidden");
  statistics.classList.add("hidden");
  actions.classList.add("hidden");
  
  loadingSpinner.classList.remove("hidden");

  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    totalPages.textContent = pdf.numPages;
    fileInfo.classList.remove("hidden");

    const sizes = [];
    const paperTypes = [];

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

    loadingSpinner.classList.add("hidden");
    table.classList.remove("hidden");
    actions.classList.remove("hidden");

    const allSame = sizes.every(s => s === sizes[0]);
    summary.classList.remove("hidden");
    summary.classList.add(allSame ? "same" : "diff");
    summary.innerHTML = allSame
      ? `<strong>✓</strong> All pages have the same dimensions.`
      : `<strong>⚠</strong> This PDF contains pages with different sizes.`;

    displayStatistics(analysisResults, paperTypes);
    
  } catch (error) {
    loadingSpinner.classList.add("hidden");
    alert("Error processing PDF: " + error.message);
    console.error(error);
  }
}

function displayStatistics(results, paperTypes) {
  const widthsMm = results.map(r => parseFloat(r.widthMm));
  const heightsMm = results.map(r => parseFloat(r.heightMm));
  
  const minWidth = Math.min(...widthsMm).toFixed(1);
  const maxWidth = Math.max(...widthsMm).toFixed(1);
  const minHeight = Math.min(...heightsMm).toFixed(1);
  const maxHeight = Math.max(...heightsMm).toFixed(1);

  const paperCount = {};
  paperTypes.forEach(type => {
    paperCount[type] = (paperCount[type] || 0) + 1;
  });
  const mostCommonPaper = Object.keys(paperCount).length > 0
    ? Object.keys(paperCount).reduce((a, b) => 
        paperCount[a] > paperCount[b] ? a : b
      )
    : 'None';

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
