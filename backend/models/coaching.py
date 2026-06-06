import uuid

from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class CoachingInsight(Base):
    __tablename__ = "coaching_insights"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    # Which user this insight belongs to
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)

    # Type of habit detected — e.g. "missing_constraints", "vague_prompts"
    insight_type = Column(String, nullable=False)

    # The actual human-readable coaching message from Claude
    message = Column(Text, nullable=False)

    # The dimension this insight targets — clarity, specificity, etc.
    target_dimension = Column(String, nullable=True)

    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="insights")