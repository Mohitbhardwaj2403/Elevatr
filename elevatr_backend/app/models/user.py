"""User ORM model."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.session import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    plan: Mapped[str] = mapped_column(String(50), default="free", nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    resumes: Mapped[list["Resume"]] = relationship(  # noqa: F821
        "Resume", back_populates="user", cascade="all, delete-orphan", lazy="select"
    )
    job_applications: Mapped[list["JobApplication"]] = relationship(  # noqa: F821
        "JobApplication", back_populates="user", cascade="all, delete-orphan", lazy="select"
    )
    interview_sessions: Mapped[list["InterviewSession"]] = relationship(  # noqa: F821
        "InterviewSession", back_populates="user", cascade="all, delete-orphan", lazy="select"
    )
    ai_conversations: Mapped[list["AIConversation"]] = relationship(  # noqa: F821
        "AIConversation", back_populates="user", cascade="all, delete-orphan", lazy="select"
    )

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email}>"
