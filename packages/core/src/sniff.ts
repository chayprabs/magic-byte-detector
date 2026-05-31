import { SIGNATURES, type Signature } from "./signatures.js";
import { sniffZipContainer, sniffTarball, sniffCompressionWrapper } from "./container.js";
import { sha256Hex, entropy } from "./hash.js";
import { matchPattern } from "./hex.js";
import { detectRiskFlags } from "./risk.js";
import { buildRoutingHints } from "./routing.js";
import type { SniffMatch, SniffOptions, SniffResult } from "./types.js";

const DEFAULT_MAX_BYTES = 4096;

function scoreMatch(sig: Signature, bytes: Uint8Array): number {
  const offset = sig.offset ?? 0;
  if (!matchPattern(bytes, sig.pattern, offset)) return 0;
  const parts = sig.pattern.split(/\s+/).length;
  let confidence = 0.5 + Math.min(0.45, parts / 40);
  if (sig.offset && sig.offset > 0) confidence -= 0.05;
  return Math.min(0.99, confidence);
}

function findMatches(bytes: Uint8Array): { sig: Signature; confidence: number }[] {
  const matches: { sig: Signature; confidence: number }[] = [];
  for (const sig of SIGNATURES) {
    const c = scoreMatch(sig, bytes);
    if (c > 0) matches.push({ sig, confidence: c });
  }
  matches.sort((a, b) => b.confidence - a.confidence);
  return matches;
}

function extensionFromFilename(filename?: string): string | undefined {
  if (!filename) return undefined;
  const dot = filename.lastIndexOf(".");
  if (dot < 0) return undefined;
  return filename.slice(dot + 1).toLowerCase();
}

function detectTextEncoding(bytes: Uint8Array): string | undefined {
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) return "utf-8 (BOM)";
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) return "utf-16le";
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) return "utf-16be";
  const sample = new TextDecoder("utf-8", { fatal: false }).decode(bytes.subarray(0, 256));
  if (/^[\x09\x0a\x0d\x20-\x7e]*$/.test(sample) && sample.length > 8) return "ascii/utf-8 text";
  return undefined;
}

export async function sniff(
  input: ArrayBuffer | Uint8Array,
  options: SniffOptions = {},
): Promise<SniffResult> {
  const privacyMode = options.privacyMode ?? true;
  const maxBytes = options.maxBytes ?? (privacyMode ? DEFAULT_MAX_BYTES : undefined);
  let bytes =
    input instanceof Uint8Array ? input : new Uint8Array(input);
  const totalLen = bytes.length;
  if (maxBytes !== undefined && bytes.length > maxBytes) {
    bytes = bytes.subarray(0, maxBytes);
  }

  const matches = findMatches(bytes);
  const top = matches[0];
  const primary: SniffMatch = top
    ? {
        mime: top.sig.mime,
        format: top.sig.format,
        family: top.sig.family,
        confidence: top.confidence,
      }
    : {
        mime: "application/octet-stream",
        format: entropy(bytes) > 7.5 ? "High-entropy binary" : "Unknown",
        family: "unknown",
        confidence: 0.1,
      };

  let container: string | undefined = top?.sig.container;
  if (primary.format === "ZIP" || primary.mime === "application/zip") {
    container = sniffZipContainer(bytes) ?? container;
  }
  if (sniffTarball(bytes)) container = "POSIX tar archive";

  const wrapper = sniffCompressionWrapper(bytes);
  if (wrapper && !container) container = wrapper;

  const ext = extensionFromFilename(options.filename);
  const expectedExts = top?.sig.extensions ?? [];
  const extensionMismatch =
    !!ext && expectedExts.length > 0 && !expectedExts.includes(ext);

  const mimeMismatch =
    !!options.claimedMime &&
    options.claimedMime !== primary.mime &&
    !options.claimedMime.includes("octet-stream");

  const alternatives = matches.slice(1, 5).map((m) => ({
    mime: m.sig.mime,
    format: m.sig.format,
    confidence: m.confidence,
  }));

  const ambiguity = matches.filter((m) => m.confidence >= 0.5).length >= 2;
  const riskFlags = detectRiskFlags(bytes, matches.filter((m) => m.confidence >= 0.45).length, primary.format, container);
  const encoding = detectTextEncoding(bytes);

  const hashInput = privacyMode ? bytes : bytes;
  const sha256 = await sha256Hex(hashInput);

  const routingHints = buildRoutingHints(primary.family, primary.format, container, riskFlags);

  return {
    primary,
    alternatives,
    extensionMismatch,
    mimeMismatch,
    ambiguity,
    container,
    encoding,
    riskFlags,
    hashes: { sha256 },
    routingHints,
    bytesRead: bytes.length,
    privacyMode,
  };
}

export { parseHexInput, parseBase64Input, bytesToHex } from "./hex.js";
