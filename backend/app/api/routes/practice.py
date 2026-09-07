import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db_session, get_current_user, require_candidate
from app.models.practice import PracticeSession, PracticeLog
from app.schemas.practice import (
    PracticeStartRequest,
    PracticeStartResponse,
    PracticeAnswerSubmit,
    PracticeEvaluationResponse,
    PracticeHistoryItem,
    PracticeAnalyticsResponse,
    QuizResponse,
)
from app.schemas.user import UserRead
from app.services import practice_service

router = APIRouter()


@router.post("/start", response_model=PracticeStartResponse)
async def start_practice_session(
    payload: PracticeStartRequest,
    current_user: UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
):
    """Initiates a new AI Mock Practice Session and returns generated questions."""
    # Create PracticeSession DB entry
    session_obj = PracticeSession(
        id=str(uuid.uuid4()),
        candidate_id=current_user.id,
        topic=payload.topic,
        difficulty=payload.difficulty,
        use_resume_context=payload.use_resume_context,
        total_questions=payload.total_questions,
        status="active"
    )
    db.add(session_obj)
    await db.commit()
    await db.refresh(session_obj)

    # Generate questions (using resume context if enabled)
    questions = await practice_service.generate_practice_questions(
        db=db,
        candidate_id=current_user.id,
        topic=payload.topic,
        difficulty=payload.difficulty,
        use_resume_context=payload.use_resume_context,
        total_questions=payload.total_questions
    )

    return PracticeStartResponse(
        session_id=session_obj.id,
        topic=session_obj.topic,
        difficulty=session_obj.difficulty,
        questions=questions,
        total_questions=len(questions)
    )


@router.post("/evaluate", response_model=PracticeEvaluationResponse)
async def evaluate_answer(
    payload: PracticeAnswerSubmit,
    current_user: UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
):
    """Evaluates candidate's practice response on Technical Accuracy, STAR Clarity, Keywords & Model Answer."""
    # Verify session exists
    stmt = select(PracticeSession).where(
        PracticeSession.id == payload.session_id,
        PracticeSession.candidate_id == current_user.id
    )
    res = await db.execute(stmt)
    sess = res.scalars().first()

    if not sess:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Practice session not found or access denied."
        )

    evaluation = await practice_service.evaluate_practice_answer(
        db=db,
        session_id=sess.id,
        question_text=payload.question_text,
        candidate_answer=payload.candidate_answer,
        topic=sess.topic
    )

    return evaluation


@router.get("/history", response_model=List[PracticeHistoryItem])
async def get_practice_history(
    current_user: UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
):
    """Fetches candidate's past practice sessions history."""
    stmt = select(PracticeSession).where(
        PracticeSession.candidate_id == current_user.id
    ).order_by(PracticeSession.created_at.desc())

    res = await db.execute(stmt)
    sessions = res.scalars().all()

    return [
        PracticeHistoryItem(
            session_id=s.id,
            topic=s.topic,
            difficulty=s.difficulty,
            total_questions=s.total_questions,
            overall_score=s.overall_score,
            status=s.status,
            created_at=s.created_at
        )
        for s in sessions
    ]


@router.get("/analytics", response_model=PracticeAnalyticsResponse)
async def get_practice_analytics(
    current_user: UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
):
    """Returns candidate's preparation performance analytics, readiness score %, weak & strong areas."""
    analytics = await practice_service.get_candidate_practice_analytics(
        db=db,
        candidate_id=current_user.id
    )
    return analytics


@router.get("/quizzes", response_model=QuizResponse)
async def get_practice_quizzes(
    topic: str = Query("Python Backend", description="Domain name for quiz questions"),
    current_user: UserRead = Depends(get_current_user),
):
    """Returns topic-wise technical multiple-choice questions & code debugging snippets."""
    return practice_service.get_domain_quizzes(topic=topic)
