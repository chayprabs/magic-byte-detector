# FileSniff Worker

FastAPI service for full-file scan, ssdeep fuzzy hashing, and URL fetch. Licensed under AGPL-3.0.

## Run locally

```bash
pip install -e .
uvicorn app.main:app --reload --port 8787
```

## Docker

```bash
docker build -t filesniff-worker .
docker run -p 8787:8787 filesniff-worker
```
