from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from database import engine, Base
from routers import auth, prompts, coaching

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PromptDNA API",
    description="Personalized AI Prompt Intelligence Coach",
    version="1.0.0"
)

# Read allowed origins from environment — comma separated
# e.g. "http://localhost:3000,https://promptdna.vercel.app"
raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000"
)
allowed_origins = [o.strip() for o in raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(prompts.router)
app.include_router(coaching.router)


@app.get("/")
def root():
    return {"status": "PromptDNA API is running"}