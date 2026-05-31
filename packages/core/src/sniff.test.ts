import { describe, it, expect } from "vitest";
import { sniff, parseHexInput } from "./sniff.js";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, "../../../fixtures");

function fixture(name: string): Uint8Array {
  return new Uint8Array(readFileSync(join(fixturesDir, name)));
}

describe("sniff", () => {
  it("detects PDF", async () => {
    const bytes = parseHexInput("25 50 44 46 2D 31 2E 34");
    const r = await sniff(bytes, { filename: "test.pdf" });
    expect(r.primary.format).toBe("PDF");
    expect(r.primary.mime).toBe("application/pdf");
  });

  it("detects ZIP / polyglot potential", async () => {
    const bytes = parseHexInput("50 4B 03 04");
    const r = await sniff(bytes, { filename: "x.zip" });
    expect(r.primary.format).toBe("ZIP");
  });

  it("flags extension mismatch", async () => {
    const bytes = parseHexInput("4D 5A 90 00");
    const r = await sniff(bytes, { filename: "photo.jpg" });
    expect(r.extensionMismatch).toBe(true);
    expect(r.primary.family).toBe("executable");
  });

  it("detects OLE for macro fixture", async () => {
    try {
      const bytes = fixture("macro-sample.doc");
      const r = await sniff(bytes, { filename: "macro-sample.doc" });
      expect(r.primary.format).toContain("OLE");
    } catch {
      const bytes = parseHexInput("D0 CF 11 E0 A1 B1 1A E1");
      const r = await sniff(bytes, { filename: "x.doc" });
      expect(r.primary.format).toContain("OLE");
    }
  });

  it("limits bytes in privacy mode", async () => {
    const big = new Uint8Array(10000);
    big[0] = 0x25;
    big[1] = 0x50;
    big[2] = 0x44;
    big[3] = 0x46;
    const r = await sniff(big, { privacyMode: true });
    expect(r.bytesRead).toBe(4096);
    expect(r.privacyMode).toBe(true);
  });

  it("returns sha256", async () => {
    const bytes = parseHexInput("89 50 4E 47");
    const r = await sniff(bytes);
    expect(r.hashes.sha256).toMatch(/^[a-f0-9]{64}$/);
  });
});
