from typing import Dict, List

SCORE_KEYS = [
    ("communication", "Communication"),
    ("grammar", "Grammar"),
    ("fluency", "Fluency"),
    ("clarity", "Clarity"),
    ("technical", "Technical"),
    ("confidence", "Confidence"),
]


def evaluate_answer(answer_text: str, skills: List[str]) -> List[Dict[str, int]]:
    quality = min(100, max(45, len(answer_text.split()) * 2))
    if any(word in answer_text.lower() for word in ["confident", "deliver", "experience", "led"]):
        quality = min(100, quality + 5)

    base = quality
    dimensions = []
    for index, (key, label) in enumerate(SCORE_KEYS):
        score = max(50, min(100, base - index * 3 + (5 if key in skills else 0)))
        dimensions.append({"key": key, "label": label, "score": score})
    return dimensions
