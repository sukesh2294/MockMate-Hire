from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class PracticeStartRequest(BaseModel):
    topic: str = Field(..., description="Domain e.g. Python Backend, Frontend, System Design, DSA, HR")
    difficulty: str = Field("Intermediate", description="Beginner, Intermediate, Advanced")
    use_resume_context: bool = Field(True, description="Whether to personalize using uploaded resume")
    total_questions: int = Field(5, ge=1, le=10, description="Number of practice questions")


class PracticeQuestionItem(BaseModel):
    question_index: int
    question_text: str


class PracticeStartResponse(BaseModel):
    session_id: str
    topic: str
    difficulty: str
    questions: List[PracticeQuestionItem]
    total_questions: int


class PracticeAnswerSubmit(BaseModel):
    session_id: str
    question_text: str
    candidate_answer: str


class PracticeEvaluationResponse(BaseModel):
    log_id: str
    session_id: str
    score: float
    technical_accuracy: float
    clarity_structure: str
    keyword_match: float
    matched_keywords: List[str]
    missing_keywords: List[str]
    positive_feedback: str
    areas_of_improvement: str
    suggested_answer: str


class PracticeHistoryItem(BaseModel):
    session_id: str
    topic: str
    difficulty: str
    total_questions: int
    overall_score: Optional[float] = None
    status: str
    created_at: datetime


class PracticeAnalyticsResponse(BaseModel):
    overall_readiness: float
    sessions_completed: int
    questions_answered: int
    average_score: float
    weak_areas: List[str]
    strong_areas: List[str]
    topic_scores: Dict[str, float]
    recent_sessions: List[PracticeHistoryItem]


class QuizQuestion(BaseModel):
    id: str
    topic: str
    question: str
    options: List[str]
    correct_answer_index: int
    explanation: str
    quiz_type: str = "mcq"
    code_snippet: Optional[str] = None


class QuizResponse(BaseModel):
    topic: str
    quizzes: List[QuizQuestion]
