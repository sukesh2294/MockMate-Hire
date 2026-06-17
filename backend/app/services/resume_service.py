import os
import re
from datetime import datetime
from typing import Dict, List

from fastapi import UploadFile, HTTPException, status
from pypdf import PdfReader

from app.core.config import settings

SKILL_KEYWORDS = [
    "react",
    "javascript",
    "python",
    "sql",
    "docker",
    "kubernetes",
    "design",
    "communication",
    "leadership",
    "cloud",
    "node",
    "typescript",
    "team",
    "product",
]


def ensure_resume_storage() -> None:
    os.makedirs(settings.RESUME_STORAGE_DIR, exist_ok=True)


def extract_text_from_pdf(file: UploadFile) -> str:
    try:
        reader = PdfReader(file.file)
        pages = [page.extract_text() or "" for page in reader.pages]
        return "\n".join(pages)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unable to parse PDF resume") from exc


def extract_text_from_upload(file: UploadFile) -> str:
    try:
        content = file.file.read()
        return content.decode("utf-8", errors="ignore")
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unable to read resume content") from exc


def parse_skills(text: str) -> List[str]:
    normalized = text.lower()
    found = []
    for keyword in SKILL_KEYWORDS:
        if re.search(rf"\b{re.escape(keyword)}\b", normalized) and keyword not in found:
            found.append(keyword.capitalize())
    return found


def build_personalized_question(skills: List[str], text: str) -> str:
    if skills:
        return f"Your resume highlights {', '.join(skills[:3])}. Can you tell me how you applied these skills in a recent project?"

    if "react" in text.lower():
        return "I noticed a strong React background in your resume. Can you explain how you structure reusable components in a large application?"

    return "Tell me about a project where you solved a difficult technical problem. What was your approach and outcome?"


async def analyze_resume(candidate_name: str, file: UploadFile) -> Dict[str, any]:
    ensure_resume_storage()
    file_name = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S')}_{file.filename}"
    destination = os.path.join(settings.RESUME_STORAGE_DIR, file_name)
    text = ""

    if file.content_type == "application/pdf":
        text = extract_text_from_pdf(file)
    else:
        text = extract_text_from_upload(file)

    skills = parse_skills(text)
    analysis = {
        "candidate_name": candidate_name,
        "skills": skills,
        "personalized_question": build_personalized_question(skills, text),
        "insight": "Resume parsing completed successfully.",
        "uploaded_at": datetime.utcnow().isoformat(),
        "file_name": file_name,
        "text": text,
    }

    file.file.seek(0)
    with open(destination, "wb") as out_file:
        out_file.write(file.file.read())

    return analysis
