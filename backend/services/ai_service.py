import json
import re
from groq import Groq
from core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)
PRIMARY_MODELS = [
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3.8-27b",
]


def _call_groq_chat(messages: list, temperature: float = 0.3, max_tokens: int = 2048):
    for model in PRIMARY_MODELS:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"Groq model {model} failed: {e}")
            continue
    raise RuntimeError("All Groq model candidates failed.")


def analyze_prompt_with_ai(prompt_text: str) -> dict:
    system_prompt = """You are an expert AI prompt quality analyst.
Your job is to evaluate prompts and return structured JSON analysis.
You must ALWAYS return valid JSON only — absolutely no markdown, no explanation, no code fences, no extra text before or after the JSON."""

    user_message = f"""Analyze this prompt and return ONLY a JSON object.

PROMPT TO ANALYZE: "{prompt_text}"

STRICT scoring rules:
- Evaluate each dimension INDEPENDENTLY based on what is actually present in the prompt
- A vague one-liner like "write code" or "build an app" MUST score 2-5 on most dimensions
- A detailed prompt with role, task, context, constraints, examples MUST score 14-20
- NEVER give all dimensions the same score
- Scores must reflect actual quality differences

Dimensions (each 0-20):
- clarity: Is the request unambiguous and easy to understand?
- specificity: Are there specific requirements, not generic/vague ones?
- context: Is background, purpose, or domain context provided?
- constraints: Are format, length, language, or other limits defined?
- examples: Are sample inputs, outputs, or format examples included?

Additional fields:
- category: pick one only: coding, writing, research, business, study, creative, general
- improved_prompt: COMPLETELY rewrite the prompt. It must be at least 3x longer. Include: a role for the AI, specific task details, relevant context, clear constraints, and expected output format. Do NOT just repeat the original. Make it genuinely better.
- coaching_tip: one specific actionable tip for THIS prompt's biggest weakness
- success_probability: integer 0-100 for likelihood of great AI response
- success_reason: one sentence explaining the probability score

Return ONLY this JSON object, nothing else:
{{
  "clarity": 0.0,
  "specificity": 0.0,
  "context": 0.0,
  "constraints": 0.0,
  "examples": 0.0,
  "category": "general",
  "improved_prompt": "",
  "coaching_tip": "",
  "success_probability": 0,
  "success_reason": ""
}}"""

    raw_text = ""
    try:
        raw_text = _call_groq_chat(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0.3,
            max_tokens=2048,
        )

        # Strip any markdown fences
        clean_text = re.sub(r"```json\s*", "", raw_text)
        clean_text = re.sub(r"```\s*", "", clean_text)
        clean_text = clean_text.strip()

        # Extract the JSON object
        match = re.search(r'\{.*\}', clean_text, re.DOTALL)
        if match:
            clean_text = match.group(0)

        result = json.loads(clean_text)

        # Clamp scores to valid range
        for key in ["clarity", "specificity", "context", "constraints", "examples"]:
            result[key] = max(0.0, min(20.0, round(float(result.get(key, 5.0)), 1)))

        valid_categories = [
            "coding", "writing", "research", "business",
            "study", "creative", "general"
        ]
        if result.get("category") not in valid_categories:
            result["category"] = _detect_category(prompt_text)

        result["success_probability"] = max(0, min(100, int(result.get("success_probability", 30))))
        result["success_reason"] = result.get("success_reason", "")

        # Ensure improved_prompt is genuinely different and better
        improved = result.get("improved_prompt", "").strip()
        if (
            not improved
            or improved.lower().strip() == prompt_text.lower().strip()
            or len(improved) < len(prompt_text) * 1.5
        ):
            improved = _build_improved(prompt_text, result)
        result["improved_prompt"] = improved

        total = sum([
            result["clarity"], result["specificity"], result["context"],
            result["constraints"], result["examples"]
        ])
        print(
            f"Groq OK - total={total:.1f}, category={result['category']}, "
            f"success={result['success_probability']}%"
        )
        return result

    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e} | raw: {raw_text[:300]}")
        return _fallback(prompt_text)
    except Exception as e:
        print(f"Groq error: {type(e).__name__}: {e}")
        return _fallback(prompt_text)


def _detect_category(text: str) -> str:
    lower = text.lower()
    if any(k in lower for k in ["python", "javascript", "typescript", "react", "sql", "api", "code", "function", "bug", "html", "css", "docker", "endpoint", "database"]):
        return "coding"
    if any(k in lower for k in ["essay", "blog", "copy", "email", "article", "draft", "story", "write", "summary", "paragraph"]):
        return "writing"
    if any(k in lower for k in ["research", "paper", "study", "analysis", "compare", "literature", "quantum", "theory", "mechanism"]):
        return "research"
    if any(k in lower for k in ["business", "marketing", "investor", "pitch", "sales", "roi", "strategy", "roadmap", "revenue", "startup"]):
        return "business"
    if any(k in lower for k in ["learn", "teach", "homework", "exam", "quiz", "lesson", "student"]):
        return "study"
    if any(k in lower for k in ["poem", "song", "lyrics", "novel", "fiction", "character", "creative"]):
        return "creative"
    return "general"


