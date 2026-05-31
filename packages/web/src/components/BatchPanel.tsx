import { useState } from "react";
import { Download } from "lucide-react";
import { ensureOk } from "../lib/api";

const WORKER_URL = import.meta.env.VITE_WORKER_URL ?? "";

export function BatchPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  const onBatch = async (file: File) => {
    setLoading(true);
    setError(null);
    setReport(null);
    setCount(0);
    try {
      const api = WORKER_URL || "/api";
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${api}/v1/batch`, { method: "POST", body: form });
      await ensureOk(res);
      const data = (await res.json()) as { report: string; count: number };
      setReport(data.report);
      setCount(data.count);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Batch scan failed — start the worker (docker compose up)");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;
    const blob = new Blob([report], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "filesniff-batch-report.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
      <p className="text-sm text-muted text-center">
        Upload a ZIP of files for a CSV report (worker required). Max 100 entries per archive.
      </p>
      <input
        type="file"
        accept=".zip,application/zip"
        className="block w-full text-sm"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onBatch(f);
        }}
      />
      {loading && <p className="text-sm text-center text-muted">Processing batch…</p>}
      {error && (
        <p className="text-sm text-danger bg-red-50 border border-red-100 rounded-lg p-3" role="alert">
          {error}
        </p>
      )}
      {report && (
        <div className="space-y-2">
          <p className="text-sm text-ink font-medium">Scanned {count} files</p>
          <pre className="text-xs bg-neutral-50 p-3 rounded-lg overflow-auto max-h-48 font-mono">{report}</pre>
          <button
            type="button"
            onClick={downloadReport}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm"
          >
            <Download className="w-4 h-4" />
            Download CSV
          </button>
        </div>
      )}
    </div>
  );
}
