import uuid
from sqlalchemy import Column, String, Float, Integer, Boolean, JSON, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.base import Base


class PracticeSession(Base):
    __tablename__ = "practice_sessions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    candidate_id = Column(String, ForeignKey("users.id"), nullable=False)
    topic = Column(String, nullable=False)
    difficulty = Column(String, nullable=False, default="Intermediate")
    use_resume_context = Column(Boolean, default=True)
    total_questions = Column(Integer, default=5)
    overall_score = Column(Float, nullable=True)
    status = Column(String, nullable=False, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    ended_at = Column(DateTime(timezone=True), nullable=True)

    candidate = relationship("User")
    logs = relationship("PracticeLog", back_populates="session", cascade="all, delete-orphan", lazy="selectin")


class PracticeLog(Base):
    __tablename__ = "practice_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey("practice_sessions.id"), nullable=False)
    question_text = Column(String, nullable=False)
    candidate_answer = Column(String, nullable=True)
    score = Column(Float, nullable=True)
    technical_accuracy = Column(Float, nullable=True)
    clarity_structure = Column(String, nullable=True)
    keyword_match = Column(Float, nullable=True)
    suggested_answer = Column(String, nullable=True)
    feedback_json = Column(JSON, nullable=True, default=dict)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("PracticeSession", back_populates="logs")
