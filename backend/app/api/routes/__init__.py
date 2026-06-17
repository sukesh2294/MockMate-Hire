from fastapi import APIRouter

from app.api.routes import auth, candidates, health, interviews, livekit, reports

router = APIRouter()
router.include_router(health.router, prefix="/health", tags=["health"])
router.include_router(auth.router, tags=["auth"])
router.include_router(interviews.router, prefix="/interviews", tags=["interviews"])
router.include_router(candidates.router, prefix="/candidates", tags=["candidates"])
router.include_router(reports.router, prefix="/reports", tags=["reports"])
router.include_router(livekit.router, prefix="/livekit", tags=["livekit"])
