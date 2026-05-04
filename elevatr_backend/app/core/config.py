"""
Elevatr – Centralised configuration via pydantic-settings.
"""

import os
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
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # ── CORS ─────────────────────────────
    CORS_ORIGINS: List[str] = ["*"]

    # ── Limits ───────────────────────────
    MAX_RESUME_SIZE_CHARS: int = 50000


settings = Settings()

