from typing import List
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
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
    statement = select(Interview).options(selectinload(Interview.questions)).where(Interview.id == interview_id)
    result = await db.execute(statement)
    interview = result.scalars().first()

    if interview is None:
        try:
            # Find a recruiter or fallback user
            rec_stmt = select(User).where(User.role == "recruiter")
            rec_res = await db.execute(rec_stmt)
            recruiter = rec_res.scalars().first()

            if not recruiter:
                usr_stmt = select(User)
                usr_res = await db.execute(usr_stmt)
                recruiter = usr_res.scalars().first()

            recruiter_id = recruiter.id if recruiter else "default-recruiter"

            interview = Interview(
                id=interview_id,
                title="Frontend Developer Screening Interview",
                role="Frontend Developer",
                experience_level="Mid-Level",
                duration_minutes=30,
                status="active",
                recruiter_id=recruiter_id,
            )
            db.add(interview)
            await db.flush()

            questions = [
                Question(interview_id=interview.id, text="Tell me about yourself, your background, and key technical projects you have built.", type="behavioral", difficulty="easy", position=1),
                Question(interview_id=interview.id, text="Explain your technical experience with modern JavaScript, React, and frontend performance optimizations.", type="technical", difficulty="medium", position=2),
                Question(interview_id=interview.id, text="Walk me through a challenging bug or architectural obstacle you faced, and how you resolved it.", type="technical", difficulty="hard", position=3),
                Question(interview_id=interview.id, text="What questions do you have for our engineering team regarding the role and technology stack?", type="behavioral", difficulty="easy", position=4),
            ]
            db.add_all(questions)
            await db.commit()

            # Fetch eagerly with questions loaded
            res = await db.execute(select(Interview).options(selectinload(Interview.questions)).where(Interview.id == interview_id))
            interview = res.scalars().first()
        except Exception as exc:
            print(f"Auto-seeding interview {interview_id} failed: {exc}")
            await db.rollback()

    return interview


async def list_interviews_for_recruiter(db: AsyncSession, recruiter_id: str) -> List[Interview]:
    statement = select(Interview).options(selectinload(Interview.questions)).where(Interview.recruiter_id == recruiter_id).order_by(Interview.created_at.desc())
    result = await db.execute(statement)
    return result.scalars().all()


async def list_open_interviews(db: AsyncSession) -> List[Interview]:
    statement = select(Interview).options(selectinload(Interview.questions)).where(Interview.status == "active").order_by(Interview.created_at.desc())
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
