import { useCallback, useEffect, useRef, useState } from "react";
import { sniff, parseHexInput, parseBase64Input, type SniffResult } from "@filesniff/core";
import { ResultCard } from "./ResultCard";
import { SamplePicker } from "./SamplePicker";
import { BatchPanel } from "./BatchPanel";
import { ensureOk } from "../lib/api";
import { Upload, FileSearch, Link2, Shield, Archive } from "lucide-react";

type InputMode = "file" | "hex" | "url" | "batch";

type LastInput =
  | { kind: "file"; file: File }
  | { kind: "bytes"; bytes: Uint8Array; name?: string; claimedMime?: string };

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
  const [headerBytes, setHeaderBytes] = useState<Uint8Array | undefined>();
  const [lastFile, setLastFile] = useState<File | null>(null);
  const lastInputRef = useRef<LastInput | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const runSniff = useCallback(
    async (bytes: Uint8Array, name?: string, claimedMime?: string) => {
      setLoading(true);
      setError(null);
      setHeaderBytes(bytes.subarray(0, Math.min(bytes.length, 128)));
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
    lastInputRef.current = { kind: "file", file };
    setFilename(file.name);
    if (fileRef.current) fileRef.current.value = "";
    const slice = privacyMode ? file.slice(0, 4096) : file;
    const buf = await slice.arrayBuffer();
    await runSniff(new Uint8Array(buf), file.name, file.type || undefined);
  };

  useEffect(() => {
    const last = lastInputRef.current;
    if (!last) return;
    if (last.kind === "file") {
      void (async () => {
        const slice = privacyMode ? last.file.slice(0, 4096) : last.file;
        const buf = await slice.arrayBuffer();
        await runSniff(new Uint8Array(buf), last.file.name, last.file.type || undefined);
      })();
    } else {
      void runSniff(last.bytes, last.name, last.claimedMime);
    }
  }, [privacyMode, runSniff]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) void onFile(f);
  };

  const parseInputBytes = (raw: string): Uint8Array => {
    const trimmed = raw.trim();
    const is0xHex = /(?:^|\s)0x[0-9a-fA-F]{2}(?:\s|$)/i.test(trimmed);
    const isSpacedHex =
      trimmed.includes(" ") && /^[0-9a-fA-F\s]+$/i.test(trimmed.replace(/\s0x/gi, " "));
    if (is0xHex || isSpacedHex) {
      return parseHexInput(trimmed);
    }
    const compact = trimmed.replace(/\s/g, "");
    const hexOnly = /^[0-9a-fA-F]+$/.test(compact) && compact.length % 2 === 0;
    if (hexOnly && !compact.includes("=")) {
      return parseHexInput(trimmed);
    }
    const looksBase64 =
      /^[A-Za-z0-9+/]+=*$/.test(compact) &&
      (compact.includes("=") || (compact.length >= 8 && compact.length % 4 === 0));
    if (looksBase64) {
      return parseBase64Input(trimmed);
    }
    return parseHexInput(trimmed);
  };

  const onHexSubmit = async () => {
    try {
      const bytes = parseInputBytes(hexText);
      lastInputRef.current = { kind: "bytes", bytes };
      await runSniff(bytes);
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
      await ensureOk(res);
      const data = (await res.json()) as SniffResult;
      setResult(data);
    } catch (e) {
      setError(
        e instanceof Error
          ? `${e.message} — start worker: docker compose up`
          : "URL scan failed",
      );
    } finally {
      setLoading(false);
    }
  };

  const onFullScan = async (file?: File) => {
    const f = file ?? lastFile;
    if (!f) return;
    setLoading(true);
    setError(null);
    try {
      const api = WORKER_URL || "/api";
      const form = new FormData();
      form.append("file", f);
      const res = await fetch(`${api}/v1/scan`, { method: "POST", body: form });
      await ensureOk(res);
      const data = (await res.json()) as SniffResult;
      setResult(data);
      setFilename(f.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Full scan unavailable — docker compose up");
    } finally {
      setLoading(false);
    }
  };

  const onSample = (bytes: Uint8Array, name: string) => {
    setMode("file");
    lastInputRef.current = { kind: "bytes", bytes, name };
    void runSniff(bytes, name);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-center" role="tablist">
        {(
          [
            ["file", "File", Upload],
            ["hex", "Hex / Base64", FileSearch],
            ["url", "URL", Link2],
            ["batch", "Batch ZIP", Archive],
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

      <SamplePicker onSample={onSample} />

      {mode !== "batch" && (
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
      )}

      {mode === "file" && (
        <>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="border-2 border-dashed border-neutral-300 rounded-xl bg-white p-10 text-center"
          >
            <p className="text-muted mb-4">Drop a file here</p>
            <input
              ref={fileRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onFile(f);
              }}
            />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-6 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Choose file
            </button>
            {lastFile && (
              <button
                type="button"
                className="px-4 py-2.5 border border-neutral-300 rounded-lg text-sm hover:border-accent/40"
                onClick={() => void onFullScan(lastFile)}
              >
                Full server scan (ssdeep)
              </button>
            )}
          </div>
        </>
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

      {mode === "batch" && <BatchPanel />}

      {loading && (
        <p className="text-center text-sm text-muted" aria-busy="true">
          Analyzing…
        </p>
      )}
      {error && (
        <p className="text-center text-sm text-danger bg-red-50 border border-red-100 rounded-lg p-3" role="alert">
          {error}
        </p>
      )}
      {result && mode !== "batch" && (
        <ResultCard result={result} filename={filename} headerBytes={headerBytes} />
      )}
    </div>
  );
}
