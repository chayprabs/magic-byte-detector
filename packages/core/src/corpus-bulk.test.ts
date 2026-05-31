import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { sniff } from "./sniff.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const corpusDir = join(__dirname, "../../../fixtures/corpus");

describe("200+ fixture corpus (PRD A1)", () => {
  const files = readdirSync(corpusDir).filter((f) => f.endsWith(".bin"));

  it("has at least 200 corpus files", () => {
    expect(files.length).toBeGreaterThanOrEqual(200);
  });

  it("sniffs every corpus file without throwing", async () => {
    let ok = 0;
    for (const file of files) {
      const bytes = new Uint8Array(readFileSync(join(corpusDir, file)));
      const r = await sniff(bytes);
      expect(r.primary).toBeDefined();
      expect(r.hashes.sha256).toMatch(/^[a-f0-9]{64}$/);
      ok++;
    }
    expect(ok).toBe(files.length);
  });
});
