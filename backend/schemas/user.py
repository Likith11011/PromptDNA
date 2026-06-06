# schemas/user.py
from pydantic import BaseModel, Field, EmailStr

class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., max_length=72)  # Enforce max length
    name: str | None = None

# What the client sends when logging in
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# What we send back after successful login
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Safe user info we can send to the frontend (no hashed_password!)
class UserResponse(BaseModel):
    id: str
    email: str
    name: str | None
    total_prompts: int
    avg_score: float

    class Config:
        from_attributes = True  # Allows converting SQLAlchemy models to this schema