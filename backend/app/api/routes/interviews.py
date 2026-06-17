from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, require_recruiter, get_db_session
from app.models.interview import Interview
from app.models.session import InterviewSession
from app.schemas.interview import InterviewCreate, InterviewRead
from app.services.analysis_service import evaluate_answer
from app.services.interview_service import create_interview, get_interview_by_id, list_interviews_for_recruiter, list_open_interviews
from app.schemas.user import UserRead

router = APIRouter()


@router.get("/", response_model=List[InterviewRead])
async def list_interviews(
    current_user: UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
) -> List[InterviewRead]:
    if current_user.role == "recruiter":
        interviews = await list_interviews_for_recruiter(db, current_user.id)
    else:
        interviews = await list_open_interviews(db)
    return [InterviewRead(
        id=item.id,
        title=item.title,
        role=item.role,
        experience_level=item.experience_level,
        duration_minutes=item.duration_minutes,
        status=item.status,
        questions=item.questions,
    ) for item in interviews]


@router.post("/", response_model=InterviewRead, status_code=status.HTTP_201_CREATED)
async def create_new_interview(
    payload: InterviewCreate,
    current_user: UserRead = Depends(require_recruiter),
    db: AsyncSession = Depends(get_db_session),
) -> InterviewRead:
    interview = await create_interview(db, current_user.id, payload)
    return InterviewRead(
        id=interview.id,
        title=interview.title,
        role=interview.role,
        experience_level=interview.experience_level,
        duration_minutes=interview.duration_minutes,
        status=interview.status,
        questions=interview.questions,
    )


@router.get("/{interview_id}", response_model=InterviewRead)
async def get_interview(interview_id: str, db: AsyncSession = Depends(get_db_session)) -> InterviewRead:
    interview = await get_interview_by_id(db, interview_id)
    if interview is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview not found")
    return InterviewRead(
        id=interview.id,
        title=interview.title,
        role=interview.role,
        experience_level=interview.experience_level,
        duration_minutes=interview.duration_minutes,
        status=interview.status,
        questions=interview.questions,
    )


class AnswerAnalysisRequest(BaseModel):
    answer_text: str


@router.post("/{interview_id}/analysis")
async def analyze_interview_answer(
    interview_id: str,
    payload: AnswerAnalysisRequest,
    current_user: UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
) -> list[dict]:
    interview = await get_interview_by_id(db, interview_id)
    if interview is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview not found")

    from app.models.resume import ResumeData
    statement = select(ResumeData).where(ResumeData.candidate_id == current_user.id)
    res_result = await db.execute(statement)
    resume = res_result.scalars().first()
    
    skills = resume.skills if resume else ["communication", "technical"]
    if not skills:
        skills = ["communication", "technical"]

    analysis = evaluate_answer(payload.answer_text, skills)
    return analysis


@router.put("/{interview_id}", response_model=InterviewRead)
async def update_interview_endpoint(
    interview_id: str,
    payload: InterviewCreate,
    current_user: UserRead = Depends(require_recruiter),
    db: AsyncSession = Depends(get_db_session),
) -> InterviewRead:
    interview = await get_interview_by_id(db, interview_id)
    if interview is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview not found")
    if interview.recruiter_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    interview.title = payload.title
    interview.role = payload.role
    interview.experience_level = payload.experience_level
    interview.duration_minutes = payload.duration_minutes
    await db.commit()
    await db.refresh(interview)
    return InterviewRead(
        id=interview.id,
        title=interview.title,
        role=interview.role,
        experience_level=interview.experience_level,
        duration_minutes=interview.duration_minutes,
        status=interview.status,
        questions=interview.questions,
    )


@router.delete("/{interview_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_interview_endpoint(
    interview_id: str,
    current_user: UserRead = Depends(require_recruiter),
    db: AsyncSession = Depends(get_db_session),
):
    interview = await get_interview_by_id(db, interview_id)
    if interview is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview not found")
    if interview.recruiter_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
        
    await db.delete(interview)
    await db.commit()
    return None


@router.get("/dashboard/stats", response_model=dict)
async def get_dashboard_stats_endpoint(
    current_user: UserRead = Depends(require_recruiter),
    db: AsyncSession = Depends(get_db_session),
) -> dict:
    from app.services.interview_service import get_dashboard_stats
    from app.models.report import Report
    stats = await get_dashboard_stats(db, current_user.id)
    
    screened_stmt = (
        select(func.count(Report.id))
        .join(InterviewSession, InterviewSession.id == Report.session_id)
        .join(Interview, Interview.id == InterviewSession.interview_id)
        .where(Interview.recruiter_id == current_user.id)
    )
    screened = await db.scalar(screened_stmt) or 0
    
    avg_score_stmt = (
        select(func.avg(Report.overall_score))
        .join(InterviewSession, InterviewSession.id == Report.session_id)
        .join(Interview, Interview.id == InterviewSession.interview_id)
        .where(Interview.recruiter_id == current_user.id)
    )
    avg_score = await db.scalar(avg_score_stmt) or 0.0
    
    rec_stmt = (
        select(func.count(Report.id))
        .join(InterviewSession, InterviewSession.id == Report.session_id)
        .join(Interview, Interview.id == InterviewSession.interview_id)
        .where(Interview.recruiter_id == current_user.id, Report.overall_score >= 85)
    )
    recommended = await db.scalar(rec_stmt) or 0
    
    stats["candidates_screened"] = screened
    stats["average_score"] = round(float(avg_score), 1)
    stats["recommended_candidates"] = recommended
    stats["trends"] = {
        "interviews": 12,
        "screened": 8,
        "score": 5,
        "recommended": 15
    }
    return stats


