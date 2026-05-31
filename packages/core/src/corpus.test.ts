import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { sniff } from "./sniff.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const corpusDir = join(__dirname, "../../../fixtures/corpus");

const EXPECTED: Record<string, string> = {
  "pdf.bin": "PDF",
  "zip.bin": "ZIP",
  "png.bin": "PNG",
  "jpg.bin": "JPEG",
  "gif.bin": "GIF",
  "exe.bin": "PE",
  "elf.bin": "ELF",
  "gzip.bin": "GZIP",
  "bz2.bin": "BZIP",
  "7z.bin": "7-Zip",
  "rar.bin": "RAR",
  "ole.bin": "OLE",
  "wasm.bin": "WebAssembly",
  "mp3.bin": "MP3",
  "ogg.bin": "OGG",
  "sqlite.bin": "SQLite",
  "woff.bin": "WOFF",
  "rtf.bin": "RTF",
};

describe("fixture corpus", () => {
  let files: string[] = [];
  try {
    files = readdirSync(corpusDir).filter((f) => f.endsWith(".bin"));
  } catch {
    files = [];
  }

  it("has corpus fixtures", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  for (const file of Object.keys(EXPECTED)) {
    it(`classifies ${file}`, async () => {
      const bytes = new Uint8Array(readFileSync(join(corpusDir, file)));
      const r = await sniff(bytes);
      expect(r.primary.format).toContain(EXPECTED[file].split("/")[0]);
    });
  }

  it("flags polyglot fixture", async () => {
    const bytes = new Uint8Array(readFileSync(join(corpusDir, "polyglot-pdf-zip.bin")));
    const r = await sniff(bytes);
    expect(r.ambiguity || r.riskFlags.includes("polyglot")).toBe(true);
  });
});
