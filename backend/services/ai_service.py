import json
import re
from groq import Groq
from core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY)
MODEL = "llama-3.3-70b-versatile"


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

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0.3,
            max_tokens=2048,
        )

        raw_text = response.choices[0].message.content.strip()

        # Strip any markdown fences
        raw_text = re.sub(r"```json\s*", "", raw_text)
        raw_text = re.sub(r"```\s*", "", raw_text)
        raw_text = raw_text.strip()

        # Extract the JSON object
        match = re.search(r'\{.*\}', raw_text, re.DOTALL)
        if match:
            raw_text = match.group(0)

        result = json.loads(raw_text)

        # Clamp scores to valid range
        for key in ["clarity", "specificity", "context", "constraints", "examples"]:
            result[key] = max(0.0, min(20.0, float(result.get(key, 5.0))))

        valid_categories = [
            "coding", "writing", "research", "business",
            "study", "creative", "general"
        ]
        if result.get("category") not in valid_categories:
            result["category"] = "general"

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
            f"Groq OK — total={total:.1f}, category={result['category']}, "
            f"success={result['success_probability']}%"
        )
        return result

    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e} | raw: {raw_text[:300]}")
        return _fallback(prompt_text)
    except Exception as e:
        print(f"Groq error: {type(e).__name__}: {e}")
        return _fallback(prompt_text)


def _build_improved(prompt_text: str, result: dict = None) -> str:
    """
    Builds a genuinely improved version of the prompt using the analysis result.
    Used when the model's improved_prompt is missing or too similar to the original.
    """
    category = result.get("category", "general") if result else "general"

    category_role = {
        "coding": "You are an expert software engineer with 10+ years of experience.",
        "writing": "You are a professional writer and editor with expertise in clear communication.",
        "research": "You are a thorough research analyst with expertise in synthesizing information.",
        "business": "You are a senior business consultant with expertise in strategy and operations.",
        "study": "You are an expert tutor skilled at explaining complex concepts clearly.",
        "creative": "You are a creative professional with a talent for original ideas.",
        "general": "You are a highly knowledgeable expert assistant.",
    }

    role = category_role.get(category, category_role["general"])

    return (
        f"{role}\n\n"
        f"Task: {prompt_text.rstrip('.')}\n\n"
        f"Please provide a comprehensive and well-structured response that includes:\n"
        f"1. A clear and thorough answer to the main request\n"
        f"2. Step-by-step breakdown where applicable\n"
        f"3. Concrete examples or code snippets to illustrate key points\n"
        f"4. Common pitfalls, edge cases, or mistakes to avoid\n"
        f"5. Best practices and professional recommendations\n\n"
        f"Format requirements:\n"
        f"- Use clear headers for each section\n"
        f"- Keep explanations concise but complete\n"
        f"- Use bullet points for lists\n"
        f"- Highlight any important warnings or notes"
    )


def _fallback(prompt_text: str) -> dict:
    print("Using rule-based fallback — Groq API unavailable")
    return {
        "clarity": 5.0,
        "specificity": 4.0,
        "context": 3.0,
        "constraints": 3.0,
        "examples": 2.0,
        "category": "general",
        "improved_prompt": _build_improved(prompt_text),
        "coaching_tip": (
            "Add more context about your goal, specify the exact output format you want, "
            "and include any constraints or requirements. The more specific you are, the better the AI response."
        ),
        "success_probability": 25,
        "success_reason": "Prompt lacks specificity and context needed for a great AI response."
    }