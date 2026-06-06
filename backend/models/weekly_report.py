import uuid
from sqlalchemy import Column, String, Float, Integer, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class WeeklyReport(Base):
    __tablename__ = "weekly_reports"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, __import__('sqlalchemy').ForeignKey("users.id"), nullable=False, index=True)

    week_start = Column(DateTime(timezone=True), nullable=False)
    week_end = Column(DateTime(timezone=True), nullable=False)

    total_prompts = Column(Integer, default=0)
    avg_score = Column(Float, default=0.0)
    best_category = Column(String, nullable=True)
    worst_category = Column(String, nullable=True)
    improvement_pct = Column(Float, default=0.0)

    # JSON fields for rich data
    top_mistakes = Column(JSON, default=list)
    coaching_suggestions = Column(JSON, default=list)
    dimension_avgs = Column(JSON, default=dict)

    generated_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="weekly_reports")