def _build_improved(prompt_text: str, result: dict = None) -> str:
    category = result.get("category", "general") if result else _detect_category(prompt_text)

    category_role = {
        "coding": "You are a Principal Staff Software Architect with expertise in high-throughput, clean architecture.",
        "writing": "You are a Senior Technical Writer and Copy Editor with expertise in high-impact prose.",
        "research": "You are a Principal Research Scientist with expertise in synthesizing complex literature.",
        "business": "You are a Senior Strategic Management Consultant with deep experience in executive briefings.",
        "study": "You are an expert Pedagogical Tutor skilled at Socratic explanations and first-principles breakdowns.",
        "creative": "You are an award-winning Creative Director with a talent for vivid narrative structure.",
        "general": "You are an expert AI advisor with deep domain knowledge.",
    }

    role = category_role.get(category, category_role["general"])

    return (
        f"{role}\n\n"
        f"Task: {prompt_text.rstrip('.')}\n\n"
        f"Execution Requirements:\n"
        f"1. Provide an exhaustive, step-by-step resolution addressing all edge cases\n"
        f"2. Include concrete production-ready code or real-world practical examples\n"
        f"3. Explicitly state assumptions, failure modes, and performance trade-offs\n"
        f"4. Structure output with clean Markdown headings, bullet points, and concise takeaways"
    )


def _fallback(prompt_text: str) -> dict:
    """
    Intelligent heuristic fallback: Evaluates prompt features dynamically
    so different prompts receive distinct, representative scores even if offline.
    """
    words = prompt_text.strip().split()
    word_count = len(words)
    lower = prompt_text.lower()
    category = _detect_category(prompt_text)

    # Clarity evaluation (1-20)
    has_question_or_action = any(lower.startswith(w) for w in ["write", "create", "build", "explain", "how", "what", "analyze", "design", "refactor", "generate"])
    clarity = min(19.0, 8.0 + (3.0 if has_question_or_action else 0.0) + min(6.0, word_count * 0.3))

    # Specificity evaluation (1-20)
    tech_keywords = ["typescript", "python", "fastapi", "react", "postgresql", "docker", "jwt", "o(n)", "json", "markdown", "step-by-step", "metric", "framework", "version", "schema"]
    spec_matches = sum(1 for kw in tech_keywords if kw in lower)
    specificity = min(19.0, 4.0 + min(12.0, spec_matches * 3.5) + (3.0 if word_count > 25 else 1.0))

    # Context evaluation (1-20)
    context_keywords = ["act as", "you are", "role", "background", "context", "for a", "building a", "scenario", "situation", "company", "team"]
    has_context = any(kw in lower for kw in context_keywords)
    context = min(18.0, 3.0 + (8.0 if has_context else 0.0) + min(6.0, word_count * 0.2))

    # Constraints evaluation (1-20)
    constraint_keywords = ["must", "limit", "format", "do not", "only", "table", "schema", "in 200 words", "concise", "strict", "bullet", "headers"]
    has_constraints = any(kw in lower for kw in constraint_keywords)
    constraints = min(18.0, 3.0 + (8.0 if has_constraints else 0.0) + (3.0 if ":" in prompt_text or "\n" in prompt_text else 0.0))

    # Examples evaluation (1-20)
    has_examples = any(kw in lower for kw in ["example", "sample", "e.g.", "input:", "output:", "like this"])
    examples = min(18.0, 2.0 + (10.0 if has_examples else 0.0) + (4.0 if "```" in prompt_text or "{" in prompt_text else 0.0))

    total = clarity + specificity + context + constraints + examples
    success_prob = min(98, max(20, int(total * 0.95)))

    return {
        "clarity": round(clarity, 1),
        "specificity": round(specificity, 1),
        "context": round(context, 1),
        "constraints": round(constraints, 1),
        "examples": round(examples, 1),
        "category": category,
        "improved_prompt": _build_improved(prompt_text, {"category": category}),
        "coaching_tip": (
            "Anchor your prompt with explicit output constraints (e.g. Markdown schema, length limits) "
            "and specify a domain role to increase reasoning fidelity."
        ),
        "success_probability": success_prob,
        "success_reason": f"Prompt has {category} task definition with baseline clarity and estimated success probability of {success_prob}%."
    }