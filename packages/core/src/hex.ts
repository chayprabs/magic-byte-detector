export function bytesToHex(bytes: Uint8Array, max = 64): string {
  const slice = bytes.subarray(0, max);
  return Array.from(slice)
    .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
    .join(" ");
}

export function parseHexInput(input: string): Uint8Array {
  const cleaned = input.replace(/0x/gi, "").replace(/[^0-9a-fA-F]/g, "");
  if (cleaned.length % 2 !== 0) {
    throw new Error("Hex input must have an even number of nibbles");
  }
  const out = new Uint8Array(cleaned.length / 2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(cleaned.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export function parseBase64Input(input: string): Uint8Array {
  const cleaned = input.replace(/\s/g, "");
  const binary = atob(cleaned);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

export function matchPattern(bytes: Uint8Array, pattern: string, offset = 0): boolean {
  const parts = pattern.trim().split(/\s+/);
  if (bytes.length < offset + parts.length) return false;
  for (let i = 0; i < parts.length; i++) {
    const byte = bytes[offset + i];
    const part = parts[i];
    if (part === "??") continue;
    if (byte !== parseInt(part, 16)) return false;
  }
  return true;
}
