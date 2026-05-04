"""
Elevatr – Centralised configuration via pydantic-settings.
All values are read from environment variables or .env file.
"""

from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # ── Meta ────────────────────────────────────────────────────
    PROJECT_NAME: str = "Elevatr API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"   # development | production
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True

    # ── Database ────────────────────────────────────────────────
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/elevatr"

    # ── Redis ───────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"
    CACHE_TTL: int = 300           # seconds – default cache TTL
    RATE_LIMIT_REQUESTS: int = 60  # requests per minute per IP

    # ── Auth / JWT ───────────────────────────────────────────────
    JWT_SECRET: str = "CHANGE_ME_IN_PRODUCTION_32_CHARS_MIN"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7   # 7 days

    # ── OpenAI ──────────────────────────────────────────────────
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_MAX_TOKENS: int = 2048
    OPENAI_TEMPERATURE: float = 0.7

    # ── CORS ────────────────────────────────────────────────────
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",   # Vite dev server
        "http://localhost:3000",
        "http://localhost:5566",
        "http://127.0.0.1:5173",
    ]
    ALLOWED_HOSTS: List[str] = ["*"]

    # ── Limits ──────────────────────────────────────────────────
    MAX_RESUME_SIZE_CHARS: int = 50_000


settings = Settings()
