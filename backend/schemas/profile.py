from pydantic import BaseModel
from typing import Optional


class PersonalityOut(BaseModel):
    type: str
    description: str
    icon: str
    traits: list[str]


class DNAProfileOut(BaseModel):
    total_prompts: int
    avg_score: float
    dimension_avgs: dict[str, float]
    strengths: list[str]
    weaknesses: list[str]
    trend_pct: float
    top_categories: list[str]
    personality: PersonalityOut
    heatmap: dict[str, float]
    weekly_trend: list[dict]


class ComparisonRequest(BaseModel):
    prompt_a: str
    prompt_b: str


class ComparisonOut(BaseModel):
    id: str
    prompt_a: str
    prompt_b: str
    score_a: float
    score_b: float
    scores_a: dict[str, float]
    scores_b: dict[str, float]
    winner: str
    recommendation: str
    category_a: str
    category_b: str


class WeeklyReportOut(BaseModel):
    total_prompts: int
    avg_score: float
    best_category: Optional[str]
    worst_category: Optional[str]
    improvement_pct: float
    top_mistakes: list[str]
    coaching_suggestions: list[str]
    dimension_avgs: dict[str, float]
    week_start: str
    week_end: str