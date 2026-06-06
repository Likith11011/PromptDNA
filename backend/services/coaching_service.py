import json
import re
from sqlalchemy.orm import Session
from groq import Groq
from core.config import settings
from models.prompt import PromptLog
from models.coaching import CoachingInsight
from models.feedback import Feedback

client = Groq(api_key=settings.GROQ_API_KEY)
MODEL = "llama-3.3-70b-versatile"


def get_user_stats(db: Session, user_id: str) -> dict | None:
    recent_logs = (
        db.query(PromptLog)
        .filter(PromptLog.user_id == user_id)
        .order_by(PromptLog.created_at.desc())
        .limit(10)
        .all()
    )

    print(f"Coaching: found {len(recent_logs)} prompts for user {user_id}")

    if len(recent_logs) < 3:
        return None

    dim_totals = {
        "clarity": 0.0,
        "specificity": 0.0,
        "context": 0.0,
        "constraints": 0.0,
        "examples": 0.0,
    }
    count = 0

    for log in recent_logs:
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

    avgs = {k: round(v / count, 2) for k, v in dim_totals.items()}
    total_avg = round(sum(avgs.values()), 2)
    weakest = min(avgs, key=avgs.get)
    strongest = max(avgs, key=avgs.get)

    category_counts: dict[str, int] = {}
    for log in recent_logs:
        cat = log.category or "general"
        category_counts[cat] = category_counts.get(cat, 0) + 1

    top_categories = sorted(category_counts, key=category_counts.get, reverse=True)[:3]

    print(f"Coaching stats: avgs={avgs}, weakest={weakest}, strongest={strongest}")

    return {
        "count": count,
        "avgs": avgs,
        "total_avg": total_avg,
        "weakest": weakest,
        "strongest": strongest,
        "categories": ", ".join(top_categories),
    }


def generate_coaching_insights(db: Session, user_id: str) -> list[CoachingInsight]:
    stats = get_user_stats(db, user_id)

    if stats is None:
        return []

    avgs = stats["avgs"]

    system_prompt = """You are an expert AI prompt coach.
Return ONLY a valid JSON array. No markdown, no explanation, no code fences, nothing else."""

    user_message = f"""Analyze this user's prompting patterns and generate exactly 3 coaching insights.

User stats from last {stats['count']} prompts:
- Clarity avg: {avgs['clarity']}/20
- Specificity avg: {avgs['specificity']}/20
- Context avg: {avgs['context']}/20
- Constraints avg: {avgs['constraints']}/20
- Examples avg: {avgs['examples']}/20
- Overall avg: {stats['total_avg']}/100
- Top categories: {stats['categories']}
- Weakest dimension: {stats['weakest']} ({avgs[stats['weakest']]}/20)
- Strongest dimension: {stats['strongest']} ({avgs[stats['strongest']]}/20)

Return ONLY this JSON array with exactly 3 items:
[
  {{
    "insight_type": "snake_case_label",
    "target_dimension": "clarity or specificity or context or constraints or examples or general",
    "message": "2-3 sentence personalized coaching message referencing their actual scores and patterns"
  }},
  {{
    "insight_type": "snake_case_label",
    "target_dimension": "dimension",
    "message": "coaching message"
  }},
  {{
    "insight_type": "snake_case_label",
    "target_dimension": "dimension",
    "message": "coaching message"
  }}
]"""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0.4,
            max_tokens=1024,
        )

        raw_text = response.choices[0].message.content.strip()
        raw_text = re.sub(r"```json\s*", "", raw_text)
        raw_text = re.sub(r"```\s*", "", raw_text)
        raw_text = raw_text.strip()

        match = re.search(r'\[.*\]', raw_text, re.DOTALL)
        if match:
            raw_text = match.group(0)

        insights_data = json.loads(raw_text)
        print(f"Coaching: Groq returned {len(insights_data)} insights")

        db.query(CoachingInsight).filter(CoachingInsight.user_id == user_id).delete()

        saved = []
        for item in insights_data:
            insight = CoachingInsight(
                user_id=user_id,
                insight_type=item.get("insight_type", "general_tip"),
                target_dimension=item.get("target_dimension", "general"),
                message=item.get("message", ""),
            )
            db.add(insight)
            saved.append(insight)

        db.commit()
        for s in saved:
            db.refresh(s)

        return saved

    except Exception as e:
        print(f"Coaching Groq error: {type(e).__name__}: {e}")
        return _fallback_insights(db, user_id, stats)


