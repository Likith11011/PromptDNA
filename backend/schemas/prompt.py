from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PromptAnalyzeRequest(BaseModel):
    prompt: str


class ScoresOut(BaseModel):
    clarity: float
    specificity: float
    context: float
    constraints: float
    examples: float

    class Config:
        from_attributes = True


class PromptAnalyzeResponse(BaseModel):
    id: str
    original_prompt: str
    improved_prompt: Optional[str]
    category: str
    total_score: float
    scores: ScoresOut
    coaching_tip: Optional[str] = None
    success_probability: int = 50
    success_reason: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class PromptHistoryItem(BaseModel):
    id: str
    original_prompt: str
    improved_prompt: Optional[str]
    category: str
    total_score: float
    success_probability: int = 50
    coaching_tip: Optional[str] = None
    success_reason: Optional[str] = None
    scores: Optional[ScoresOut] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AnalyticsResponse(BaseModel):
    score_trend: list
    category_breakdown: list
    dimension_averages: dict
    streak: int