"""
Elevatr – Centralised configuration via pydantic-settings.
"""

import os
import json
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # ── Meta ─────────────────────────────
    PROJECT_NAME: str = "Elevatr API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "production"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False
    PORT: int = 8000
    ALLOWED_HOSTS: list[str] = ["*"]

    # ── Database (IMPORTANT FIX) ─────────
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    @property
    def ASYNC_DATABASE_URL(self) -> str:
        if not self.DATABASE_URL:
            raise ValueError("DATABASE_URL is not set")

        return self.DATABASE_URL.replace(
            "postgresql://", "postgresql+asyncpg://"
        )

    # ── Redis ────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"
    CACHE_TTL: int = 300           # seconds – default cache TTL
    RATE_LIMIT_REQUESTS: int = 60  # requests per minute per IP
    # ── Auth ─────────────────────────────
    JWT_SECRET: str = os.getenv("JWT_SECRET", "change_this")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7   # 7 days

    # ── OpenAI ───────────────────────────
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    OPENAI_MAX_TOKENS: int = int(os.getenv("OPENAI_MAX_TOKENS", "2048"))
    OPENAI_TEMPERATURE: float = float(os.getenv("OPENAI_TEMPERATURE", "0.7"))

    # ── Gemini ───────────────────────────
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

    # ── CORS ─────────────────────────────
    # Keep this explicit in production when allow_credentials=True.
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # ── Limits ───────────────────────────
    MAX_RESUME_SIZE_CHARS: int = 50000


settings = Settings()


def parse_cors_origins(raw: str | List[str] | None) -> List[str]:
    """Parse CORS origins from JSON array or comma-separated string."""
    if not raw:
        return settings.CORS_ORIGINS
    if isinstance(raw, list):
        return [str(x).strip() for x in raw if str(x).strip()]
    value = raw.strip()
    if not value:
        return settings.CORS_ORIGINS
    if value.startswith("["):
        try:
            parsed = json.loads(value)
            if isinstance(parsed, list):
                return [str(x).strip() for x in parsed if str(x).strip()]
        except json.JSONDecodeError:
            pass
    return [part.strip() for part in value.split(",") if part.strip()]

