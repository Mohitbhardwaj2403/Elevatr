"""
Redis client wrapper with async helpers.
Used for: response caching, session storage, rate limiting.
"""

import hashlib
import json
import logging
from typing import Any, Optional

import redis.asyncio as aioredis

from app.core.config import settings

logger = logging.getLogger(__name__)

_redis: Optional[aioredis.Redis] = None


async def get_redis() -> aioredis.Redis:
    """Return a shared Redis client (lazily initialised)."""
    global _redis
    if _redis is None:
        _redis = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
            socket_timeout=5,
        )
    return _redis


async def cache_get(key: str) -> Optional[Any]:
    try:
        r = await get_redis()
        raw = await r.get(key)
        return json.loads(raw) if raw else None
    except Exception as exc:
        logger.warning("Redis GET failed: %s", exc)
        return None


async def cache_set(key: str, value: Any, ttl: int = settings.CACHE_TTL) -> None:
    try:
        r = await get_redis()
        await r.setex(key, ttl, json.dumps(value, default=str))
    except Exception as exc:
        logger.warning("Redis SET failed: %s", exc)


async def cache_delete(key: str) -> None:
    try:
        r = await get_redis()
        await r.delete(key)
    except Exception as exc:
        logger.warning("Redis DELETE failed: %s", exc)


def make_cache_key(*parts: str) -> str:
    """Build a deterministic cache key from arbitrary string parts."""
    raw = ":".join(str(p) for p in parts)
    digest = hashlib.sha256(raw.encode()).hexdigest()[:16]
    return f"elevatr:{digest}"
