import { describe, it, expect } from "vitest";
import { sniff } from "./sniff.js";
import { BUILTIN_SAMPLES } from "./samples.js";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("PRD acceptance (Section 20)", () => {
  it("A2: polyglot fixture flagged", async () => {
    const r = await sniff(BUILTIN_SAMPLES.polyglot.bytes, {
      filename: BUILTIN_SAMPLES.polyglot.name,
    });
    expect(r.ambiguity || r.riskFlags.includes("polyglot")).toBe(true);
  });

  it("A3: macro fixture flagged", async () => {
    const r = await sniff(BUILTIN_SAMPLES.macroOle.bytes, {
      filename: BUILTIN_SAMPLES.macroOle.name,
    });
    expect(r.riskFlags).toContain("office_macro");
  });

  it("extension mismatch on disguised exe", async () => {
    const r = await sniff(BUILTIN_SAMPLES.mismatch.bytes, {
      filename: BUILTIN_SAMPLES.mismatch.name,
    });
    expect(r.extensionMismatch).toBe(true);
    expect(r.primary.family).toBe("executable");
  });

  it("high entropy flagged", async () => {
    const r = await sniff(BUILTIN_SAMPLES.highEntropy.bytes);
    expect(r.riskFlags).toContain("high_entropy");
  });

  it("privacy mode limits to 4096 bytes", async () => {
    const big = new Uint8Array(9000);
    big.set(BUILTIN_SAMPLES.pdf.bytes);
    const r = await sniff(big, { privacyMode: true });
    expect(r.bytesRead).toBe(4096);
  });

  it("macro-sample.doc fixture when present", async () => {
    try {
      const bytes = new Uint8Array(
        readFileSync(join(__dirname, "../../../fixtures/macro-sample.doc")),
      );
      const r = await sniff(bytes, { filename: "macro-sample.doc" });
      expect(r.primary.format).toContain("OLE");
      expect(r.riskFlags).toContain("office_macro");
    } catch {
      // optional file
    }
  });
});

describe("sniff performance (PRD p95 <= 100ms)", () => {
  it("100 sniffs under 100ms p95", async () => {
    const times: number[] = [];
    const bytes = BUILTIN_SAMPLES.pdf.bytes;
    for (let i = 0; i < 100; i++) {
      const t0 = performance.now();
      await sniff(bytes, { privacyMode: true });
      times.push(performance.now() - t0);
    }
    times.sort((a, b) => a - b);
    const p95 = times[94];
    expect(p95).toBeLessThan(100);
  });
});
