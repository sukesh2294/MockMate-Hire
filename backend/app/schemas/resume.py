from pydantic import BaseModel
from typing import List, Optional


class ResumeAnalysisResponse(BaseModel):
    candidate_name: str
    skills: List[str]
    personalized_question: Optional[str]
    insight: str
    uploaded_at: str


class ResumeUploadResponse(BaseModel):
    resume: ResumeAnalysisResponse
