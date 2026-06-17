from typing import Dict, List

from app.models.report import Report


def compute_overall_score(skills: List[str], answer_quality: int = 80) -> int:
    skill_boost = min(len(skills) * 4, 12)
    score = min(100, max(50, answer_quality + skill_boost))
    return score


def choose_recommendation(overall_score: int) -> str:
    if overall_score >= 85:
        return "recommended"
    if overall_score >= 70:
        return "review"
    return "needs_improvement"


def summarize_resume_insights(skills: List[str]) -> Dict[str, List[str]]:
    strengths = []
    weaknesses = []
    suggestions = []

    if skills:
        strengths.append(f"Demonstrated expertise with {', '.join(skills[:3])}.")
    else:
        weaknesses.append("Resume did not surface strong technical keywords.")
        suggestions.append("Add more specific skills and project details to improve evaluation.")

    if len(skills) >= 4:
        strengths.append("Strong cross-functional skillset is visible from the resume.")
    else:
        weaknesses.append("Opportunity to strengthen the resume with additional certifications or tools.")

    if not strengths:
        suggestions.append("Expand technical experience descriptions and provide measurable outcomes.")

    return {
        "strengths": strengths or ["Clear resume structure and professional presentation."],
        "weaknesses": weaknesses or ["Consider adding more results-driven bullet points to your experience."],
        "suggestions": suggestions or ["Highlight recent projects with specific business impact."] ,
    }


def build_report(candidate_id: str, session_id: str, skills: List[str]) -> Dict[str, any]:
    overall_score = compute_overall_score(skills)
    recommendation = choose_recommendation(overall_score)
    summary = summarize_resume_insights(skills)

    return {
        "session_id": session_id,
        "candidate_id": candidate_id,
        "overall_score": overall_score,
        "recommendation": recommendation,
        "strengths": summary["strengths"],
        "weaknesses": summary["weaknesses"],
        "suggestions": summary["suggestions"],
        "scores": {
            "technical": min(95, overall_score + 2),
            "communication": min(95, overall_score),
            "confidence": min(95, overall_score - 5),
        },
        "score_history": [
            {"question": "Q1", "score": overall_score - 4},
            {"question": "Q2", "score": overall_score + 2},
            {"question": "Q3", "score": overall_score},
        ],
    }
