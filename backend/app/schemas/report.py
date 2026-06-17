from pydantic import BaseModel, ConfigDict
from typing import List, Dict


class ReportRead(BaseModel):
    id: str
    name: str
    role: str
    interviewDate: str
    overall_score: int
    recommendation: str
    strengths: List[str]
    weaknesses: List[str]
    suggestions: List[str]
    scores: Dict[str, int]
    score_history: List[Dict[str, int]]

    model_config = ConfigDict(from_attributes=True)
