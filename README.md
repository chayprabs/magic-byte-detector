# FileSniff (magic-byte-detector)

Detect file types from magic bytes online — MIME mismatch warnings, ambiguity flags, container sniffing (DOCX, JAR, EPUB, ODT, APK, IPA), and risk badges for Office macros, polyglots, and archive bombs.

**Keywords:** file-type, magic-bytes, mime, libmagic, file-detection, polyglot, ssdeep, forensics, office-macros, online-tool, wasm.

## Features

- **Browser-first:** Sniff the first 4 KB locally (privacy mode). No upload required.
- **Inputs:** Drag-and-drop file, hex/base64 paste, optional URL scan via worker.
- **Detection:** Magic-byte signatures, MIME + format family, confidence score, alternatives.
- **Mismatches:** Extension vs detected, MIME claim vs detected, text encoding hints.
- **Containers:** ZIP-based Office, JAR, EPUB, ODT, APK, IPA; tar and compression wrappers.
- **Risk flags:** Office macros, embedded EXE, polyglot, archive bomb, high entropy.
- **Hashes:** SHA-256 in browser; ssdeep on worker full scan.
- **Routing hints:** Suggested follow-up tools (ArchiveVet, ExifScrub, PdfForms, EpubDoctor, FontOps).

## Quick start

```bash
corepack enable
pnpm install
pnpm --filter @filesniff/core run build
pnpm dev
```

Open http://localhost:5173 — drop a file, paste hex, or try a **sample** button.

### Full stack (web + worker)

```bash
pnpm run compose:up
```

Open http://localhost:8080 (nginx serves the SPA and proxies `/api` to the worker).

### Worker only

```bash
pip install -r apps/worker/requirements.txt
cd apps/worker && uvicorn app.main:app --port 8787
```

Set `VITE_WORKER_URL=http://localhost:8787` at build time for full scan, URL fetch, and batch ZIP on a static host.

## PRD coverage

| Requirement | Status |
|-------------|--------|
| F1 File / hex / URL modes | Done |
| F2 Magic-byte detection + confidence | Done (curated libmagic-aligned table) |
| F3 Extension & MIME mismatch | Done |
| F4 Container sniff (ZIP/Office/APK/EPUB/tar) | Done |
| F5 Risk flags (macro, EXE, polyglot, bomb, entropy) | Done |
| F6 Routing hints | Done |
| F7 SHA-256 + ssdeep (worker) | Done |
| F8 Batch ZIP → CSV (worker) | Done |
| F9 Privacy 4 KB toggle | Done |

See [docs/QC_REPORT.md](docs/QC_REPORT.md) for the Section 25 qualification checklist.

## Monorepo layout

```
packages/core/   Pure TypeScript sniff engine
packages/web/    Vite + React playground
apps/worker/     FastAPI (AGPL-3.0) — ssdeep, URL, batch
fixtures/        Test samples
```

## License

- `packages/*` — MIT
- `apps/worker` — AGPL-3.0

## Author

Built by [Chaitanya Prabuddha](https://www.chaitanyaprabuddha.com) · [GitHub](https://github.com/chayprabs/magic-byte-detector) · [@chayprabs](https://x.com/chayprabs)
