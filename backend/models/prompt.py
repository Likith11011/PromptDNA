import uuid

from sqlalchemy import Column, String, Float, DateTime, Text, ForeignKey, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class PromptLog(Base):
    __tablename__ = "prompt_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    original_prompt = Column(Text, nullable=False)
    improved_prompt = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    total_score = Column(Float, default=0.0)
    coaching_tip = Column(Text, nullable=True)
    success_probability = Column(Integer, default=50)
    success_reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    scores = relationship(
        "PromptScores",
        back_populates="prompt",
        uselist=False,
        cascade="all, delete-orphan"
    )
    user = relationship("User", back_populates="prompts")
    feedback = relationship("Feedback", back_populates="prompt", cascade="all, delete-orphan")


class PromptScores(Base):
    __tablename__ = "prompt_scores"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    prompt_id = Column(String, ForeignKey("prompt_logs.id"), nullable=False, unique=True)
    clarity = Column(Float, default=0.0)
    specificity = Column(Float, default=0.0)
    context = Column(Float, default=0.0)
    constraints = Column(Float, default=0.0)
    examples = Column(Float, default=0.0)

    prompt = relationship("PromptLog", back_populates="scores")