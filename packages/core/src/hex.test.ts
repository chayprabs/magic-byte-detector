import { describe, it, expect } from "vitest";
import { parseHexInput } from "./hex.js";
import { sniff } from "./sniff.js";

describe("parseHexInput", () => {
  it("rejects invalid nybbles", () => {
    expect(() => parseHexInput("GG 25")).toThrow(/Invalid hex/);
  });

  it("parses compact hex", () => {
    const b = parseHexInput("25504446");
    expect(b[0]).toBe(0x25);
  });
});

describe("embedded_exe at buffer end", () => {
  it("detects MZ near end of PDF-like buffer", async () => {
    const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0, 0, 0, 0, 0x4d, 0x5a]);
    const r = await sniff(bytes);
    expect(r.riskFlags).toContain("embedded_exe");
  });
});

describe("plain zip not polyglot", () => {
  it("does not flag polyglot for zip only", async () => {
    const bytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);
    const r = await sniff(bytes, { filename: "x.zip" });
    expect(r.riskFlags).not.toContain("polyglot");
    expect(r.ambiguity).toBe(false);
  });
});
