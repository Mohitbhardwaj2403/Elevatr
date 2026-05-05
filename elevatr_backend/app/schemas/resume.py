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
    job_role: Optional[str] = Field(
        None, description="Target role like software_engineer or data_scientist"
    )


class ATSScoreResponse(BaseModel):
    score: int
    mode: str = "dataset"
    is_resume: bool
    keyword_match: int = 0
    matched_keywords: List[str] = Field(default_factory=list)
    missing_keywords: List[str] = Field(default_factory=list)
    sections_found: List[str] = Field(default_factory=list)
    missing_sections: List[str] = Field(default_factory=list)
    content_quality_score: int = 0
    formatting_score: int = 0
    feedback: List[str] = Field(default_factory=list)


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
