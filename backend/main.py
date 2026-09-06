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
    logger.info("Database tables verified")
except Exception as e:
    logger.error(f"DB error: {e}")
    raise

app = FastAPI(
    title="PromptDNA API",
    version="2.0.0"
)

raw_origins = os.getenv("ALLOWED_ORIGINS", "*")
if raw_origins == "*":
    allowed_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://prompt-dna-pi.vercel.app",
    ]
else:
    allowed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]
    for default_origin in ["http://localhost:3000", "http://127.0.0.1:3000"]:
        if default_origin not in allowed_origins:
            allowed_origins.append(default_origin)

logger.info(f"CORS origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    return {"status": "ok"}