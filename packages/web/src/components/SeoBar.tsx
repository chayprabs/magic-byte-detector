import { useLocation } from "react-router-dom";

const DEFAULT =
  "Detect file types from magic bytes online — MIME mismatch warnings, container sniffing (DOCX, JAR, EPUB), and risk flags for Office macros, polyglots, and archive bombs. First 4 KB stays in your browser by default.";

const ROUTE_BLURBS: Record<string, string> = {
  "/what-is-this-file": "Drop or paste bytes to answer “what is this file?” using signatures, not just the extension.",
  "/mime-detector": "See whether the declared MIME type matches magic-byte detection and get confidence scores.",
  "/magic-byte-checker": "View hex signatures, format families, and alternative matches from the file header.",
  "/office-macro-detect": "OLE and Office containers are flagged when macro-related markers appear in the header region.",
  "/polyglot-file-check": "Ambiguous files that match multiple strong signatures are highlighted as potential polyglots.",
};

export function SeoBar() {
  const { pathname } = useLocation();
  const text = ROUTE_BLURBS[pathname] ?? DEFAULT;

  return (
    <div
      className="w-full border-b border-neutral-200 bg-neutral-50 text-sm text-muted leading-relaxed"
      role="region"
      aria-label="Product summary"
    >
      <div className="max-w-5xl mx-auto px-4 py-3 text-center">{text}</div>
    </div>
  );
}
