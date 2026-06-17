from fastapi import APIRouter, Depends
from app.schemas.livekit import LiveKitRoomRequest, LiveKitTokenResponse
from app.services.livekit_service import build_livekit_url, create_livekit_token
from app.api.deps import get_current_user
from app.schemas.user import UserRead

router = APIRouter()


@router.post("/token", response_model=LiveKitTokenResponse)
async def create_livekit_session(
    payload: LiveKitRoomRequest,
    current_user: UserRead = Depends(get_current_user),
) -> LiveKitTokenResponse:
    full_room_name = f"{payload.room_name}-{payload.interview_id}"
    token = create_livekit_token(identity=payload.identity, room_name=full_room_name)
    return LiveKitTokenResponse(token=token, url=build_livekit_url())
