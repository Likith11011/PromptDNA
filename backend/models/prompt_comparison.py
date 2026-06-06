import uuid
from sqlalchemy import Column, String, Float, DateTime, Text, JSON
from sqlalchemy.sql import func
from database import Base


class PromptComparison(Base):
    __tablename__ = "prompt_comparisons"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, __import__('sqlalchemy').ForeignKey("users.id"), nullable=False, index=True)

    prompt_a = Column(Text, nullable=False)
    prompt_b = Column(Text, nullable=False)

    score_a = Column(Float, default=0.0)
    score_b = Column(Float, default=0.0)

    scores_a = Column(JSON, default=dict)
    scores_b = Column(JSON, default=dict)

    winner = Column(String, nullable=True)  # "A" or "B" or "tie"
    recommendation = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())