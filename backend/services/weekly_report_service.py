from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from models.prompt import PromptLog
from models.weekly_report import WeeklyReport


def generate_weekly_report(db: Session, user_id: str) -> dict:
    """
    Generates this week's report using IST-aware week boundaries.
    Week = Monday 00:00 IST to Sunday 23:59 IST.
    """
    IST = timezone(timedelta(hours=5, minutes=30))
    now_ist = datetime.now(IST)

    # Find start of current week (Monday 00:00 IST)
    days_since_monday = now_ist.weekday()  # 0=Monday
    week_start_ist = now_ist.replace(
        hour=0, minute=0, second=0, microsecond=0
    ) - timedelta(days=days_since_monday)
    week_end_ist = week_start_ist + timedelta(weeks=1)

    # Convert to UTC for DB queries (DB stores UTC)
    week_start_utc = week_start_ist.astimezone(timezone.utc).replace(tzinfo=None)
    week_end_utc = week_end_ist.astimezone(timezone.utc).replace(tzinfo=None)

    print(f"Weekly report: {week_start_ist.date()} to {week_end_ist.date()} IST")
    print(f"UTC range: {week_start_utc} to {week_end_utc}")

    # This week's prompts
    this_week = (
        db.query(PromptLog)
        .filter(
            PromptLog.user_id == user_id,
            PromptLog.created_at >= week_start_utc,
            PromptLog.created_at < week_end_utc,
        )
        .all()
    )

    print(f"Weekly report: found {len(this_week)} prompts this week")

    # Last week's prompts for comparison
    last_week_start_utc = (
        week_start_ist - timedelta(weeks=1)
    ).astimezone(timezone.utc).replace(tzinfo=None)

    last_week = (
        db.query(PromptLog)
        .filter(
            PromptLog.user_id == user_id,
            PromptLog.created_at >= last_week_start_utc,
            PromptLog.created_at < week_start_utc,
        )
        .all()
    )

    print(f"Weekly report: found {len(last_week)} prompts last week")

    if not this_week:
        return {
            "total_prompts": 0,
            "avg_score": 0.0,
            "best_category": None,
            "worst_category": None,
            "improvement_pct": 0.0,
            "top_mistakes": [],
            "coaching_suggestions": ["Start analyzing prompts this week to get your report!"],
            "dimension_avgs": {},
            "week_start": week_start_ist.strftime("%d/%m/%Y"),
            "week_end": now_ist.strftime("%d/%m/%Y"),
        }

    total = len(this_week)

    # Avg score — ONLY from this week's prompts
    avg_score = round(sum(l.total_score for l in this_week) / total, 1)

    # Category breakdown
    cat_scores: dict[str, list] = {}
    for log in this_week:
        cat = log.category or "general"
        cat_scores.setdefault(cat, []).append(log.total_score)

    cat_avgs = {
        cat: round(sum(scores) / len(scores), 1)
        for cat, scores in cat_scores.items()
    }
    best_cat = max(cat_avgs, key=cat_avgs.get) if cat_avgs else None
    worst_cat = min(cat_avgs, key=cat_avgs.get) if len(cat_avgs) > 1 else None

    # Improvement vs last week
    last_avg = (
        round(sum(l.total_score for l in last_week) / len(last_week), 1)
        if last_week else 0
    )
    improvement_pct = round(
        ((avg_score - last_avg) / last_avg * 100) if last_avg > 0 else 0.0, 1
    )

    # Dimension averages — from this week's scored prompts only
    dim_totals = {
        "clarity": 0.0,
        "specificity": 0.0,
        "context": 0.0,
        "constraints": 0.0,
        "examples": 0.0,
    }
    scored_count = 0

    for log in this_week:
        if log.scores:
            dim_totals["clarity"] += log.scores.clarity
            dim_totals["specificity"] += log.scores.specificity
            dim_totals["context"] += log.scores.context
            dim_totals["constraints"] += log.scores.constraints
            dim_totals["examples"] += log.scores.examples
            scored_count += 1
        else:
            # Distribute total_score evenly across dimensions as fallback
            per = log.total_score / 5
            for k in dim_totals:
                dim_totals[k] += per
            scored_count += 1

    dim_avgs = (
        {k: round(v / scored_count, 1) for k, v in dim_totals.items()}
        if scored_count > 0
        else {}
    )

    print(f"Weekly report dim_avgs: {dim_avgs}")

    # Top mistakes — dimensions scoring below 8/20
    top_mistakes = [k for k, v in dim_avgs.items() if v < 8.0]

    # Coaching suggestions — specific and actionable
    suggestions = []
    if dim_avgs.get("examples", 20) < 8:
        suggestions.append(
            "Add examples or expected output format to your prompts — "
            "this is your weakest area this week."
        )
    if dim_avgs.get("constraints", 20) < 8:
        suggestions.append(
            "Define constraints like word count, format, or tone in your prompts."
        )
    if dim_avgs.get("context", 20) < 8:
        suggestions.append(
            "Include background context before asking your question."
        )
    if dim_avgs.get("specificity", 20) < 8:
        suggestions.append(
            "Be more specific — replace vague words with measurable details."
        )
    if dim_avgs.get("clarity", 20) < 8:
        suggestions.append(
            "Improve clarity — read your prompt out loud before submitting."
        )
    if not suggestions:
        suggestions.append(
            f"Great week! You analyzed {total} prompts with an average of "
            f"{avg_score}/100. Keep maintaining high quality."
        )

    # Save report to DB
    try:
        report = WeeklyReport(
            user_id=user_id,
            week_start=week_start_utc,
            week_end=week_end_utc,
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
    except Exception as e:
        print(f"Weekly report save error: {e}")
        db.rollback()

    return {
        "total_prompts": total,
        "avg_score": avg_score,
        "best_category": best_cat,
        "worst_category": worst_cat,
        "improvement_pct": improvement_pct,
        "top_mistakes": top_mistakes,
        "coaching_suggestions": suggestions,
        "dimension_avgs": dim_avgs,
        "week_start": week_start_ist.strftime("%d/%m/%Y"),
        "week_end": now_ist.strftime("%d/%m/%Y"),
    }