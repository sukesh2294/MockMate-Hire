from typing import List
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.interview import Interview
from app.models.question import Question
from app.models.user import User
from app.schemas.interview import InterviewCreate

DEFAULT_QUESTIONS = [
    {"text": "Tell me about yourself.", "type": "behavioral", "difficulty": "easy"},
    {"text": "Describe a challenging problem you solved.", "type": "technical", "difficulty": "medium"},
    {"text": "How do you ensure quality in your work?", "type": "behavioral", "difficulty": "medium"},
    {"text": "Explain a technology you recently used and why.", "type": "technical", "difficulty": "hard"},
    {"text": "How do you prioritize tasks during an interview?", "type": "behavioral", "difficulty": "easy"},
]


async def create_interview(db: AsyncSession, recruiter_id: str, payload: InterviewCreate) -> Interview:
    interview = Interview(
        title=payload.title,
        role=payload.role,
        experience_level=payload.experience_level,
        duration_minutes=payload.duration_minutes,
        recruiter_id=recruiter_id,
    )
    db.add(interview)
    await db.flush()

    questions = []
    for index, question_source in enumerate(DEFAULT_QUESTIONS[: payload.question_count], start=1):
        questions.append(
            Question(
                interview_id=interview.id,
                text=question_source["text"],
                type=question_source["type"],
                difficulty=question_source["difficulty"],
                position=index,
            )
        )
    db.add_all(questions)
    await db.commit()
    await db.refresh(interview)
    return interview


async def get_interview_by_id(db: AsyncSession, interview_id: str) -> Interview | None:
    statement = select(Interview).where(Interview.id == interview_id)
    result = await db.execute(statement)
    return result.scalars().first()


async def list_interviews_for_recruiter(db: AsyncSession, recruiter_id: str) -> List[Interview]:
    statement = select(Interview).where(Interview.recruiter_id == recruiter_id).order_by(Interview.created_at.desc())
    result = await db.execute(statement)
    return result.scalars().all()


async def list_open_interviews(db: AsyncSession) -> List[Interview]:
    statement = select(Interview).where(Interview.status == "active").order_by(Interview.created_at.desc())
    result = await db.execute(statement)
    return result.scalars().all()


async def get_dashboard_stats(db: AsyncSession, recruiter_id: str) -> dict:
    total = await db.scalar(select(func.count(Interview.id)).where(Interview.recruiter_id == recruiter_id))
    completed = await db.scalar(select(func.count(Interview.id)).where(Interview.recruiter_id == recruiter_id, Interview.status == "completed"))
    return {
        "total_interviews": total or 0,
        "candidates_screened": 0,
        "average_score": 0.0,
        "recommended_candidates": 0,
    }
