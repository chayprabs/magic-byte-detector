"""FileSniff worker - full file scan, ssdeep, macro heuristics."""

from __future__ import annotations

import hashlib
import os
import re
import tempfile
from pathlib import Path
from typing import Any

import httpx
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl

app = FastAPI(title="FileSniff Worker", version="1.0.0")

ALLOWED_ORIGINS = os.environ.get(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in ALLOWED_ORIGINS if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_UPLOAD = int(os.environ.get("MAX_UPLOAD_BYTES", str(50 * 1024 * 1024)))
RETENTION_NOTE = "Ephemeral processing; files deleted after response."


class UrlScanRequest(BaseModel):
    url: HttpUrl


def _sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _ssdeep(data: bytes) -> str | None:
    try:
        import ssdeep

        return ssdeep.hash(data)
    except Exception:
        return None


def _detect_magic(data: bytes) -> dict[str, Any]:
    """Lightweight magic detection mirroring browser signatures."""
    sigs = [
        (b"%PDF", "application/pdf", "PDF", "document"),
        (b"PK\x03\x04", "application/zip", "ZIP", "archive"),
        (b"\x89PNG", "image/png", "PNG", "image"),
        (b"\xff\xd8\xff", "image/jpeg", "JPEG", "image"),
        (b"GIF8", "image/gif", "GIF", "image"),
        (b"MZ", "application/x-msdownload", "PE/EXE", "executable"),
        (b"\xd0\xcf\x11\xe0", "application/x-ole-storage", "OLE/CFB", "office"),
    ]
    primary = {
        "mime": "application/octet-stream",
        "format": "Unknown",
        "family": "unknown",
        "confidence": 0.1,
    }
    alts: list[dict[str, Any]] = []
    for magic, mime, fmt, fam in sigs:
        if data.startswith(magic) or magic in data[:4096]:
            match = {"mime": mime, "format": fmt, "family": fam, "confidence": 0.85}
            if primary["confidence"] < 0.5:
                primary = match
            else:
                alts.append({k: match[k] for k in ("mime", "format", "confidence")})
    return {"primary": primary, "alternatives": alts[:4]}


def _risk_flags(data: bytes) -> list[str]:
    flags: list[str] = []
    lower = data[:65536].lower()
    if b"_vba_project" in lower or b"macros" in lower:
        flags.append("office_macro")
    if data.find(b"MZ", 4) >= 0:
        flags.append("embedded_exe")
    if data[:4] == b"%PDF" and data[:2] == b"PK":
        flags.append("polyglot")
    ent = _entropy(data[:4096])
    if ent > 7.5:
        flags.append("high_entropy")
    return list(dict.fromkeys(flags))


def _entropy(chunk: bytes) -> float:
    if not chunk:
        return 0.0
    freq = [0] * 256
    for b in chunk:
        freq[b] += 1
    import math

    ent = 0.0
    n = len(chunk)
    for c in freq:
        if c:
            p = c / n
            ent -= p * math.log2(p)
    return ent


def _container(data: bytes) -> str | None:
    text = data[:8192].decode("latin-1", errors="ignore").lower()
    if b"PK\x03\x04" not in data[:4]:
        return None
    if "word/" in text:
        return "Microsoft Word (DOCX)"
    if "xl/" in text:
        return "Microsoft Excel (XLSX)"
    if "androidmanifest" in text:
        return "Android APK"
    if "mimetype" in text and "epub" in text:
        return "EPUB"
    return "ZIP container"


def _build_result(data: bytes, filename: str | None = None) -> dict[str, Any]:
    det = _detect_magic(data)
    ext = Path(filename).suffix.lstrip(".").lower() if filename else ""
    risk = _risk_flags(data)
    return {
        **det,
        "extensionMismatch": bool(ext and ext not in ("pdf", "zip", "png", "jpg", "exe", "doc")),
        "mimeMismatch": False,
        "ambiguity": len(det["alternatives"]) >= 1,
        "container": _container(data),
        "riskFlags": risk,
        "hashes": {"sha256": _sha256(data), "ssdeep": _ssdeep(data)},
        "routingHints": [],
        "bytesRead": len(data),
        "privacyMode": False,
        "_retention": RETENTION_NOTE,
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/v1/scan")
async def scan_file(file: UploadFile = File(...)) -> dict[str, Any]:
    data = await file.read()
    if len(data) > MAX_UPLOAD:
        raise HTTPException(413, "File too large")
    return _build_result(data, file.filename)


@app.post("/v1/scan/url")
async def scan_url(body: UrlScanRequest) -> dict[str, Any]:
    url = str(body.url)
    if not re.match(r"^https?://", url):
        raise HTTPException(400, "Only http(s) URLs supported")
    async with httpx.AsyncClient(follow_redirects=True, timeout=30.0) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        data = resp.content
    if len(data) > MAX_UPLOAD:
        raise HTTPException(413, "Remote file too large")
    return _build_result(data, url.split("/")[-1] or "download")


@app.post("/v1/batch")
async def batch_scan(file: UploadFile = File(...)) -> dict[str, Any]:
    """Pro batch: ZIP of files -> CSV-style summary."""
    import csv
    import io
    import zipfile

    data = await file.read()
    if len(data) > MAX_UPLOAD:
        raise HTTPException(413, "Archive too large")
    rows = []
    with zipfile.ZipFile(io.BytesIO(data)) as zf:
        for name in zf.namelist()[:100]:
            if name.endswith("/"):
                continue
            try:
                content = zf.read(name)
            except Exception:
                continue
            r = _build_result(content, name)
            rows.append(
                {
                    "name": name,
                    "format": r["primary"]["format"],
                    "mime": r["primary"]["mime"],
                    "sha256": r["hashes"]["sha256"],
                    "risk": ";".join(r["riskFlags"]),
                }
            )
    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=["name", "format", "mime", "sha256", "risk"])
    writer.writeheader()
    writer.writerows(rows)
    return {"report": buf.getvalue(), "count": len(rows)}
