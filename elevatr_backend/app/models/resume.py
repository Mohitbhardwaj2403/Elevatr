"""Resume ORM model."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class Resume(Base):
    __tablename__ = "resumes"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    title: Mapped[str] = mapped_column(String(200), default="My Resume", nullable=False)
    resume_text: Mapped[str] = mapped_column(Text, nullable=False)
    improved_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    ats_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    job_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    template: Mapped[str] = mapped_column(String(50), default="professional", nullable=False)
    suggestions: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list, nullable=False)
    keywords_found: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list, nullable=False)
    keywords_missing: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list, nullable=False)
    strengths: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list, nullable=False)
    version: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user: Mapped["User"] = relationship("User", back_populates="resumes")  # noqa: F821

    def __repr__(self) -> str:
        return f"<Resume id={self.id} user_id={self.user_id} ats={self.ats_score}>"
