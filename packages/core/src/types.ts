export type RiskFlag =
  | "office_macro"
  | "embedded_exe"
  | "polyglot"
  | "archive_bomb"
  | "high_entropy";

export type FormatFamily =
  | "office"
  | "archive"
  | "font"
  | "image"
  | "audio"
  | "video"
  | "executable"
  | "document"
  | "text"
  | "unknown";

export interface SniffMatch {
  mime: string;
  format: string;
  family: FormatFamily;
  confidence: number;
}

export interface SniffResult {
  primary: SniffMatch;
  alternatives: Omit<SniffMatch, "family">[];
  extensionMismatch: boolean;
  mimeMismatch: boolean;
  ambiguity: boolean;
  container?: string;
  encoding?: string;
  riskFlags: RiskFlag[];
  hashes: { sha256: string; ssdeep?: string };
  routingHints: { tool: string; reason: string; url?: string }[];
  bytesRead: number;
  privacyMode: boolean;
}

export interface SniffOptions {
  filename?: string;
  claimedMime?: string;
  privacyMode?: boolean;
  maxBytes?: number;
}
