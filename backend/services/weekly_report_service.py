from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from models.prompt import PromptLog
from models.weekly_report import WeeklyReport


def generate_weekly_report(db: Session, user_id: str) -> dict:
    now = datetime.utcnow()
    week_start = now - timedelta(days=7)

    # This week's prompts
    this_week = (
        db.query(PromptLog)
        .filter(PromptLog.user_id == user_id, PromptLog.created_at >= week_start)
        .all()
    )

    # Last week's prompts for comparison
    last_week_start = week_start - timedelta(days=7)
    last_week = (
        db.query(PromptLog)
        .filter(
            PromptLog.user_id == user_id,
            PromptLog.created_at >= last_week_start,
            PromptLog.created_at < week_start,
        )
        .all()
    )

    if not this_week:
        return {
            "total_prompts": 0,
            "avg_score": 0,
            "best_category": None,
            "worst_category": None,
            "improvement_pct": 0,
            "top_mistakes": [],
            "coaching_suggestions": [],
            "dimension_avgs": {},
            "week_start": week_start.isoformat(),
            "week_end": now.isoformat(),
        }

    total = len(this_week)
    avg_score = round(sum(l.total_score for l in this_week) / total, 1)

    # Category breakdown
    cat_scores: dict[str, list] = {}
    for log in this_week:
        cat = log.category or "general"
        cat_scores.setdefault(cat, []).append(log.total_score)

    cat_avgs = {cat: sum(scores) / len(scores) for cat, scores in cat_scores.items()}
    best_cat = max(cat_avgs, key=cat_avgs.get) if cat_avgs else None
    worst_cat = min(cat_avgs, key=cat_avgs.get) if cat_avgs else None

    # Improvement vs last week
    last_avg = sum(l.total_score for l in last_week) / len(last_week) if last_week else 0
    improvement_pct = round(((avg_score - last_avg) / last_avg * 100) if last_avg > 0 else 0, 1)

    # Dimension averages
    dim_totals = {"clarity": 0.0, "specificity": 0.0, "context": 0.0, "constraints": 0.0, "examples": 0.0}
    scored_count = 0
    for log in this_week:
        if log.scores:
            dim_totals["clarity"] += log.scores.clarity
            dim_totals["specificity"] += log.scores.specificity
            dim_totals["context"] += log.scores.context
            dim_totals["constraints"] += log.scores.constraints
            dim_totals["examples"] += log.scores.examples
            scored_count += 1

    dim_avgs = {k: round(v / scored_count, 1) for k, v in dim_totals.items()} if scored_count > 0 else {}

    # Top mistakes — dimensions below 8
    top_mistakes = [k for k, v in dim_avgs.items() if v < 8.0]

    # Coaching suggestions
    suggestions = []
    if dim_avgs.get("examples", 20) < 8:
        suggestions.append("Add examples or expected output format to your prompts.")
    if dim_avgs.get("constraints", 20) < 8:
        suggestions.append("Define constraints like word count, format, or tone.")
    if dim_avgs.get("context", 20) < 8:
        suggestions.append("Include background context before asking your question.")
    if not suggestions:
        suggestions.append("Great week! Keep maintaining high specificity and context.")

    # Save report
    report = WeeklyReport(
        user_id=user_id,
        week_start=week_start,
        week_end=now,
        total_prompts=total,
        avg_score=avg_score,
        best_category=best_cat,
        worst_category=worst_cat,
        improvement_pct=improvement_pct,
        top_mistakes=top_mistakes,
        coaching_suggestions=suggestions,
        dimension_avgs=dim_avgs,
    )
    db.add(report)
    db.commit()

    return {
        "total_prompts": total,
        "avg_score": avg_score,
        "best_category": best_cat,
        "worst_category": worst_cat,
        "improvement_pct": improvement_pct,
        "top_mistakes": top_mistakes,
        "coaching_suggestions": suggestions,
        "dimension_avgs": dim_avgs,
        "week_start": week_start.isoformat(),
        "week_end": now.isoformat(),
    }