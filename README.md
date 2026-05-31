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

Open http://localhost:5173

### Worker (optional)

```bash
pip install -r apps/worker/requirements.txt
cd apps/worker && uvicorn app.main:app --port 8787
# or
docker compose up
```

Set `VITE_WORKER_URL=http://localhost:8787` for full scan and URL modes.

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
