from pydantic import BaseModel


class LiveKitTokenResponse(BaseModel):
    token: str
    url: str


class LiveKitRoomRequest(BaseModel):
    interview_id: str
    identity: str
    room_name: str
