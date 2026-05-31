import type { SniffResult } from "@filesniff/core";
import { AlertTriangle, Copy, Check } from "lucide-react";
import { useState } from "react";

const RISK_LABELS: Record<string, string> = {
  office_macro: "Office macros",
  embedded_exe: "Embedded EXE",
  polyglot: "Polyglot",
  archive_bomb: "Archive bomb",
  high_entropy: "High entropy",
};

interface Props {
  result: SniffResult;
  filename?: string;
}

export function ResultCard({ result, filename }: Props) {
  const [copied, setCopied] = useState(false);

  const copyJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-neutral-100">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h2 className="text-xl font-semibold text-ink">{result.primary.format}</h2>
            <p className="text-sm text-muted mt-1">{result.primary.mime}</p>
            {filename && <p className="text-xs text-muted mt-1">File: {filename}</p>}
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-accent">
              {Math.round(result.primary.confidence * 100)}%
            </span>
            <p className="text-xs text-muted">confidence</p>
          </div>
        </div>
        <p className="text-xs text-muted mt-2 capitalize">Family: {result.primary.family}</p>
        {result.container && (
          <p className="text-sm mt-2 text-ink">
            <span className="font-medium">Container:</span> {result.container}
          </p>
        )}
        {result.encoding && (
          <p className="text-sm text-muted">Encoding: {result.encoding}</p>
        )}
      </div>

      {(result.extensionMismatch || result.mimeMismatch || result.ambiguity) && (
        <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 flex gap-2 items-start text-sm text-warn">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <ul className="list-disc list-inside space-y-1">
            {result.extensionMismatch && <li>Extension does not match detected type</li>}
            {result.mimeMismatch && <li>Claimed MIME does not match detection</li>}
            {result.ambiguity && <li>Multiple strong signatures (possible polyglot)</li>}
          </ul>
        </div>
      )}

      {result.riskFlags.length > 0 && (
        <div className="px-5 py-3 flex flex-wrap gap-2 border-b border-neutral-100">
          {result.riskFlags.map((f) => (
            <span
              key={f}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-danger border border-red-100"
            >
              {RISK_LABELS[f] ?? f}
            </span>
          ))}
        </div>
      )}

      {result.alternatives.length > 0 && (
        <div className="px-5 py-4 border-b border-neutral-100">
          <h3 className="text-sm font-medium text-ink mb-2">Alternatives</h3>
          <ul className="space-y-1 text-sm text-muted">
            {result.alternatives.map((a, i) => (
              <li key={i}>
                {a.format} — {a.mime} ({Math.round(a.confidence * 100)}%)
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="px-5 py-3 text-xs font-mono text-muted break-all border-b border-neutral-100">
        SHA-256: {result.hashes.sha256}
        {result.hashes.ssdeep && (
          <>
            <br />
            ssdeep: {result.hashes.ssdeep}
          </>
        )}
      </div>

      {result.routingHints.length > 0 && (
        <div className="px-5 py-4 flex flex-wrap gap-2">
          {result.routingHints.map((h, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-lg bg-neutral-100 text-xs text-ink"
              title={h.reason}
            >
              {h.tool}
            </span>
          ))}
        </div>
      )}

      <div className="px-5 py-3 flex justify-between items-center text-xs text-muted">
        <span>
          Read {result.bytesRead} bytes · {result.privacyMode ? "local only" : "full scan"}
        </span>
        <button
          type="button"
          aria-label="Copy JSON"
          onClick={() => void copyJson()}
          className="inline-flex items-center gap-1 hover:text-ink"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          Copy JSON
        </button>
      </div>
    </article>
  );
}
