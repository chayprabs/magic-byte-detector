"""FileSniff worker - full file scan, ssdeep, macro heuristics."""

from __future__ import annotations

import hashlib
import ipaddress
import os
import socket
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import httpx
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl

app = FastAPI(title="FileSniff Worker", version="1.0.0")

ALLOWED_ORIGINS = os.environ.get(
    "CORS_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in ALLOWED_ORIGINS if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_UPLOAD = int(os.environ.get("MAX_UPLOAD_BYTES", str(50 * 1024 * 1024)))

SIGS = [
    (b"%PDF", "application/pdf", "PDF", "document", ("pdf",)),
    (b"PK\x03\x04", "application/zip", "ZIP", "archive", ("zip", "docx", "xlsx", "jar", "epub")),
    (b"\x89PNG", "image/png", "PNG", "image", ("png",)),
    (b"\xff\xd8\xff", "image/jpeg", "JPEG", "image", ("jpg", "jpeg")),
    (b"GIF8", "image/gif", "GIF", "image", ("gif",)),
    (b"MZ", "application/x-msdownload", "PE/EXE", "executable", ("exe", "dll", "scr")),
    (b"\xd0\xcf\x11\xe0", "application/x-ole-storage", "OLE/CFB", "office", ("doc", "xls", "ppt")),
]


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


def _blocked_host(hostname: str) -> bool:
    if not hostname:
        return True
    host = hostname.lower().strip(".")
    if host in ("localhost", "metadata.google.internal"):
        return True
    try:
        for info in socket.getaddrinfo(host, None):
            ip = ipaddress.ip_address(info[4][0])
            if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved:
                return True
    except socket.gaierror:
        return True
    return False


def _validate_url(url: str) -> None:
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https"):
        raise HTTPException(400, "Only http(s) URLs supported")
    if _blocked_host(parsed.hostname or ""):
        raise HTTPException(400, "URL host not allowed")


def _detect_magic(data: bytes) -> dict[str, Any]:
    primary = {
        "mime": "application/octet-stream",
        "format": "Unknown",
        "family": "unknown",
        "confidence": 0.1,
    }
    alts: list[dict[str, Any]] = []
    ext_map: tuple[str, ...] = ()
    for magic, mime, fmt, fam, exts in SIGS:
        if data.startswith(magic):
            match = {"mime": mime, "format": fmt, "family": fam, "confidence": 0.85}
            if primary["confidence"] < 0.5:
                primary = match
                ext_map = exts
            else:
                alts.append({k: match[k] for k in ("mime", "format", "confidence")})
    return {"primary": primary, "alternatives": alts[:4], "extensions": ext_map}


def _risk_flags(data: bytes, primary_format: str) -> list[str]:
    flags: list[str] = []
    lower = data[:65536].lower()
    if primary_format.startswith("OLE") and any(
        m in lower for m in (b"_vba_project", b"vba6", b"vba7")
    ):
        flags.append("office_macro")
    if len(data) > 64 and data.find(b"MZ", 4, min(len(data), 65536)) >= 0:
        flags.append("embedded_exe")
    if data[:4] == b"%PDF" and b"PK\x03\x04" in data[:64]:
        flags.append("polyglot")
    ent = _entropy(data[:4096])
    if ent > 7.5:
        flags.append("high_entropy")
    if data.startswith(b"PK\x03\x04") and len(data) >= 4096:
        printable = sum(1 for b in data if 0x20 <= b <= 0x7E)
        if len(data) / max(1, printable) > 50:
            flags.append("archive_bomb")
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


def _routing_hints(primary: dict[str, Any], container: str | None, risk: list[str]) -> list[dict[str, str]]:
    hints: list[dict[str, str]] = []
    fam = primary.get("family", "")
    fmt = primary.get("format", "")
    if fam == "archive" or "ZIP" in fmt or container:
        hints.append({"tool": "ArchiveVet", "reason": "Inspect archive contents"})
    if fam == "image":
        hints.append({"tool": "ExifScrub", "reason": "Review image metadata"})
    if "PDF" in fmt:
        hints.append({"tool": "PdfForms", "reason": "Analyze PDF structure"})
    if container and "EPUB" in container:
        hints.append({"tool": "EpubDoctor", "reason": "Validate EPUB package"})
    if fam == "font":
        hints.append({"tool": "FontOps", "reason": "Font conversion tools"})
    if "office_macro" in risk:
        hints.append({"tool": "Macro deep scan", "reason": "VBA streams detected"})
    return hints


def _macro_deep(data: bytes, filename: str | None) -> bool:
    """Optional oletools macro inspection."""
    try:
        import io
        import tempfile

        from oletools import olevba

        suffix = Path(filename or "upload.bin").suffix or ".bin"
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=True) as tmp:
            tmp.write(data)
            tmp.flush()
            vbaparser = olevba.VBA_Parser(tmp.name, data=io.BytesIO(data))
            if vbaparser.detect_vba_macros():
                return True
    except Exception:
        pass
    return False


