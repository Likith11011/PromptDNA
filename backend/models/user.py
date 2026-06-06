import uuid
from sqlalchemy import Column, String, Integer, Float, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    total_prompts = Column(Integer, default=0)
    avg_score = Column(Float, default=0.0)

    # Personality type — computed from prompt history
    personality_type = Column(String, nullable=True)
    personality_updated_at = Column(DateTime(timezone=True), nullable=True)

    prompts = relationship("PromptLog", back_populates="user", cascade="all, delete-orphan")
    insights = relationship("CoachingInsight", back_populates="user", cascade="all, delete-orphan")
    feedback = relationship("Feedback", back_populates="user", cascade="all, delete-orphan")
    weekly_reports = relationship("WeeklyReport", back_populates="user", cascade="all, delete-orphan")