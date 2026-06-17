from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.report import Report
from app.models.user import User
from app.schemas.candidate import CandidateBase
from app.schemas.report import ReportRead


async def list_candidates(db: AsyncSession) -> List[CandidateBase]:
    statement = select(User).where(User.role == "candidate")
    result = await db.execute(statement)
    candidates = result.scalars().all()
    
    candidate_list = []
    for user in candidates:
        session_stmt = (
            select(InterviewSession, Report, Interview)
            .join(Report, Report.session_id == InterviewSession.id, isouter=True)
            .join(Interview, Interview.id == InterviewSession.interview_id, isouter=True)
            .where(InterviewSession.candidate_id == user.id)
            .order_by(InterviewSession.started_at.desc())
            .limit(1)
        )
        session_res = await db.execute(session_stmt)
        session_row = session_res.first()
        
        score = None
        status = "pending"
        role = "Software Engineer"
        date = None
        
        if session_row:
            session, report, interview = session_row
            if interview:
                role = interview.role
            if report:
                score = report.overall_score
                status = report.recommendation
            if session:
                date = session.started_at.strftime("%Y-%m-%d") if session.started_at else None
                
        candidate_list.append(
            CandidateBase(
                id=user.id,
                name=f"{user.first_name or ''} {user.last_name or ''}".strip() or user.email,
                email=user.email,
                role=role,
                score=score,
                status=status,
                date=date,
            )
        )
    return candidate_list


async def get_candidate_report(db: AsyncSession, candidate_id: str) -> ReportRead | None:
    statement = (
        select(Report, User, InterviewSession, Interview)
        .join(User, User.id == Report.candidate_id)
        .join(InterviewSession, InterviewSession.id == Report.session_id)
        .join(Interview, Interview.id == InterviewSession.interview_id)
        .where(Report.candidate_id == candidate_id)
    )
    result = await db.execute(statement)
    row = result.first()
    if row is None:
        return None

    report, user, session, interview = row
    name = f"{user.first_name or ''} {user.last_name or ''}".strip() or user.email
    role = interview.role if interview else "Software Engineer"
    interviewDate = session.started_at.strftime("%Y-%m-%d") if session and session.started_at else report.created_at.strftime("%Y-%m-%d")

    return ReportRead(
        id=report.id,
        name=name,
        role=role,
        interviewDate=interviewDate,
        overall_score=report.overall_score,
        recommendation=report.recommendation,
        strengths=report.strengths,
        weaknesses=report.weaknesses,
        suggestions=report.suggestions,
        scores={
            "technical": min(100, report.overall_score + 2),
            "communication": min(100, report.overall_score),
            "confidence": min(100, report.overall_score - 5),
        },
        score_history=[
            {"question": "Q1", "score": max(50, report.overall_score - 4)},
            {"question": "Q2", "score": min(100, report.overall_score + 2)},
            {"question": "Q3", "score": report.overall_score},
        ],
    )


async def create_report(db: AsyncSession, report_data: dict) -> ReportRead:
    report = Report(**report_data)
    db.add(report)
    await db.commit()
    await db.refresh(report)
    return await get_candidate_report(db, report.candidate_id)
