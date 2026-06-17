from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db_session, require_candidate, get_current_user
from app.models.resume import ResumeData
from app.models.user import User
from app.schemas.candidate import CandidateBase
from app.schemas.resume import ResumeAnalysisResponse, ResumeUploadResponse
from app.services.candidate_service import list_candidates
from app.services.resume_service import analyze_resume

router = APIRouter()


@router.get("/", response_model=List[CandidateBase])
async def read_candidates(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
) -> List[CandidateBase]:
    if current_user.role != "recruiter":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Recruiter access required")
    return await list_candidates(db)


@router.post("/me/resume", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user=Depends(require_candidate),
    db: AsyncSession = Depends(get_db_session),
) -> ResumeUploadResponse:
    candidate_name = f"{current_user.first_name or ''} {current_user.last_name or ''}".strip() or current_user.email
    analysis = await analyze_resume(candidate_name, file)
    existing = await db.execute(select(ResumeData).where(ResumeData.candidate_id == current_user.id))
    resume_data = existing.scalars().first()
    if resume_data is None:
        resume_data = ResumeData(
            candidate_id=current_user.id,
            file_name=analysis["file_name"],
            text=analysis["text"],
            skills=analysis["skills"],
            personalized_question=analysis["personalized_question"],
        )
        db.add(resume_data)
    else:
        resume_data.file_name = analysis["file_name"]
        resume_data.text = analysis["text"]
        resume_data.skills = analysis["skills"]
        resume_data.personalized_question = analysis["personalized_question"]
    await db.commit()
    return ResumeUploadResponse(
        resume=ResumeAnalysisResponse(
            candidate_name=analysis["candidate_name"],
            skills=analysis["skills"],
            personalized_question=analysis["personalized_question"],
            insight=analysis["insight"],
            uploaded_at=analysis["uploaded_at"],
        )
    )
