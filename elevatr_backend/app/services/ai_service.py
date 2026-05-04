"""
AI career guidance service.
"""

import json
import logging
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.openai_client import chat_completion
from app.ai.prompts import CAREER_ADVICE_SYSTEM
from app.core.config import settings
from app.database.redis_client import cache_get, cache_set, make_cache_key
from app.models.ai_conversation import AIConversation
from app.schemas.ai import (
    CareerAdviceRequest,
    CareerAdviceResponse,
    CareerPathSuggestion,
    SkillRecommendation,
)

logger = logging.getLogger(__name__)


async def get_career_advice(
    db: AsyncSession,
    user_id: uuid.UUID,
    payload: CareerAdviceRequest,
) -> CareerAdviceResponse:
    """Generate personalised career advice."""
    # Build a rich prompt with optional user context
    context_parts = [f"User message: {payload.message}"]
    if payload.current_role:
        context_parts.append(f"Current role: {payload.current_role}")
    if payload.target_role:
        context_parts.append(f"Target role: {payload.target_role}")
    if payload.years_experience is not None:
        context_parts.append(f"Years of experience: {payload.years_experience}")
    if payload.skills:
        context_parts.append(f"Current skills: {', '.join(payload.skills)}")

    user_msg = "\n".join(context_parts)

    # Light caching: same message from same user context
    cache_key = make_cache_key("career", user_msg[:300])
    cached = await cache_get(cache_key)
    if cached:
        return CareerAdviceResponse(**cached)

    raw, tokens = await chat_completion(
        system_prompt=CAREER_ADVICE_SYSTEM,
        user_message=user_msg,
        response_format="json",
        temperature=0.7,
    )

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        data = {"advice": raw}

    response = CareerAdviceResponse(
        advice=data.get("advice", ""),
        career_paths=[
            CareerPathSuggestion(**p)
            for p in data.get("career_paths", [])
            if isinstance(p, dict)
        ],
        skill_recommendations=[
            SkillRecommendation(**s)
            for s in data.get("skill_recommendations", [])
            if isinstance(s, dict)
        ],
        action_items=data.get("action_items", []),
        resources=data.get("resources", []),
    )

    await cache_set(cache_key, response.model_dump(), ttl=1800)

    convo = AIConversation(
        user_id=user_id,
        conversation_type="career_advice",
        user_message=payload.message[:2000],
        ai_response=raw[:5000],
        tokens_used=tokens,
        model=settings.OPENAI_MODEL,
    )
    db.add(convo)
    await db.flush()
    return response
