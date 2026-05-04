"""Interview session schemas."""

import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class GenerateQuestionsRequest(BaseModel):
    job_role: str = Field(..., min_length=2, max_length=200, examples=["Software Engineer"])
    difficulty: str = Field(default="intermediate", pattern="^(beginner|intermediate|advanced)$")
    num_questions: int = Field(default=5, ge=1, le=10)
    focus_areas: Optional[List[str]] = Field(
        default=None,
        description="e.g. ['system design', 'algorithms', 'behavioral']"
    )


class GenerateQuestionsResponse(BaseModel):
    job_role: str
    difficulty: str
    questions: List[str]


class AnalyzeAnswerRequest(BaseModel):
    session_id: Optional[uuid.UUID] = None   # existing session to update
    job_role: str = Field(..., min_length=2, max_length=200)
    question: str = Field(..., min_length=5)
    answer: str = Field(..., min_length=1)
    difficulty: str = Field(default="intermediate", pattern="^(beginner|intermediate|advanced)$")


class AnswerFeedback(BaseModel):
    score: float                    # 0–100
    grade: str                      # A–F
    feedback: str
    strengths: List[str]
    improvements: List[str]
    model_answer_hint: str


class InterviewSessionOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    job_role: str
    difficulty: str
    question: str
    answer: Optional[str]
    feedback: Optional[str]
    score: float
    strengths: List[str]
    improvements: List[str]
    status: str
    duration_seconds: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class InterviewHistoryItem(BaseModel):
    id: uuid.UUID
    job_role: str
    difficulty: str
    score: float
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
