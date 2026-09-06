from sqlalchemy.orm import Session
from groq import Groq
from core.config import settings
from models.prompt_comparison import PromptComparison
from services.ai_service import analyze_prompt_with_ai, _call_groq_chat

client = Groq(api_key=settings.GROQ_API_KEY)


def compare_prompts(db: Session, user_id: str, prompt_a: str, prompt_b: str) -> dict:
    """
    Analyzes both prompts independently then generates a comparison recommendation.
    """
    result_a = analyze_prompt_with_ai(prompt_a)
    result_b = analyze_prompt_with_ai(prompt_b)

    score_a = round(sum([
        result_a["clarity"], result_a["specificity"], result_a["context"],
        result_a["constraints"], result_a["examples"]
    ]), 1)
    score_b = round(sum([
        result_b["clarity"], result_b["specificity"], result_b["context"],
        result_b["constraints"], result_b["examples"]
    ]), 1)

    # Determine winner
    if score_a > score_b + 2:
        winner = "A"
    elif score_b > score_a + 2:
        winner = "B"
    else:
        winner = "tie"

    # Generate recommendation using Groq
    recommendation = _generate_recommendation(
        prompt_a, prompt_b, result_a, result_b, score_a, score_b, winner
    )

    # Save to DB
    comparison = PromptComparison(
        user_id=user_id,
        prompt_a=prompt_a,
        prompt_b=prompt_b,
        score_a=score_a,
        score_b=score_b,
        scores_a={k: result_a[k] for k in ["clarity", "specificity", "context", "constraints", "examples"]},
        scores_b={k: result_b[k] for k in ["clarity", "specificity", "context", "constraints", "examples"]},
        winner=winner,
        recommendation=recommendation,
    )
    db.add(comparison)
    db.commit()
    db.refresh(comparison)

    return {
        "id": comparison.id,
        "prompt_a": prompt_a,
        "prompt_b": prompt_b,
        "score_a": score_a,
        "score_b": score_b,
        "scores_a": comparison.scores_a,
        "scores_b": comparison.scores_b,
        "winner": winner,
        "recommendation": recommendation,
        "category_a": result_a.get("category", "general"),
        "category_b": result_b.get("category", "general"),
    }


def _generate_recommendation(
    prompt_a, prompt_b, result_a, result_b, score_a, score_b, winner
) -> str:
    user_prompt = f"""Compare these two prompts and give a 2-3 sentence recommendation.

Prompt A ({score_a}/100): "{prompt_a}"
Scores A: clarity={result_a['clarity']}, specificity={result_a['specificity']}, context={result_a['context']}, constraints={result_a['constraints']}, examples={result_a['examples']}

Prompt B ({score_b}/100): "{prompt_b}"
Scores B: clarity={result_b['clarity']}, specificity={result_b['specificity']}, context={result_b['context']}, constraints={result_b['constraints']}, examples={result_b['examples']}

Winner: Prompt {winner}

Give a specific, actionable comparison explaining WHY one is better. Be concrete about which dimensions make the difference. Return only the recommendation text, no labels."""

    try:
        content = _call_groq_chat(
            messages=[{"role": "user", "content": user_prompt}],
            temperature=0.3,
            max_tokens=300,
        )
        return content.strip()
    except Exception as e:
        print(f"Recommendation error: {e}")
        if winner == "tie":
            return "Both prompts exhibit similar structural balance. Consider synthesizing the specific constraints of one with the contextual framing of the other."
        better = "A" if winner == "A" else "B"
        worse = "B" if winner == "A" else "A"
        return f"Prompt {better} scores higher ({score_a if better == 'A' else score_b}/100 vs {score_b if better == 'A' else score_a}/100) due to superior specificity, context, and format boundaries. Prompt {worse} should be augmented with explicit output schemas and constraints."