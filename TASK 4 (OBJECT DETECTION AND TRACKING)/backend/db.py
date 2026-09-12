"""
SQLAlchemy Database setup and session management with SQLite auto-migration.
"""
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from config import DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency generator for database sessions."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Initialize all tables and migrate columns if needed."""
    Base.metadata.create_all(bind=engine)

    # SQLite migration: add user_id column if upgrading existing database
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE sessions ADD COLUMN user_id INTEGER REFERENCES users(id)"))
            conn.commit()
        except Exception:
            pass  # Column already exists
