import uuid
from sqlalchemy import Column, String, Integer, JSON, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.base import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey("interview_sessions.id"), nullable=False, unique=True)
    candidate_id = Column(String, ForeignKey("users.id"), nullable=False)
    overall_score = Column(Integer, nullable=False)
    recommendation = Column(String, nullable=False)
    strengths = Column(JSON, nullable=False, default=list)
    weaknesses = Column(JSON, nullable=False, default=list)
    suggestions = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("InterviewSession", back_populates="report")
