"""
OpenAI async client wrapper.
Falls back to rule-based responses when the API key is not configured,
so the backend runs locally without a paid key during development.
"""

import json
import logging
from typing import Any

from app.core.config import settings

logger = logging.getLogger(__name__)

_client = None


def _get_client():
    global _client
    if _client is None and settings.OPENAI_API_KEY:
        from openai import AsyncOpenAI
        _client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    return _client


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
    client = _get_client()
    if client is None:
        logger.warning("OPENAI_API_KEY not set – returning stub response.")
        return _stub_response(user_message, response_format), 0

    kwargs: dict[str, Any] = {
        "model": settings.OPENAI_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message},
        ],
        "temperature": temperature if temperature is not None else settings.OPENAI_TEMPERATURE,
        "max_tokens": max_tokens if max_tokens is not None else settings.OPENAI_MAX_TOKENS,
    }

    if response_format == "json":
        kwargs["response_format"] = {"type": "json_object"}

    response = await client.chat.completions.create(**kwargs)
    content = response.choices[0].message.content or ""
    tokens = response.usage.total_tokens if response.usage else 0
    return content.strip(), tokens


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