def _fallback_insights(
    db: Session, user_id: str, stats: dict
) -> list[CoachingInsight]:
    avgs = stats["avgs"]
    weakest = stats["weakest"]
    strongest = stats["strongest"]
    total = stats["total_avg"]

    tip_map = {
        "examples": (
            "missing_examples", "examples",
            f"Your examples score averages {avgs['examples']}/20 — your weakest area. "
            f"Start including expected output format or a sample result in your prompts. "
            f"Even one line like 'Output should look like: ...' dramatically improves AI responses."
        ),
        "constraints": (
            "missing_constraints", "constraints",
            f"Your constraints score averages {avgs['constraints']}/20. "
            f"Add boundaries to your prompts: word count, language, format, tone, or what to avoid. "
            f"Constraints help the AI know exactly what you do and don't want."
        ),
        "context": (
            "insufficient_context", "context",
            f"Your context score averages {avgs['context']}/20. "
            f"Tell the AI who you are, what you're building, and why before asking your question. "
            f"Background context can double the quality of the response."
        ),
        "specificity": (
            "low_specificity", "specificity",
            f"Your specificity score averages {avgs['specificity']}/20. "
            f"Replace vague words with measurable details. "
            f"Instead of 'write a function', say 'write a Python function that does X with Y as input and returns Z'."
        ),
        "clarity": (
            "clarity_needs_work", "clarity",
            f"Your clarity score averages {avgs['clarity']}/20. "
            f"Read your prompt out loud before submitting — if it sounds ambiguous, the AI will struggle too. "
            f"One clear sentence beats three vague ones."
        ),
    }

    w_type, w_dim, w_msg = tip_map[weakest]

    insights_data = [
        {
            "insight_type": w_type,
            "target_dimension": w_dim,
            "message": w_msg,
        },
        {
            "insight_type": "overall_improvement",
            "target_dimension": "general",
            "message": (
                f"Your overall average is {total}/100 across {stats['count']} prompts. "
                f"Use the RCTCE framework: Role, Context, Task, Constraints, Examples. "
                f"Structuring every prompt with these five elements consistently pushes scores above 70."
            ),
        },
        {
            "insight_type": f"strong_{strongest}",
            "target_dimension": strongest,
            "message": (
                f"Your {strongest} scores average {avgs[strongest]}/20 — your strongest dimension. "
                f"Keep leading with clear {strongest} in your prompts. "
                f"Now focus on bringing your {weakest} score up to match — that's where your biggest gains are."
            ),
        },
    ]

    db.query(CoachingInsight).filter(CoachingInsight.user_id == user_id).delete()

    saved = []
    for item in insights_data:
        insight = CoachingInsight(
            user_id=user_id,
            insight_type=item["insight_type"],
            target_dimension=item["target_dimension"],
            message=item["message"],
        )
        db.add(insight)
        saved.append(insight)

    db.commit()
    for s in saved:
        db.refresh(s)

    print(f"Coaching: saved {len(saved)} rule-based fallback insights")
    return saved


def save_feedback(
    db: Session,
    user_id: str,
    prompt_id: str,
    was_helpful: bool,
    comment: str | None = None,
) -> Feedback:
    existing = (
        db.query(Feedback)
        .filter(Feedback.prompt_id == prompt_id, Feedback.user_id == user_id)
        .first()
    )

    if existing:
        existing.was_helpful = was_helpful
        existing.comment = comment
        db.commit()
        db.refresh(existing)
        return existing

    feedback = Feedback(
        prompt_id=prompt_id,
        user_id=user_id,
        was_helpful=was_helpful,
        comment=comment,
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback


def get_user_insights(db: Session, user_id: str) -> list[CoachingInsight]:
    return (
        db.query(CoachingInsight)
        .filter(CoachingInsight.user_id == user_id)
        .order_by(CoachingInsight.generated_at.desc())
        .all()
    )