/** Sniff ZIP-based containers (DOCX, JAR, EPUB, etc.) from central directory names */
export function sniffZipContainer(bytes: Uint8Array): string | undefined {
  const text = new TextDecoder("latin1", { fatal: false }).decode(bytes.slice(0, Math.min(bytes.length, 8192)));
  const lower = text.toLowerCase();
  if (lower.includes("word/")) return "Microsoft Word (DOCX)";
  if (lower.includes("xl/") || lower.includes("worksheets/")) return "Microsoft Excel (XLSX)";
  if (lower.includes("ppt/")) return "Microsoft PowerPoint (PPTX)";
  if (lower.includes("meta-inf/manifest.mf") || lower.includes(".class")) return "Java JAR";
  if (lower.includes("mimetypeapplication/epub") || lower.includes("application/epub+zip")) return "EPUB";
  if (lower.includes("content.opf") && lower.includes("META-INF/container.xml".toLowerCase())) return "EPUB";
  if (lower.includes("androidmanifest.xml")) return "Android APK";
  if (lower.includes("payload/hfs")) return "iOS IPA";
  if (lower.includes("mimetypeapplication/vnd.oasis.opendocument")) return "OpenDocument";
  if (lower.includes("content.xml") && lower.includes("styles.xml")) return "OpenDocument (ODT/ODS/ODP)";
  return undefined;
}

export function sniffTarball(bytes: Uint8Array): boolean {
  return bytes.length >= 262 && matchUstar(bytes);
}

function matchUstar(bytes: Uint8Array): boolean {
  const magic = new TextDecoder().decode(bytes.subarray(257, 262));
  return magic === "ustar" || magic.startsWith("ustar");
}

export function sniffCompressionWrapper(bytes: Uint8Array): string | undefined {
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) return "gzip wrapper";
  if (bytes[0] === 0x42 && bytes[1] === 0x5a) return "bzip2 wrapper";
  if (bytes[0] === 0xfd && bytes[1] === 0x37) return "xz wrapper";
  return undefined;
}
