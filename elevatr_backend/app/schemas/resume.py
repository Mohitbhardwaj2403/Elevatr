"""Resume request/response schemas."""

import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class ResumeCreateRequest(BaseModel):
    title: str = Field(default="My Resume", max_length=200)
    resume_text: str = Field(..., min_length=50, description="Raw resume content")
    template: str = Field(default="professional", max_length=50)
    job_description: Optional[str] = Field(None, description="Target job description for ATS scoring")


class ResumeUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    resume_text: Optional[str] = Field(None, min_length=50)
    job_description: Optional[str] = None
    template: Optional[str] = None


class ResumeImproveRequest(BaseModel):
    resume_id: uuid.UUID
    focus_areas: Optional[List[str]] = Field(
        default=None,
        description="Specific areas to improve: summary, experience, skills, etc."
    )


class ATSScoreRequest(BaseModel):
    resume_text: str = Field(..., min_length=50)
    job_description: str = Field(..., min_length=30, description="Job description to compare against")


class ATSSuggestion(BaseModel):
    category: str
    message: str
    priority: str  # high | medium | low


class ATSScoreResponse(BaseModel):
    score: float
    grade: str              # A, B, C, D, F
    message: str
    keywords_found: List[str]
    keywords_missing: List[str]
    strengths: List[str]
    suggestions: List[ATSSuggestion]
    section_scores: dict


class ResumeOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    resume_text: str
    improved_text: Optional[str]
    ats_score: float
    job_description: Optional[str]
    template: str
    suggestions: List[str]
    keywords_found: List[str]
    keywords_missing: List[str]
    strengths: List[str]
    version: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ResumeListItem(BaseModel):
    id: uuid.UUID
    title: str
    ats_score: float
    template: str
    version: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
