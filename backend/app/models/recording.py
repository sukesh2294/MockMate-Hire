import uuid
from sqlalchemy import Column, String, JSON, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.base import Base


class Recording(Base):
    __tablename__ = "recordings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    session_id = Column(String, ForeignKey("interview_sessions.id"), nullable=False)
    storage_path = Column(String, nullable=False)
    recording_metadata = Column("metadata", JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("InterviewSession", backref="recordings")
