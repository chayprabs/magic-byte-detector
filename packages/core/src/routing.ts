import type { FormatFamily } from "./types.js";

export function buildRoutingHints(
  family: FormatFamily,
  format: string,
  container?: string,
  riskFlags: string[] = [],
): { tool: string; reason: string; url?: string }[] {
  const hints: { tool: string; reason: string; url?: string }[] = [];

  if (family === "archive" || format.includes("ZIP") || container) {
    hints.push({ tool: "ArchiveVet", reason: "Inspect archive contents and bombs" });
  }
  if (family === "image" || format.includes("JPEG") || format.includes("PNG")) {
    hints.push({ tool: "ExifScrub", reason: "Review or strip image metadata" });
  }
  if (format.includes("PDF")) {
    hints.push({ tool: "PdfForms", reason: "Analyze PDF structure and forms" });
  }
  if (container?.includes("EPUB") || format.includes("EPUB")) {
    hints.push({ tool: "EpubDoctor", reason: "Validate and repair EPUB packages" });
  }
  if (family === "font") {
    hints.push({ tool: "FontOps", reason: "Convert or subset fonts" });
  }
  if (riskFlags.includes("office_macro")) {
    hints.push({ tool: "Office macro review", reason: "Deep macro inspection recommended" });
  }
  if (riskFlags.includes("polyglot")) {
    hints.push({ tool: "Polyglot analysis", reason: "File matches multiple format signatures" });
  }

  return hints;
}