def _container(data: bytes) -> str | None:
    text = data[:8192].decode("latin-1", errors="ignore").lower()
    if not data.startswith(b"PK\x03\x04"):
        return None
    if "word/" in text:
        return "Microsoft Word (DOCX)"
    if "xl/" in text:
        return "Microsoft Excel (XLSX)"
    if "androidmanifest" in text:
        return "Android APK"
    if "epub" in text:
        return "EPUB"
    return "ZIP container"


def _build_result(
    data: bytes,
    filename: str | None = None,
    claimed_mime: str | None = None,
) -> dict[str, Any]:
    det = _detect_magic(data)
    ext = Path(filename).suffix.lstrip(".").lower() if filename else ""
    expected = det.pop("extensions", ())
    extension_mismatch = bool(ext and expected and ext not in expected)
    claimed = (claimed_mime or "").split(";")[0].strip().lower()
    mime_mismatch = bool(
        claimed
        and claimed != det["primary"]["mime"]
        and claimed != "application/octet-stream"
    )
    risk = _risk_flags(data, det["primary"]["format"])
    if _macro_deep(data, filename) and "office_macro" not in risk:
        risk.append("office_macro")
    container = _container(data)
    strong = len(det["alternatives"]) >= 1 and det["primary"]["confidence"] >= 0.5
    retention = int(os.environ.get("RETENTION_MINUTES", "5"))
    return {
        **det,
        "extensionMismatch": extension_mismatch,
        "mimeMismatch": mime_mismatch,
        "ambiguity": strong or "polyglot" in risk,
        "container": container,
        "riskFlags": risk,
        "hashes": {"sha256": _sha256(data), "ssdeep": _ssdeep(data)},
        "routingHints": _routing_hints(det["primary"], container, risk),
        "bytesRead": len(data),
        "privacyMode": False,
        "retentionPolicy": f"Ephemeral; deleted within {retention} minutes",
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/v1/scan")
async def scan_file(file: UploadFile = File(...)) -> dict[str, Any]:
    data = await file.read()
    if len(data) > MAX_UPLOAD:
        raise HTTPException(413, "File too large")
    return _build_result(data, file.filename, file.content_type)


@app.post("/v1/scan/url")
async def scan_url(body: UrlScanRequest) -> dict[str, Any]:
    url = str(body.url)
    _validate_url(url)
    async with httpx.AsyncClient(follow_redirects=False, timeout=30.0) as client:
        resp = await client.get(url)
        resp.raise_for_status()
        data = resp.content
        ctype = resp.headers.get("content-type", "")
    if len(data) > MAX_UPLOAD:
        raise HTTPException(413, "Remote file too large")
    return _build_result(data, url.split("/")[-1] or "download", ctype)


@app.post("/v1/batch")
async def batch_scan(file: UploadFile = File(...)) -> dict[str, Any]:
    import csv
    import io
    import zipfile

    data = await file.read()
    if len(data) > MAX_UPLOAD:
        raise HTTPException(413, "Archive too large")
    rows = []
    with zipfile.ZipFile(io.BytesIO(data)) as zf:
        for name in zf.namelist()[:100]:
            if name.endswith("/") or ".." in name or name.startswith("/"):
                continue
            try:
                content = zf.read(name)
            except Exception:
                continue
            if len(content) > 10 * 1024 * 1024:
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
