import { useCallback, useEffect, useRef, useState } from "react";
import { sniff, parseHexInput, parseBase64Input, type SniffResult } from "@filesniff/core";
import { ResultCard } from "./ResultCard";
import { Upload, FileSearch, Link2, Shield } from "lucide-react";

type InputMode = "file" | "hex" | "url";

const WORKER_URL = import.meta.env.VITE_WORKER_URL ?? "";

export function SniffWorkspace() {
  const [mode, setMode] = useState<InputMode>("file");
  const [hexText, setHexText] = useState("");
  const [urlText, setUrlText] = useState("");
  const [privacyMode, setPrivacyMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SniffResult | null>(null);
  const [filename, setFilename] = useState<string | undefined>();
  const [lastFile, setLastFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const runSniff = useCallback(
    async (bytes: Uint8Array, name?: string, claimedMime?: string) => {
      setLoading(true);
      setError(null);
      try {
        const r = await sniff(bytes, {
          filename: name,
          claimedMime,
          privacyMode,
          maxBytes: privacyMode ? 4096 : undefined,
        });
        setResult(r);
        setFilename(name);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Sniff failed");
        setResult(null);
      } finally {
        setLoading(false);
      }
    },
    [privacyMode],
  );

  const onFile = async (file: File) => {
    setLastFile(file);
    setFilename(file.name);
    if (fileRef.current) fileRef.current.value = "";
    const slice = privacyMode ? file.slice(0, 4096) : file;
    const buf = await slice.arrayBuffer();
    await runSniff(new Uint8Array(buf), file.name, file.type || undefined);
  };

  useEffect(() => {
    if (lastFile && mode === "file") {
      void onFile(lastFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [privacyMode]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) void onFile(f);
  };

  const parseInputBytes = (raw: string): Uint8Array => {
    const trimmed = raw.trim();
    const hexLike = /^[0-9a-fA-Fx\s]+$/.test(trimmed) && /[0-9a-fA-F]{2}/.test(trimmed);
    if (hexLike && (trimmed.includes(" ") || trimmed.length % 2 === 0)) {
      return parseHexInput(trimmed);
    }
    if (/^[A-Za-z0-9+/=\s]+$/.test(trimmed) && trimmed.length >= 4) {
      return parseBase64Input(trimmed);
    }
    return parseHexInput(trimmed);
  };

  const onHexSubmit = async () => {
    try {
      await runSniff(parseInputBytes(hexText));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid hex or base64");
    }
  };

  const onUrlSubmit = async () => {
    if (!urlText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const api = WORKER_URL || "/api";
      const res = await fetch(`${api}/v1/scan/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlText.trim() }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as SniffResult;
      setResult(data);
    } catch (e) {
      setError(
        e instanceof Error
          ? `${e.message} — enable worker or use file/hex mode for local-only sniff.`
          : "URL scan failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const onFullScan = async (file: File) => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const api = WORKER_URL || "/api";
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${api}/v1/scan`, { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as SniffResult;
      setResult(data);
      setFilename(file.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Full scan unavailable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-center">
        {(
          [
            ["file", "File", Upload],
            ["hex", "Hex / Base64", FileSearch],
            ["url", "URL", Link2],
          ] as const
        ).map(([id, label, Icon]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors ${
              mode === id
                ? "bg-accent text-white border-accent"
                : "bg-white border-neutral-300 text-muted hover:border-neutral-400"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <label className="flex items-center justify-center gap-2 text-sm text-muted cursor-pointer">
        <input
          type="checkbox"
          checked={privacyMode}
          onChange={(e) => setPrivacyMode(e.target.checked)}
          className="rounded border-neutral-300"
        />
        <Shield className="w-4 h-4" />
        100% in-browser (first 4 KB only, no upload)
      </label>

      {mode === "file" && (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileRef.current?.click();
          }}
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="border-2 border-dashed border-neutral-300 rounded-xl bg-white p-10 text-center hover:border-accent/50 transition-colors cursor-pointer"
        >
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onFile(f);
            }}
          />
          <p className="text-muted mb-4">Drop a file here or click to browse</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileRef.current?.click();
            }}
            className="px-6 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Choose file
          </button>
          {!privacyMode && fileRef.current?.files?.[0] && (
            <button
              type="button"
              className="ml-3 px-4 py-2 border border-neutral-300 rounded-lg text-sm"
              onClick={() => {
                const f = fileRef.current?.files?.[0];
                if (f) void onFullScan(f);
              }}
            >
              Full server scan
            </button>
          )}
        </div>
      )}

      {mode === "hex" && (
        <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3">
          <textarea
            value={hexText}
            onChange={(e) => setHexText(e.target.value)}
            placeholder="Paste hex (25 50 44 46) or base64…"
            rows={5}
            className="w-full font-mono text-sm border border-neutral-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <button
            type="button"
            onClick={() => void onHexSubmit()}
            disabled={loading || !hexText.trim()}
            className="w-full py-2.5 bg-accent text-white rounded-lg font-medium disabled:opacity-50"
          >
            Sniff bytes
          </button>
        </div>
      )}

      {mode === "url" && (
        <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3">
          <input
            type="url"
            value={urlText}
            onChange={(e) => setUrlText(e.target.value)}
            placeholder="https://example.com/file.bin"
            className="w-full border border-neutral-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <button
            type="button"
            onClick={() => void onUrlSubmit()}
            disabled={loading || !urlText.trim()}
            className="w-full py-2.5 bg-accent text-white rounded-lg font-medium disabled:opacity-50"
          >
            Fetch &amp; scan (worker)
          </button>
        </div>
      )}

      {loading && <p className="text-center text-sm text-muted">Analyzing…</p>}
      {error && (
        <p className="text-center text-sm text-danger bg-red-50 border border-red-100 rounded-lg p-3" role="alert">
          {error}
        </p>
      )}
      {result && <ResultCard result={result} filename={filename} />}
    </div>
  );
}
