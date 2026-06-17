import uuid
from sqlalchemy import Column, String, JSON, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.base import Base


class ResumeData(Base):
    __tablename__ = "resume_data"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    candidate_id = Column(String, ForeignKey("users.id"), nullable=False, unique=True)
    file_name = Column(String, nullable=False)
    text = Column(String, nullable=False)
    skills = Column(JSON, nullable=False, default=list)
    personalized_question = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    candidate = relationship("User", back_populates="resume")
