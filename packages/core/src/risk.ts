import type { RiskFlag } from "./types.js";
import { entropy } from "./hash.js";
import { matchPattern } from "./hex.js";

const VBA_MARKERS = ["_vba_project", "vba6", "vba7", "macrosheet", "attribut", "projectwm"];
const PE_PATTERN = "4D 5A";

export function detectRiskFlags(
  bytes: Uint8Array,
  distinctFamilies: number,
  format: string,
  container?: string,
): RiskFlag[] {
  const flags: RiskFlag[] = [];
  const lower = new TextDecoder("latin1", { fatal: false }).decode(bytes).toLowerCase();

  if (distinctFamilies >= 2) flags.push("polyglot");

  if (format.includes("OLE") || container?.includes("Word") || container?.includes("Excel")) {
    if (VBA_MARKERS.some((m) => lower.includes(m))) flags.push("office_macro");
  }

  if (bytes.length > 4) {
    const limit = Math.min(bytes.length - 1, 65536);
    for (let i = 4; i < limit; i++) {
      if (matchPattern(bytes.subarray(i), PE_PATTERN)) {
        flags.push("embedded_exe");
        break;
      }
    }
  }

  const ent = entropy(bytes);
  const isPdf = format.includes("PDF") || bytes[0] === 0x25;
  if (ent > 7.9 && !isPdf) flags.push("high_entropy");
  else if (ent > 7.5 && !isPdf && bytes.length < 512) flags.push("high_entropy");

  if (detectArchiveBomb(bytes)) flags.push("archive_bomb");

  return [...new Set(flags)];
}

function detectArchiveBomb(bytes: Uint8Array): boolean {
  if (bytes[0] === 0x50 && bytes[1] === 0x4b && bytes.length >= 4096) {
    const ratio = bytes.length / Math.max(1, countPrintable(bytes));
    if (ratio > 50) return true;
  }
  return false;
}

function countPrintable(bytes: Uint8Array): number {
  let n = 0;
  for (const b of bytes) {
    if (b >= 0x20 && b <= 0x7e) n++;
  }
  return n;
}
