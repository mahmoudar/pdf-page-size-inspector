const pdfInput = document.getElementById("pdfInput");
const table = document.getElementById("resultTable");
const tbody = table.querySelector("tbody");
const summary = document.getElementById("summary");

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "pdf.worker.min.js";

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

function ptToMm(pt) {
  return (pt * 25.4) / 72;
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

pdfInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  tbody.innerHTML = "";
  summary.className = "summary hidden";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const sizes = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1 });

    const widthPt = viewport.width;
    const heightPt = viewport.height;

    const widthMm = ptToMm(widthPt);
    const heightMm = ptToMm(heightPt);

    const widthCm = widthMm / 10;
    const heightCm = heightMm / 10;

    const paper = matchPaper(widthMm, heightMm);

    sizes.push(`${Math.round(widthMm)}x${Math.round(heightMm)}`);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i}</td>
      <td>${Math.round(widthPt)} × ${Math.round(heightPt)}</td>
      <td>${widthMm.toFixed(1)} × ${heightMm.toFixed(1)}</td>
      <td>${widthCm.toFixed(2)} × ${heightCm.toFixed(2)}</td>
      <td>${paper}</td>
    `;
    tbody.appendChild(row);
  }

  table.classList.remove("hidden");

  const allSame = sizes.every(s => s === sizes[0]);

  summary.classList.remove("hidden");
  summary.classList.add(allSame ? "same" : "diff");
  summary.textContent = allSame
    ? "All pages have the same dimensions."
    : "This PDF contains pages with different sizes.";
});
