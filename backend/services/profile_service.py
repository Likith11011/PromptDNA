from sqlalchemy.orm import Session
from models.prompt import PromptLog
from datetime import datetime, timedelta, timezone


PERSONALITY_TYPES = {
    "Architect": {
        "description": "You plan and structure prompts methodically with clear constraints and output formats.",
        "icon": "🏗️",
        "traits": ["high constraints", "high specificity", "structured thinking"],
    },
    "Researcher": {
        "description": "You provide rich context and background. Your prompts are thorough and well-informed.",
        "icon": "🔬",
        "traits": ["high context", "high clarity", "detail-oriented"],
    },
    "Builder": {
        "description": "You focus on coding and technical tasks. Your prompts are goal-oriented and practical.",
        "icon": "⚙️",
        "traits": ["coding category", "high specificity", "practical"],
    },
    "Creator": {
        "description": "You excel at creative and writing prompts with expressive, open-ended thinking.",
        "icon": "🎨",
        "traits": ["creative category", "high clarity", "expressive"],
    },
    "Explorer": {
        "description": "You experiment broadly across many categories. Curious and wide-ranging.",
        "icon": "🧭",
        "traits": ["diverse categories", "general", "experimental"],
    },
}


def compute_dna_profile(db: Session, user_id: str) -> dict:
    logs = (
        db.query(PromptLog)
        .filter(PromptLog.user_id == user_id)
        .order_by(PromptLog.created_at.desc())
        .limit(20)
        .all()
    )

    if not logs:
        return _empty_profile()

    dim_totals = {
        "clarity": 0.0, "specificity": 0.0,
        "context": 0.0, "constraints": 0.0, "examples": 0.0,
    }
    count = 0
    category_counts: dict[str, int] = {}

    for log in logs:
        if log.scores:
            dim_totals["clarity"] += log.scores.clarity
            dim_totals["specificity"] += log.scores.specificity
            dim_totals["context"] += log.scores.context
            dim_totals["constraints"] += log.scores.constraints
            dim_totals["examples"] += log.scores.examples
        else:
            per = log.total_score / 5
            for k in dim_totals:
                dim_totals[k] += per
        count += 1
        cat = log.category or "general"
        category_counts[cat] = category_counts.get(cat, 0) + 1

    avgs = {k: round(v / count, 2) for k, v in dim_totals.items()}
    strengths = [k for k, v in avgs.items() if v >= 12.0]
    weaknesses = [k for k, v in avgs.items() if v < 8.0]

    mid = count // 2
    recent = logs[:mid] if mid > 0 else logs
    older = logs[mid:] if mid > 0 else logs

    recent_avg = sum(l.total_score for l in recent) / len(recent) if recent else 0
    older_avg = sum(l.total_score for l in older) / len(older) if older else 0
    trend_pct = round(
        ((recent_avg - older_avg) / older_avg * 100) if older_avg > 0 else 0, 1
    )

    top_cats = sorted(category_counts, key=category_counts.get, reverse=True)[:3]
    personality = _classify_personality(avgs, category_counts, count)
    heatmap = {k: round(20 - v, 2) for k, v in avgs.items()}
    weekly = _compute_weekly_trend(db, user_id)

    return {
        "total_prompts": count,
        "avg_score": round(sum(l.total_score for l in logs) / count, 1),
        "dimension_avgs": avgs,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "trend_pct": trend_pct,
        "top_categories": top_cats,
        "personality": personality,
        "heatmap": heatmap,
        "weekly_trend": weekly,
    }


def _classify_personality(avgs: dict, category_counts: dict, total: int) -> dict:
    top_cat = max(category_counts, key=category_counts.get) if category_counts else "general"

    if avgs.get("constraints", 0) >= 12 and avgs.get("specificity", 0) >= 12:
        ptype = "Architect"
    elif avgs.get("context", 0) >= 12 and avgs.get("clarity", 0) >= 12:
        ptype = "Researcher"
    elif top_cat == "coding" and avgs.get("specificity", 0) >= 10:
        ptype = "Builder"
    elif top_cat in ["creative", "writing"] and avgs.get("clarity", 0) >= 10:
        ptype = "Creator"
    else:
        ptype = "Explorer"

    return {
        "type": ptype,
        **PERSONALITY_TYPES[ptype],
    }


def _compute_weekly_trend(db: Session, user_id: str) -> list[dict]:
    """
    Returns avg score per week for last 4 weeks.
    Uses UTC+5:30 (IST) aware boundaries so Indian users
    get correct weekly bucketing regardless of server timezone.

    Week 1 = oldest, Week 4 = current week (this week in IST).
    Array order is oldest → newest so chart renders left to right.
    """
    # IST offset
    IST = timezone(timedelta(hours=5, minutes=30))

    # Current time in IST
    now_ist = datetime.now(IST)

    # Find the start of the current week in IST (Monday 00:00 IST)
    days_since_monday = now_ist.weekday()  # 0=Monday, 6=Sunday
    this_week_start_ist = now_ist.replace(
        hour=0, minute=0, second=0, microsecond=0
    ) - timedelta(days=days_since_monday)

    print(f"Weekly trend: now_ist={now_ist}, week_start={this_week_start_ist}")

    weeks = []

    # Build 4 weeks: week_offset=3 is oldest, week_offset=0 is current
    for week_offset in range(3, -1, -1):
        # Calculate this week's boundaries in IST
        w_start_ist = this_week_start_ist - timedelta(weeks=week_offset)
        w_end_ist = w_start_ist + timedelta(weeks=1)

        # Convert to UTC for DB query (DB stores in UTC)
        w_start_utc = w_start_ist.astimezone(timezone.utc)
        w_end_utc = w_end_ist.astimezone(timezone.utc)

        print(f"Week {4 - week_offset}: {w_start_ist.date()} to {w_end_ist.date()} IST")

        # Query prompts in this window
        logs = (
            db.query(PromptLog)
            .filter(
                PromptLog.user_id == user_id,
                PromptLog.created_at >= w_start_utc.replace(tzinfo=None),
                PromptLog.created_at < w_end_utc.replace(tzinfo=None),
            )
            .all()
        )

        avg = (
            round(sum(l.total_score for l in logs) / len(logs), 1)
            if logs else 0
        )
        week_number = 4 - week_offset  # 3→1, 2→2, 1→3, 0→4

        # Date range label for tooltip
        date_label = f"{w_start_ist.strftime('%b %d')} – {(w_end_ist - timedelta(days=1)).strftime('%b %d')}"

        weeks.append({
            "week": f"Week {week_number}",
            "date_range": date_label,
            "avg_score": avg,
            "count": len(logs),
            "has_data": len(logs) > 0,
        })

        print(f"  → {len(logs)} prompts, avg={avg}")

    return weeks


def _empty_profile() -> dict:
    return {
        "total_prompts": 0,
        "avg_score": 0,
        "dimension_avgs": {
            "clarity": 0, "specificity": 0,
            "context": 0, "constraints": 0, "examples": 0,
        },
        "strengths": [],
        "weaknesses": [],
        "trend_pct": 0,
        "top_categories": [],
        "personality": {
            "type": "Explorer",
            **PERSONALITY_TYPES["Explorer"],
        },
        "heatmap": {
            "clarity": 20, "specificity": 20,
            "context": 20, "constraints": 20, "examples": 20,
        },
        "weekly_trend": [
            {
                "week": f"Week {i}",
                "date_range": "",
                "avg_score": 0,
                "count": 0,
                "has_data": False,
            }
            for i in range(1, 5)
        ],
    }