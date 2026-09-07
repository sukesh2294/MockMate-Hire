from pydantic import BaseModel


class LiveKitTokenResponse(BaseModel):
    token: str
    url: str


class LiveKitRoomRequest(BaseModel):
    interview_id: str | None = None
    practice_session_id: str | None = None
    mode: str = "interview"
    identity: str
    room_name: str
