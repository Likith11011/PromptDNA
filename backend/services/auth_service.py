# services/auth_service.py
from sqlalchemy.orm import Session
from models.user import User
from schemas.user import SignupRequest
from core.security import hash_password, verify_password, create_access_token

def create_user(db: Session, data: SignupRequest) -> User:
    """
    Registers a new user.
    1. Check if email already exists
    2. Hash the password
    3. Create and save the User record
    """
    # Check for duplicate email
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        return None  # Caller will raise the HTTP 400 error
    
    # Never store plain password — hash it first
    hashed = hash_password(data.password)
    
    user = User(
        email=data.email,
        hashed_password=hashed,
        name=data.name
    )
    
    db.add(user)      # Stage the insert
    db.commit()       # Write to database
    db.refresh(user)  # Reload from DB to get generated fields (id, created_at)
    
    return user

def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """
    Verifies login credentials.
    Returns the User if valid, None if email not found or wrong password.
    """
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        return None
    
    if not verify_password(password, user.hashed_password):
        return None
    
    return user

def login_user(db: Session, email: str, password: str) -> str | None:
    """
    Full login flow: authenticate, then create a JWT token.
    Returns the token string, or None if credentials are wrong.
    """
    user = authenticate_user(db, email, password)
    if not user:
        return None
    
    # The token payload — 'sub' (subject) stores the user's ID
    token = create_access_token(data={"sub": user.id})
    return token