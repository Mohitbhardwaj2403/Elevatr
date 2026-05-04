# ──────────────────────────────────────────────────────────────────────────────
# Elevatr – FastAPI Backend
# Multi-stage build: keeps the final image lean (~200 MB)
# ──────────────────────────────────────────────────────────────────────────────

# ── Stage 1: build / install deps ────────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /build

# Install build tools for compiled packages (bcrypt, asyncpg, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
        gcc \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip \
 && pip install --no-cache-dir --prefix=/install -r requirements.txt \
 && pip install --no-cache-dir uvicorn[standard]


# ── Stage 2: runtime ─────────────────────────────────────────────────────────
FROM python:3.11-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/install/bin:/usr/local/bin:$PATH" \
    PYTHONPATH=/app

RUN apt-get update && apt-get install -y --no-install-recommends \
        libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Non-root user for security
RUN addgroup --system app && adduser --system --ingroup app app

WORKDIR /app

COPY --from=builder /install /install
COPY . .

RUN chown -R app:app /app
USER app

EXPOSE 8000

# Healthcheck so Docker Compose / Kubernetes knows when the app is ready
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

    CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
