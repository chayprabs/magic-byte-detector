/** Built-in acceptance samples (PRD Section 11 / 20) */
export const BUILTIN_SAMPLES = {
  pdf: { name: "sample.pdf", bytes: new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34]) },
  zip: { name: "sample.zip", bytes: new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x0a, 0x00]) },
  polyglot: {
    name: "polyglot.pdf.zip",
    bytes: new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x50, 0x4b, 0x03, 0x04]),
  },
  macroOle: {
    name: "macro.doc",
    bytes: (() => {
      const head = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
      const tail = [...new TextEncoder().encode("_VBA_PROJECT")];
      return new Uint8Array([...head, ...tail]);
    })(),
  },
  mismatch: {
    name: "fake.jpg",
    bytes: new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00]),
  },
  highEntropy: {
    name: "random.bin",
    bytes: Uint8Array.from({ length: 512 }, (_, i) => ((i * 17 + 31) % 256)),
  },
} as const;
