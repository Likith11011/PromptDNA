from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CoachingInsightOut(BaseModel):
    id: str
    insight_type: str
    target_dimension: Optional[str]
    message: str
    generated_at: datetime

    class Config:
        from_attributes = True


class FeedbackRequest(BaseModel):
    prompt_id: str
    was_helpful: bool
    comment: Optional[str] = None


class FeedbackOut(BaseModel):
    id: str
    prompt_id: str
    was_helpful: bool
    comment: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class UserStatsOut(BaseModel):
    total_prompts: int
    avg_score: float
    weakest_dimension: Optional[str]
    strongest_dimension: Optional[str]
    top_categories: list[str]