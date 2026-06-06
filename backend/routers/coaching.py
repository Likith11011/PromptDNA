from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from database import get_db
from core.security import get_current_user
from models.user import User
from models.prompt import PromptScores, PromptLog
from schemas.coaching import CoachingInsightOut, FeedbackRequest, FeedbackOut, UserStatsOut
from services.coaching_service import (
    generate_coaching_insights,
    save_feedback,
    get_user_insights,
    get_user_stats,
)

router = APIRouter(prefix="/coaching", tags=["Coaching"])


@router.post("/generate", response_model=List[CoachingInsightOut])
def generate_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    POST /coaching/generate
    Analyzes the user's prompt history and generates 3 personalized insights.
    Requires at least 3 prompts in history.
    """
    return generate_coaching_insights(db, current_user.id)


@router.get("/insights", response_model=List[CoachingInsightOut])
def get_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    GET /coaching/insights
    Returns the user's existing coaching insights.
    """
    return get_user_insights(db, current_user.id)


@router.post("/feedback", response_model=FeedbackOut)
def submit_feedback(
    data: FeedbackRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    POST /coaching/feedback
    Body: { "prompt_id": "...", "was_helpful": true, "comment": "..." }
    Saves whether the AI suggestion was useful.
    """
    return save_feedback(db, current_user.id, data.prompt_id, data.was_helpful, data.comment)


@router.get("/stats", response_model=UserStatsOut)
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    GET /coaching/stats
    Returns the user's aggregate prompt stats.
    """
    stats = get_user_stats(db, current_user.id)

    if stats is None:
        return UserStatsOut(
            total_prompts=current_user.total_prompts,
            avg_score=current_user.avg_score,
            weakest_dimension=None,
            strongest_dimension=None,
            top_categories=[],
        )

    avgs = stats["avgs"]

    return UserStatsOut(
        total_prompts=current_user.total_prompts,
        avg_score=current_user.avg_score,
        weakest_dimension=stats["weakest"],
        strongest_dimension=stats["strongest"],
        top_categories=stats["categories"].split(", "),
    )