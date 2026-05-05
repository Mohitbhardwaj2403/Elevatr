"""
LLM async client wrapper.

Prefers Gemini when GEMINI_API_KEY is configured, otherwise uses OpenAI.
Falls back to realistic stub responses when no provider key is configured,
so the backend runs locally during development.
"""

import json
import logging
from typing import Any

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

_client = None


def _looks_like_placeholder(value: str) -> bool:
    """Detect obvious template/placeholder API keys."""
    normalized = value.strip().lower()
    if not normalized:
        return True
    placeholder_markers = (
        "...",
        "your-",
        "change_me",
        "example",
        "replace",
        "placeholder",
        "dummy",
    )
    return any(marker in normalized for marker in placeholder_markers)


def _has_valid_openai_key() -> bool:
    key = (settings.OPENAI_API_KEY or "").strip()
    return bool(key) and not _looks_like_placeholder(key)


def _get_client():
    global _client
    if _client is None and _has_valid_openai_key():
        from openai import AsyncOpenAI
        _client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY.strip())
    return _client


async def _gemini_generate(
    *,
    system_prompt: str,
    user_message: str,
    response_format: str,
    temperature: float,
    max_tokens: int,
) -> tuple[str, int]:
    """
    Minimal Gemini REST call (no extra SDK dependency).
    Uses the Generative Language API v1beta.
    """
    url = (
        "https://generativelanguage.googleapis.com/v1beta/"
        f"models/{settings.GEMINI_MODEL}:generateContent"
    )

    if response_format == "json":
        format_note = (
            "\n\nReturn ONLY a valid JSON object. Do not wrap it in markdown fences."
        )
    else:
        format_note = ""

    payload: dict[str, Any] = {
        "contents": [
            {
                "role": "user",
                "parts": [{"text": f"{system_prompt}\n\n{user_message}{format_note}"}],
            }
        ],
        "generationConfig": {
            "temperature": temperature,
            "maxOutputTokens": max_tokens,
        },
    }

    async with httpx.AsyncClient(timeout=45.0) as client:
        resp = await client.post(url, params={"key": settings.GEMINI_API_KEY}, json=payload)
        resp.raise_for_status()
        data = resp.json()

    candidates = data.get("candidates") or []
    content = ""
    if candidates:
        parts = (((candidates[0] or {}).get("content") or {}).get("parts")) or []
        if parts and isinstance(parts[0], dict):
            content = str(parts[0].get("text") or "")

    usage = data.get("usageMetadata") or {}
    tokens = int(usage.get("totalTokenCount") or 0)
    return content.strip(), tokens


async def chat_completion(
    system_prompt: str,
    user_message: str,
    response_format: str = "text",   # "text" | "json"
    temperature: float | None = None,
    max_tokens: int | None = None,
) -> tuple[str, int]:
    """
    Call OpenAI Chat Completions.

    Returns
    -------
    (response_text, tokens_used)
    """
    resolved_temperature = (
        temperature if temperature is not None else settings.OPENAI_TEMPERATURE
    )
    resolved_max_tokens = max_tokens if max_tokens is not None else settings.OPENAI_MAX_TOKENS

    if settings.GEMINI_API_KEY:
        try:
            return await _gemini_generate(
                system_prompt=system_prompt,
                user_message=user_message,
                response_format=response_format,
                temperature=resolved_temperature,
                max_tokens=resolved_max_tokens,
            )
        except Exception:
            logger.exception("Gemini call failed; falling back to OpenAI/stub.")

    client = _get_client()
    if client is None:
        logger.warning("No LLM API key set – returning stub response.")
        return _stub_response(user_message, response_format), 0

    kwargs: dict[str, Any] = {
        "model": settings.OPENAI_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        "temperature": resolved_temperature,
        "max_tokens": resolved_max_tokens,
    }

    if response_format == "json":
        kwargs["response_format"] = {"type": "json_object"}

    try:
        from openai import APIConnectionError, APIError, APITimeoutError, RateLimitError
        recoverable_errors: tuple[type[BaseException], ...] = (
            APIError,
            APIConnectionError,
            APITimeoutError,
            RateLimitError,
            httpx.HTTPError,
            TimeoutError,
        )
    except Exception:
        # If OpenAI error classes cannot be imported, only catch network-level failures.
        recoverable_errors = (httpx.HTTPError, TimeoutError)

    try:
        response = await client.chat.completions.create(**kwargs)
        content = response.choices[0].message.content or ""
        tokens = response.usage.total_tokens if response.usage else 0
        return content.strip(), tokens
    except recoverable_errors:
        logger.exception("OpenAI call failed; returning stub response.")
        return _stub_response(user_message, response_format), 0


# ─── Development stub ────────────────────────────────────────────

def _stub_response(user_message: str, response_format: str) -> str:
    """Return a realistic-looking stub when no API key is available."""
    if response_format == "json":
        return json.dumps({
            "score": 72.5,
            "grade": "B",
            "message": "Good resume – add more quantified achievements.",
            "keywords_found": ["Python", "FastAPI", "SQL"],
            "keywords_missing": ["Docker", "Kubernetes", "CI/CD"],
            "strengths": ["Clear work history", "Strong technical skills section"],
            "suggestions": [
                {"category": "Keywords", "message": "Add Docker & Kubernetes", "priority": "high"},
                {"category": "Achievements", "message": "Quantify your impact with numbers", "priority": "medium"},
            ],
            "section_scores": {"summary": 80, "experience": 70, "skills": 75, "education": 85},
            "feedback": "Your answer demonstrates solid understanding. Try to be more specific with examples.",
            "score_value": 78,
            "strengths_list": ["Good structure", "Relevant experience cited"],
            "improvements": ["Add specific metrics", "Mention tools used"],
            "model_answer_hint": "A strong answer uses the STAR method: Situation, Task, Action, Result.",
            "career_paths": [
                {"path": "Senior Engineer", "description": "Lead technical teams", "estimated_timeline": "2-3 years", "required_skills": ["System Design", "Leadership"]},
            ],
            "skill_recommendations": [
                {"skill": "System Design", "reason": "Critical for senior roles", "resources": ["Designing Data-Intensive Applications"], "priority": "high"},
            ],
            "action_items": ["Update LinkedIn", "Practice system design problems", "Build a side project"],
            "resources": ["leetcode.com", "systemdesign.io"],
            "advice": "Focus on building leadership experience and system design skills for your target role.",
            "questions": [
                "Tell me about yourself and your background.",
                "Describe a challenging technical problem you solved.",
                "How do you approach system design?",
                "Tell me about a time you worked in a team under pressure.",
                "Where do you see yourself in 5 years?",
            ],
            "improved_text": "[AI-improved resume would appear here with enhanced language and structure]",
        })
    return (
        "This is a development stub response. Configure OPENAI_API_KEY in your .env file "
        "to enable real AI-powered responses."
    )
