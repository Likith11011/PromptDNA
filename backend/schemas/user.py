from pydantic import BaseModel, EmailStr
from typing import Optional


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None

    model_config = {"str_strip_whitespace": True}


class LoginRequest(BaseModel):
    email: EmailStr
    password: str

    model_config = {"str_strip_whitespace": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    total_prompts: int
    avg_score: float

    model_config = {"from_attributes": True}