from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.user import UserRead
from app.services.auth_service import authenticate_user

security = HTTPBearer(auto_error=False)


async def get_db_session() -> AsyncSession:
    async for session in get_db():
        yield session


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db_session),
) -> UserRead:
    if credentials is None or not credentials.credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication credentials were not provided")
    return await authenticate_user(db, credentials.credentials)


async def require_recruiter(current_user: UserRead = Depends(get_current_user)) -> UserRead:
    if current_user.role != "recruiter":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Recruiter access required")
    return current_user


async def require_candidate(current_user: UserRead = Depends(get_current_user)) -> UserRead:
    if current_user.role != "candidate":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Candidate access required")
    return current_user
