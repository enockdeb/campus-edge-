import jsPDF from "jspdf";
import { LectureNote } from "../types";

export interface PDFExportOptions {
  title: string;
  subject: string;
  date?: string;
  context?: string;
  audioInfo?: {
    filename: string;
    duration?: string;
  };
  summary: LectureNote["summary"];
}

export function exportSummaryToPDF(options: PDFExportOptions): void {
  const { title, subject, date, context, audioInfo, summary } = options;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  const state = { y: 16 };

  const checkPageBreak = (neededHeight: number) => {
    if (state.y + neededHeight > pageHeight - 20) {
      doc.addPage();
      state.y = 20;
      return true;
    }
    return false;
  };

  // --- 1. Top Decorative Banner & Header ---
  doc.setFillColor(14, 116, 144); // Sky/cyan-700
  doc.rect(margin, state.y, contentWidth, 22, "F");

  // Academy branding text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("PREBYTERIAN NURSING & MIDWIFERY COLLEGE", margin + 5, state.y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(224, 242, 254);
  doc.text("Dual-Faculty Clinical AI Study Suite • NMC Dual-Accredited Curriculum", margin + 5, state.y + 12);

  const printDate = date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(`DATE: ${printDate.toUpperCase()}`, pageWidth - margin - 5, state.y + 7, { align: "right" });
  
  if (context) {
    doc.setFont("helvetica", "normal");
    doc.text(`CONTEXT: ${context.toUpperCase()}`, pageWidth - margin - 5, state.y + 12, { align: "right" });
  }

  state.y += 28;

  // --- 2. Subject Badge & Document Title ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(2, 132, 199); // Sky-600
  doc.text(subject.toUpperCase(), margin, state.y);
  state.y += 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // Slate-900

  const titleLines = doc.splitTextToSize(title, contentWidth);
  doc.text(titleLines, margin, state.y);
  state.y += titleLines.length * 7 + 2;

  // Audio source badge if present
  if (audioInfo?.filename) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Source: Audio Recording (${audioInfo.filename}${audioInfo.duration ? ` • ${audioInfo.duration}` : ""})`, margin, state.y);
    state.y += 5;
  }

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, state.y, pageWidth - margin, state.y);
  state.y += 6;

  // Helper for Section Headings
  const renderSectionHeader = (label: string, r = 3, g = 105, b = 161) => {
    checkPageBreak(14);
    doc.setFillColor(r, g, b);
    doc.roundedRect(margin, state.y, contentWidth, 7, 1, 1, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(label.toUpperCase(), margin + 3, state.y + 5);
    state.y += 10;
  };

  // --- Section 1: Key Concepts & Physiological Principles ---
  if (summary.keyTakeaways && summary.keyTakeaways.length > 0) {
    renderSectionHeader("1. Key Concepts & Physiological Principles", 14, 116, 144);

    summary.keyTakeaways.forEach((point, idx) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);

      const prefix = `${idx + 1}. `;
      const lines = doc.splitTextToSize(point, contentWidth - 8);
      checkPageBreak(lines.length * 4.5 + 4);

      // Circle bullet number
      doc.setFont("helvetica", "bold");
      doc.setTextColor(2, 132, 199);
      doc.text(prefix, margin, state.y);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.text(lines, margin + 6, state.y);
      state.y += lines.length * 4.5 + 2.5;
    });

    state.y += 4;
  }

  // --- Section 2: Crucial Clinical & Medical Definitions ---
  if (summary.definitions && summary.definitions.length > 0) {
    renderSectionHeader("2. Crucial Clinical & Medical Definitions", 79, 70, 229); // Indigo-600

    summary.definitions.forEach((def) => {
      const defLines = doc.splitTextToSize(def.definition, contentWidth - 8);
      const impactLines = def.clinicalRelevance
        ? doc.splitTextToSize(`Clinical Impact: ${def.clinicalRelevance}`, contentWidth - 8)
        : [];
      
      const itemHeight = 6 + defLines.length * 4 + (impactLines.length ? impactLines.length * 3.8 + 2 : 0) + 4;
      checkPageBreak(itemHeight);

      // Container box
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, state.y, contentWidth, itemHeight, 1, 1, "FD");

      // Term
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(49, 46, 129); // Indigo-950
      doc.text(`• ${def.term}`, margin + 3, state.y + 4.5);

      // Definition text
      let currTextY = state.y + 8.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(51, 65, 85);
      doc.text(defLines, margin + 4, currTextY);
      currTextY += defLines.length * 4;

      // Clinical impact
      if (impactLines.length > 0) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(7.5);
        doc.setTextColor(67, 56, 202);
        doc.text(impactLines, margin + 4, currTextY + 1);
      }

      state.y += itemHeight + 2.5;
    });

    state.y += 4;
  }

  // --- Section 3: Practical Delivery Suite & Bedside Pearls ---
  if (summary.clinicalPearls && summary.clinicalPearls.length > 0) {
    renderSectionHeader("3. Practical Delivery Suite & Clinical Pearls", 217, 119, 6); // Amber-600

    summary.clinicalPearls.forEach((pearl) => {
      const lines = doc.splitTextToSize(pearl, contentWidth - 8);
      checkPageBreak(lines.length * 4.5 + 3);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(217, 119, 6);
      doc.text("✦", margin + 1, state.y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(69, 26, 3); // Amber-950
      doc.text(lines, margin + 6, state.y);
      state.y += lines.length * 4.5 + 2;
    });

    state.y += 4;
  }

  // --- Section 4: Prioritized Nursing & Midwifery Interventions ---
  if (summary.nursingInterventions && summary.nursingInterventions.length > 0) {
    renderSectionHeader("4. Prioritized Nursing & Midwifery Interventions", 5, 150, 105); // Emerald-600

    summary.nursingInterventions.forEach((intervention) => {
      const lines = doc.splitTextToSize(intervention, contentWidth - 8);
      checkPageBreak(lines.length * 4.5 + 3);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(5, 150, 105);
      doc.text("✓", margin + 1, state.y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(2, 44, 34); // Emerald-950
      doc.text(lines, margin + 6, state.y);
      state.y += lines.length * 4.5 + 2;
    });

    state.y += 4;
  }

  // --- Section 5: Red Flags & Critical Emergency Triggers ---
  if (summary.redFlags && summary.redFlags.length > 0) {
    renderSectionHeader("5. Red Flags & Critical Emergency Triggers", 225, 29, 72); // Rose-600

    summary.redFlags.forEach((flag) => {
      const lines = doc.splitTextToSize(flag, contentWidth - 8);
      checkPageBreak(lines.length * 4.5 + 3);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(225, 29, 72);
      doc.text("⚠", margin + 1, state.y);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(136, 19, 55); // Rose-950
      doc.text(lines, margin + 6, state.y);
      state.y += lines.length * 4.5 + 2;
    });

    state.y += 4;
  }

  // --- Section 6: Licensure Exam Mnemonics ---
  if (summary.examMnemonics && summary.examMnemonics.length > 0) {
    renderSectionHeader("6. Licensure Board Exam Recall Mnemonics", 99, 102, 241); // Indigo-500

    summary.examMnemonics.forEach((mnem) => {
      const lines = doc.splitTextToSize(mnem, contentWidth - 8);
      checkPageBreak(lines.length * 4.5 + 3);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(99, 102, 241);
      doc.text("💡", margin + 1, state.y);

      doc.setFont("courier", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 27, 75); // Indigo-950
      doc.text(lines, margin + 6, state.y);
      state.y += lines.length * 4.5 + 2;
    });
  }

  // --- Page Footers for all pages ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      "Presbyterian Nursing & Midwifery College • Clinical AI Study Suite • For Offline Academic Review",
      margin,
      pageHeight - 7
    );

    doc.setFont("helvetica", "bold");
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: "right" });
  }

  // Filename sanitation
  const sanitizedTitle = title
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_{2,}/g, "_")
    .substring(0, 45);

  const filename = `${sanitizedTitle || "Lecture_Summary"}_NMC_StudyGuide.pdf`;
  doc.save(filename);
}
