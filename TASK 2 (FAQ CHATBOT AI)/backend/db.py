"""
Database configuration and SQLAlchemy models for FAQ Chatbot.
"""
from datetime import datetime
from typing import Generator
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# SQLite database file path
DATABASE_URL = "sqlite:///./faqs.db"

# Engine setup
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # Needed for SQLite in multi-threaded FastAPI
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class FAQ(Base):
    """
    SQLAlchemy model representing an FAQ entry.
    """
    __tablename__ = "faqs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    question = Column(String(500), nullable=False, index=True)
    answer = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, default="General", index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "question": self.question,
            "answer": self.answer,
            "category": self.category,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


def init_db():
    """Create all tables in the database."""
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency for obtaining a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
