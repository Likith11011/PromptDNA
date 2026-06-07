from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from database import engine, Base
from routers import auth, prompts, coaching, profile

try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables verified successfully")
except Exception as e:
    logger.error(f"Database connection error: {e}")
    raise

app = FastAPI(
    title="PromptDNA API",
    description="Personalized AI Prompt Intelligence Coach",
    version="2.0.0"
)

raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [o.strip() for o in raw_origins.split(",")]

logger.info(f"CORS allowed origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(auth.router)
app.include_router(prompts.router)
app.include_router(coaching.router)
app.include_router(profile.router)


@app.get("/")
def root():
    return {"status": "PromptDNA API v2.0 running"}


@app.get("/health")
def health():
    return {"status": "ok", "version": "2.0.0"}