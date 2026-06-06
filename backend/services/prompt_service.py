from sqlalchemy.orm import Session

from models.prompt import PromptLog, PromptScores
from models.user import User
from services.ai_service import analyze_prompt_with_ai


def analyze_and_save(db: Session, user_id: str, prompt_text: str) -> PromptLog:
    ai_result = analyze_prompt_with_ai(prompt_text)

    scores = {
        "clarity": ai_result["clarity"],
        "specificity": ai_result["specificity"],
        "context": ai_result["context"],
        "constraints": ai_result["constraints"],
        "examples": ai_result["examples"],
    }
    total = round(sum(scores.values()), 2)
    improved = ai_result.get("improved_prompt", prompt_text)
    category = ai_result.get("category", "general")

    prompt_log = PromptLog(
        user_id=user_id,
        original_prompt=prompt_text,
        improved_prompt=improved,
        category=category,
        total_score=total,
        coaching_tip=ai_result.get("coaching_tip"),
        success_probability=ai_result.get("success_probability", 50),
        success_reason=ai_result.get("success_reason", ""),
    )
    db.add(prompt_log)
    db.flush()

    prompt_scores = PromptScores(prompt_id=prompt_log.id, **scores)
    db.add(prompt_scores)

    user = db.query(User).filter(User.id == user_id).first()
    user.total_prompts += 1
    user.avg_score = round(
        ((user.avg_score * (user.total_prompts - 1)) + total) / user.total_prompts, 2
    )

    db.commit()
    db.refresh(prompt_log)
    return prompt_log


def get_user_history(db: Session, user_id: str, limit: int = 20) -> list:
    return (
        db.query(PromptLog)
        .filter(PromptLog.user_id == user_id)
        .order_by(PromptLog.created_at.desc())
        .limit(limit)
        .all()
    )


def get_analytics_data(db: Session, user_id: str) -> dict:
    """
    Returns structured data for all frontend charts.
    """
    logs = (
        db.query(PromptLog)
        .filter(PromptLog.user_id == user_id)
        .order_by(PromptLog.created_at.asc())
        .limit(30)
        .all()
    )

    if not logs:
        return {
            "score_trend": [],
            "category_breakdown": [],
            "dimension_averages": {},
            "streak": 0,
        }

    # Score trend — one point per prompt
    score_trend = [
        {
            "index": i + 1,
            "score": round(log.total_score, 1),
            "date": log.created_at.strftime("%b %d"),
        }
        for i, log in enumerate(logs)
    ]

    # Category breakdown
    category_counts: dict[str, int] = {}
    for log in logs:
        cat = log.category or "general"
        category_counts[cat] = category_counts.get(cat, 0) + 1

    category_breakdown = [
        {"name": cat, "count": count}
        for cat, count in sorted(category_counts.items(), key=lambda x: x[1], reverse=True)
    ]

    # Dimension averages from scores
    dim_totals = {"clarity": 0.0, "specificity": 0.0, "context": 0.0, "constraints": 0.0, "examples": 0.0}
    count = 0
    for log in logs:
        if log.scores:
            dim_totals["clarity"] += log.scores.clarity
            dim_totals["specificity"] += log.scores.specificity
            dim_totals["context"] += log.scores.context
            dim_totals["constraints"] += log.scores.constraints
            dim_totals["examples"] += log.scores.examples
            count += 1

    dimension_averages = {
        k: round(v / count, 1) if count > 0 else 0.0
        for k, v in dim_totals.items()
    }

    # Streak — consecutive days with at least one prompt
    from datetime import datetime, timedelta
    dates = sorted(set(log.created_at.date() for log in logs), reverse=True)
    streak = 0
    today = datetime.utcnow().date()
    for i, d in enumerate(dates):
        if d == today - timedelta(days=i):
            streak += 1
        else:
            break

    return {
        "score_trend": score_trend,
        "category_breakdown": category_breakdown,
        "dimension_averages": dimension_averages,
        "streak": streak,
    }