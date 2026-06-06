import uuid

from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    # Which prompt this feedback is about
    prompt_id = Column(String, ForeignKey("prompt_logs.id"), nullable=False, index=True)

    # Which user gave the feedback
    user_id = Column(String, ForeignKey("users.id"), nullable=False)

    # Was the AI suggestion helpful?
    was_helpful = Column(Boolean, nullable=False)

    # Optional comment
    comment = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    prompt = relationship("PromptLog", back_populates="feedback")
    user = relationship("User", back_populates="feedback")