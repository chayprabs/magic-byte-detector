#!/usr/bin/env node
/** Build fixtures/corpus-manifest.json from fmt-001..055 expected formats */
import { writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const corpusDir = join(__dirname, "../fixtures/corpus");

const NAMED_EXPECTED = {
  "fmt-001-pdf.bin": "PDF",
  "fmt-002-zip.bin": "ZIP",
  "fmt-003-png.bin": "PNG",
  "fmt-004-jpeg.bin": "JPEG",
  "fmt-005-gif87.bin": "GIF",
  "fmt-006-gif89.bin": "GIF",
  "fmt-007-bmp.bin": "BMP",
  "fmt-008-ico.bin": "ICO",
  "fmt-009-tiff-le.bin": "TIFF",
  "fmt-010-tiff-be.bin": "TIFF",
  "fmt-011-webp.bin": "WebP",
  "fmt-012-exe.bin": "PE",
  "fmt-013-elf.bin": "ELF",
  "fmt-014-macho.bin": "Mach",
  "fmt-015-wasm.bin": "WebAssembly",
  "fmt-016-ole.bin": "OLE",
  "fmt-017-gzip.bin": "GZIP",
  "fmt-018-bz2.bin": "BZIP",
  "fmt-019-xz.bin": "XZ",
  "fmt-020-7z.bin": "7-Zip",
  "fmt-021-rar.bin": "RAR",
  "fmt-022-zstd.bin": "Zstandard",
  "fmt-023-lz4.bin": "LZ4",
  "fmt-024-mp3-id3.bin": "MP3",
  "fmt-025-mp3-sync.bin": "MP3",
  "fmt-026-flac.bin": "FLAC",
  "fmt-027-ogg.bin": "OGG",
  "fmt-028-midi.bin": "MIDI",
  "fmt-029-wav.bin": "WAV",
  "fmt-030-avi.bin": "AVI",
  "fmt-031-mkv.bin": "Matroska",
  "fmt-032-class.bin": "Java",
  "fmt-033-swz.bin": "SWF",
  "fmt-034-ps.bin": "PostScript",
  "fmt-035-rtf.bin": "RTF",
  "fmt-036-xml.bin": "XML",
  "fmt-037-html.bin": "HTML",
  "fmt-038-sqlite.bin": "SQLite",
  "fmt-039-woff.bin": "WOFF",
  "fmt-040-woff2.bin": "WOFF2",
  "fmt-041-ttf.bin": "TrueType",
  "fmt-042-otf.bin": "OpenType",
  "fmt-043-pcap.bin": "PCAP",
  "fmt-044-pcapng.bin": "PCAP",
  "fmt-045-cab.bin": "CAB",
  "fmt-046-rpm.bin": "RPM",
  "fmt-047-deb.bin": "Debian",
  "fmt-048-cpio.bin": "CPIO",
  "fmt-049-amr.bin": "AMR",
  "fmt-050-psd.bin": "Photoshop",
  "fmt-051-blend.bin": "Blender",
  "fmt-052-mobi.bin": "Mobipocket",
  "fmt-053-wmv.bin": "WMV",
  "fmt-054-pem.bin": "PEM",
  "fmt-055-der.bin": "DER",
  "pdf.bin": "PDF",
  "zip.bin": "ZIP",
  "png.bin": "PNG",
  "polyglot-pdf-zip.bin": "PDF",
};

const files = readdirSync(corpusDir).filter((f) => f.endsWith(".bin"));
const manifest = {};
for (const f of files) {
  manifest[f] = NAMED_EXPECTED[f] ?? "Unknown";
}
writeFileSync(
  join(__dirname, "../fixtures/corpus-manifest.json"),
  JSON.stringify(manifest, null, 2),
);
console.log(`Manifest: ${files.length} entries`);
