from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from core.config import settings
import os

# PostgreSQL needs different args than SQLite
is_sqlite = settings.DATABASE_URL.startswith("sqlite")

if is_sqlite:
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False},
    )
else:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,        # test connection before use
        pool_recycle=300,          # recycle connections every 5 min
        pool_size=5,               # max 5 connections in pool
        max_overflow=10,           # allow 10 overflow connections
        connect_args={
            "connect_timeout": 10,  # fail fast if DB unreachable
            "sslmode": "require",   # always use SSL with Neon
        },
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()