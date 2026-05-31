"""Worker response shape tests."""

from app.main import _build_result


def test_optional_fields_omitted_not_null():
    data = b"%PDF-1.4\n"
    r = _build_result(data, "x.pdf", "application/pdf")
    assert "container" not in r or r["container"] is not None
    assert "null" not in str(r)
    assert "ssdeep" not in r["hashes"] or r["hashes"]["ssdeep"]


def test_mismatch_exe_as_jpg():
    data = b"MZ" + bytes(64)
    r = _build_result(data, "photo.jpg", "image/jpeg")
    assert r["extensionMismatch"] is True
    assert r["mimeMismatch"] is True
