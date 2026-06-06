from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from core.security import get_current_user
from models.user import User
from schemas.prompt import (
    PromptAnalyzeRequest,
    PromptAnalyzeResponse,
    PromptHistoryItem,
    AnalyticsResponse,
)
from services.prompt_service import analyze_and_save, get_user_history, get_analytics_data

router = APIRouter(prefix="/prompts", tags=["Prompts"])


@router.post("/analyze", response_model=PromptAnalyzeResponse)
def analyze_prompt(
    data: PromptAnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = analyze_and_save(db, current_user.id, data.prompt)
    return result


@router.get("/history", response_model=List[PromptHistoryItem])
def prompt_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_user_history(db, current_user.id)


@router.get("/analytics", response_model=AnalyticsResponse)
def analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    GET /prompts/analytics
    Returns score trend, category breakdown, dimension averages, and streak.
    """
    return get_analytics_data(db, current_user.id)