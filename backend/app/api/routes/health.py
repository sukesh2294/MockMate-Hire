from fastapi import APIRouter

router = APIRouter()


@router.get("/ping")
async def ping() -> dict:
    return {"status": "ok", "message": "Virento Hire backend is running"}
