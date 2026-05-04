# ────────────────────────────────────────────────────────────────
# Elevatr – FastAPI Backend (Clean & Stable)
# ────────────────────────────────────────────────────────────────

# ── Base image ───────────────────────────────────────────────────
FROM python:3.11-slim

# ── Environment ──────────────────────────────────────────────────
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# ── System deps (for asyncpg, bcrypt etc.) ───────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
        gcc \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# ── Workdir ──────────────────────────────────────────────────────
WORKDIR /app

# ── Install Python deps ──────────────────────────────────────────
COPY requirements.txt .
RUN pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# ── Copy project files ───────────────────────────────────────────
COPY . .

# ── Security (non-root user) ─────────────────────────────────────
RUN addgroup --system app && adduser --system --ingroup app app \
 && chown -R app:app /app
USER app

# ── Expose port ──────────────────────────────────────────────────
EXPOSE 8000

# ── Healthcheck ──────────────────────────────────────────────────
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

# ── Start FastAPI ────────────────────────────────────────────────
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]