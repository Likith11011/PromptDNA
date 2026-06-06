from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from schemas.user import SignupRequest, LoginRequest, TokenResponse, UserResponse
from services.auth_service import create_user, login_user
from core.security import get_current_user
from models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=UserResponse, status_code=201)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    user = create_user(db, data)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists"
        )
    return user


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    token = login_user(db, data.email, data.password)
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Protected route — requires Authorization: Bearer <token> header.
    Returns the currently logged-in user's profile.
    """
    return current_user