@router.get("/dashboard/activity")
async def get_activity_endpoint(
    current_user: UserRead = Depends(require_recruiter),
    db: AsyncSession = Depends(get_db_session),
):
    return [
        {"month": "Jan", "interviews": 2, "completed": 1},
        {"month": "Feb", "interviews": 3, "completed": 2},
        {"month": "Mar", "interviews": 4, "completed": 3},
        {"month": "Apr", "interviews": 5, "completed": 4},
        {"month": "May", "interviews": 8, "completed": 6},
        {"month": "Jun", "interviews": 12, "completed": 10},
    ]


@router.get("/dashboard/performance")
async def get_performance_endpoint(
    current_user: UserRead = Depends(require_recruiter),
    db: AsyncSession = Depends(get_db_session),
):
    return [
        {"category": "Technical", "score": 85},
        {"category": "Communication", "score": 90},
        {"category": "Confidence", "score": 80},
        {"category": "Fluency", "score": 88},
        {"category": "Clarity", "score": 86},
    ]


@router.get("/dashboard/recent-interviews")
async def get_recent_interviews_endpoint(
    current_user: UserRead = Depends(require_recruiter),
    db: AsyncSession = Depends(get_db_session),
):
    stmt = select(Interview).where(Interview.recruiter_id == current_user.id).order_by(Interview.created_at.desc()).limit(5)
    res = await db.execute(stmt)
    items = res.scalars().all()
    results = []
    for item in items:
        from app.models.report import Report
        avg_score_stmt = (
            select(func.avg(Report.overall_score))
            .join(InterviewSession, InterviewSession.id == Report.session_id)
            .where(InterviewSession.interview_id == item.id)
        )
        avg_score = await db.scalar(avg_score_stmt)
        results.append({
            "id": item.id,
            "role": item.role,
            "status": item.status,
            "avgScore": round(float(avg_score), 1) if avg_score else None
        })
    return results


@router.get("/dashboard/recent-candidates")
async def get_recent_candidates_endpoint(
    current_user: UserRead = Depends(require_recruiter),
    db: AsyncSession = Depends(get_db_session),
):
    from app.models.report import Report
    stmt = (
        select(User, Report, InterviewSession, Interview)
        .join(InterviewSession, InterviewSession.candidate_id == User.id)
        .join(Report, Report.session_id == InterviewSession.id)
        .join(Interview, Interview.id == InterviewSession.interview_id)
        .where(Interview.recruiter_id == current_user.id)
        .order_by(InterviewSession.started_at.desc())
        .limit(5)
    )
    res = await db.execute(stmt)
    rows = res.all()
    return [
        {
            "id": user.id,
            "name": f"{user.first_name or ''} {user.last_name or ''}".strip() or user.email,
            "role": interview.role,
            "score": report.overall_score,
            "status": report.recommendation,
            "date": session.started_at.strftime("%Y-%m-%d") if session.started_at else None
        } for user, report, session, interview in rows
    ]


@router.get("/dashboard/interview-candidates")
async def get_interview_candidates_endpoint(
    current_user: UserRead = Depends(require_recruiter),
    db: AsyncSession = Depends(get_db_session),
):
    from app.models.report import Report
    stmt = (
        select(User, InterviewSession, Report, Interview)
        .join(InterviewSession, InterviewSession.candidate_id == User.id)
        .join(Interview, Interview.id == InterviewSession.interview_id)
        .join(Report, Report.session_id == InterviewSession.id, isouter=True)
        .where(Interview.recruiter_id == current_user.id)
        .order_by(InterviewSession.started_at.desc())
    )
    res = await db.execute(stmt)
    rows = res.all()
    return [
        {
            "id": user.id,
            "name": f"{user.first_name or ''} {user.last_name or ''}".strip() or user.email,
            "role": interview.role,
            "status": session.status,
            "score": report.overall_score if report else None,
            "date": session.started_at.strftime("%Y-%m-%d") if session.started_at else None
        } for user, session, report, interview in rows
    ]


@router.get("/dashboard/ranking")
async def get_ranking_endpoint(
    current_user: UserRead = Depends(require_recruiter),
    db: AsyncSession = Depends(get_db_session),
):
    from app.models.report import Report
    stmt = (
        select(User, Report)
        .join(InterviewSession, InterviewSession.candidate_id == User.id)
        .join(Report, Report.session_id == InterviewSession.id)
        .join(Interview, Interview.id == InterviewSession.interview_id)
        .where(Interview.recruiter_id == current_user.id)
        .order_by(Report.overall_score.desc())
    )
    res = await db.execute(stmt)
    rows = res.all()
    results = []
    for rank, (user, report) in enumerate(rows, start=1):
        results.append({
            "rank": rank,
            "id": user.id,
            "name": f"{user.first_name or ''} {user.last_name or ''}".strip() or user.email,
            "score": report.overall_score
        })
    return results


@router.post("/{interview_id}/sessions", status_code=status.HTTP_201_CREATED)
async def create_interview_session(
    interview_id: str,
    current_user: UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
) -> dict:
    interview = await get_interview_by_id(db, interview_id)
    if interview is None or interview.status != "active":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interview is not available")

    if current_user.role != "candidate":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only candidates can start sessions")

    session = InterviewSession(interview_id=interview_id, candidate_id=current_user.id)
    db.add(session)
    await db.commit()
    await db.refresh(session)
    return {"session_id": session.id, "interview_id": interview_id, "status": session.status}
