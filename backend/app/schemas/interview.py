from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional


class QuestionCreate(BaseModel):
    text: str
    type: str
    difficulty: str
    position: int


class QuestionRead(BaseModel):
    id: str
    text: str
    type: str
    difficulty: str
    position: int

    model_config = ConfigDict(from_attributes=True)


class InterviewCreate(BaseModel):
    title: str
    role: str
    experience_level: str
    duration_minutes: int = Field(..., ge=5, le=120)
    question_count: int = Field(..., ge=3, le=20)


class InterviewRead(BaseModel):
    id: str
    title: str
    role: str
    experience_level: str
    duration_minutes: int
    status: str
    questions: List[QuestionRead]

    model_config = ConfigDict(from_attributes=True)


class InterviewStatistics(BaseModel):
    total_interviews: int
    candidates_screened: int
    average_score: float
    recommended_candidates: int


class InterviewDashboardResponse(BaseModel):
    stats: InterviewStatistics
    interviews: List[InterviewRead]
