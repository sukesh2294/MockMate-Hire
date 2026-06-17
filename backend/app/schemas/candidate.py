from pydantic import BaseModel, ConfigDict
from typing import List, Optional


class CandidateBase(BaseModel):
    id: str
    name: str
    email: str
    role: str
    score: Optional[int] = None
    status: Optional[str] = None
    date: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class CandidateListResponse(BaseModel):
    candidates: List[CandidateBase]
