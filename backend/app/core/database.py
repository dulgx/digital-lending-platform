from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.pool import NullPool, StaticPool

from app.core.config import settings

_is_sqlite = "sqlite" in settings.DATABASE_URL

if _is_sqlite:
    # SQLite: single-threaded file DB for local dev
    engine = create_engine(
        settings.DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
else:
    # PostgreSQL (Neon serverless / any PG): NullPool is required for
    # serverless environments — each request opens/closes its own connection
    # so that Neon's PgBouncer pooler manages the actual pool.
    engine = create_engine(
        settings.DATABASE_URL,
        poolclass=NullPool,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """FastAPI dependency — yields a DB session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
