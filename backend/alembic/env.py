from logging.config import fileConfig
import sys
import os

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# Add backend folder to Python path so imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Import Base and ALL models so Alembic can detect them
from database import Base
from models.user import User
from models.prompt import PromptLog, PromptScores
from models.coaching import CoachingInsight
from models.feedback import Feedback

# Alembic Config object
config = context.config

# Setup logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# This is the metadata Alembic uses to detect schema changes
target_metadata = Base.metadata


def get_url():
    """Read DATABASE_URL from environment instead of alembic.ini"""
    from core.config import settings
    return settings.DATABASE_URL


def run_migrations_offline() -> None:
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = get_url()

    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()