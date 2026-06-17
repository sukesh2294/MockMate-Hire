import uuid
from sqlalchemy import Column, String, DateTime, func
from sqlalchemy.orm import relationship
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    clerk_id = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    role = Column(String, nullable=False, default="candidate")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    interviews = relationship("Interview", back_populates="recruiter", cascade="all, delete-orphan")
    sessions = relationship("InterviewSession", back_populates="candidate", cascade="all, delete-orphan")
    resume = relationship("ResumeData", back_populates="candidate", uselist=False, cascade="all, delete-orphan")
