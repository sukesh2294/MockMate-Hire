from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db_session, get_current_user
from app.services.candidate_service import get_candidate_report
from app.schemas.report import ReportRead
from app.schemas.user import UserRead

router = APIRouter()


@router.get("/{candidate_id}", response_model=ReportRead)
async def read_candidate_report(
    candidate_id: str,
    current_user: UserRead = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
) -> ReportRead:
    if current_user.role != "recruiter" and current_user.id != candidate_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access to candidate report denied")

    report = await get_candidate_report(db, candidate_id)
    if report is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")
    return report
