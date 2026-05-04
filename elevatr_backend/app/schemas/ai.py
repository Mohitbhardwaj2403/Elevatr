"""AI career guidance schemas."""

from typing import List, Optional

from pydantic import BaseModel, Field


class CareerAdviceRequest(BaseModel):
    message: str = Field(..., min_length=5, max_length=2000)
    current_role: Optional[str] = Field(None, max_length=200)
    target_role: Optional[str] = Field(None, max_length=200)
    skills: Optional[List[str]] = Field(default=None)
    years_experience: Optional[int] = Field(None, ge=0, le=60)


class SkillRecommendation(BaseModel):
    skill: str
    reason: str
    resources: List[str]
    priority: str  # high | medium | low


class CareerPathSuggestion(BaseModel):
    path: str
    description: str
    estimated_timeline: str
    required_skills: List[str]


class CareerAdviceResponse(BaseModel):
    advice: str
    career_paths: List[CareerPathSuggestion]
    skill_recommendations: List[SkillRecommendation]
    action_items: List[str]
    resources: List[str]
