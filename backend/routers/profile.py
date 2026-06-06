from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from core.security import get_current_user
from models.user import User
from schemas.profile import DNAProfileOut, ComparisonRequest, ComparisonOut, WeeklyReportOut
from services.profile_service import compute_dna_profile
from services.comparison_service import compare_prompts
from services.weekly_report_service import generate_weekly_report

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/dna", response_model=DNAProfileOut)
def get_dna_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    GET /profile/dna
    Returns the user's full PromptDNA profile including personality,
    strengths, weaknesses, heatmap, and weekly trend.
    """
    return compute_dna_profile(db, current_user.id)


@router.post("/compare", response_model=ComparisonOut)
def compare(
    data: ComparisonRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    POST /profile/compare
    Body: { "prompt_a": "...", "prompt_b": "..." }
    Returns side-by-side comparison with winner and recommendation.
    """
    return compare_prompts(db, current_user.id, data.prompt_a, data.prompt_b)


@router.get("/weekly-report", response_model=WeeklyReportOut)
def weekly_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    GET /profile/weekly-report
    Returns this week's performance report vs last week.
    """
    return generate_weekly_report(db, current_user.id)