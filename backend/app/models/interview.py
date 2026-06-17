import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.base import Base


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    role = Column(String, nullable=False)
    experience_level = Column(String, nullable=False)
    duration_minutes = Column(Integer, nullable=False, default=30)
    status = Column(String, nullable=False, default="active")
    recruiter_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)

    recruiter = relationship("User", back_populates="interviews")
    questions = relationship("Question", back_populates="interview", cascade="all, delete-orphan", order_by="Question.position")
    sessions = relationship("InterviewSession", back_populates="interview", cascade="all, delete-orphan")
