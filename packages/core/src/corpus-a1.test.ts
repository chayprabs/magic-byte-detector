import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { sniff } from "./sniff.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(
  readFileSync(join(__dirname, "../../../fixtures/corpus-manifest.json"), "utf8"),
) as Record<string, string>;

describe("PRD A1 named corpus accuracy", () => {
  const named = Object.entries(manifest).filter(
    ([k, v]) => k.startsWith("fmt-0") && v !== "Unknown",
  );

  it("has named manifest entries", () => {
    expect(named.length).toBeGreaterThan(40);
  });

  for (const [file, expected] of named) {
    it(`classifies ${file} as ${expected}`, async () => {
      const bytes = new Uint8Array(
        readFileSync(join(__dirname, "../../../fixtures/corpus", file)),
      );
      const r = await sniff(bytes);
      expect(r.primary.format).toContain(expected.split(" ")[0]);
    });
  }
});
