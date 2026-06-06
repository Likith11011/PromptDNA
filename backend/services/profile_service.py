from sqlalchemy.orm import Session
from models.prompt import PromptLog, PromptScores
from models.user import User
from datetime import datetime, timedelta


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
    """
    Computes the user's full PromptDNA profile from their history.
    Returns strengths, weaknesses, metrics, improvement trend, and personality type.
    """
    logs = (
        db.query(PromptLog)
        .filter(PromptLog.user_id == user_id)
        .order_by(PromptLog.created_at.desc())
        .limit(20)
        .all()
    )

    if not logs:
        return _empty_profile()

    # Aggregate dimension averages
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

    # Strengths = dimensions scoring above 12/20
    strengths = [k for k, v in avgs.items() if v >= 12.0]
    # Weaknesses = dimensions scoring below 8/20
    weaknesses = [k for k, v in avgs.items() if v < 8.0]

    # Improvement trend — compare first half vs second half of history
    mid = count // 2
    recent = logs[:mid] if mid > 0 else logs
    older = logs[mid:] if mid > 0 else logs

    recent_avg = sum(l.total_score for l in recent) / len(recent) if recent else 0
    older_avg = sum(l.total_score for l in older) / len(older) if older else 0
    trend_pct = round(((recent_avg - older_avg) / older_avg * 100) if older_avg > 0 else 0, 1)

    # Top categories
    top_cats = sorted(category_counts, key=category_counts.get, reverse=True)[:3]

    # Personality type
    personality = _classify_personality(avgs, category_counts, count)

    # Heatmap data — weakness severity (inverted score, higher = weaker)
    heatmap = {k: round(20 - v, 2) for k, v in avgs.items()}

    # Habit tracker — weekly averages for last 4 weeks
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
    """Rule-based personality classification."""
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
    """Returns avg score per week for last 4 weeks."""
    now = datetime.utcnow()
    weeks = []

    for i in range(3, -1, -1):
        week_start = now - timedelta(weeks=i + 1)
        week_end = now - timedelta(weeks=i)

        logs = (
            db.query(PromptLog)
            .filter(
                PromptLog.user_id == user_id,
                PromptLog.created_at >= week_start,
                PromptLog.created_at < week_end,
            )
            .all()
        )

        avg = round(sum(l.total_score for l in logs) / len(logs), 1) if logs else 0
        weeks.append({
            "week": f"Week {4 - i}",
            "avg_score": avg,
            "count": len(logs),
        })

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
        "weekly_trend": [],
    }