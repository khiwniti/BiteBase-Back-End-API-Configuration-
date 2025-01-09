from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user import UserCreate, UserResponse
from app.models.user import User
from app.core.security import get_password_hash, verify_password
from app.core.config import settings
from jose import jwt
from datetime import datetime, timedelta
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from app.api.deps import get_current_user
from typing import Optional
import redis
from app.core.database import redis_client
from app.core.security import create_access_token
from app.utils.token_utils import is_token_revoked  # Import the utility function

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

class AuthService:
    def __init__(self):
        pass

    @staticmethod
    async def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    async def create_user(db: Session, email: str, password: str) -> User:
        hashed_password = get_password_hash(password)
        db_user = User(
            email=email,
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    async def create_token(user_id: int) -> dict:
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": str(user_id)}, expires_delta=access_token_expires
        )

        # Store token in Redis
        redis_client.setex(
            f"user_session:{user_id}",
            settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            access_token
        )

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    @staticmethod
    async def revoke_token(user_id: int):
        redis_client.delete(f"user_session:{user_id}")

    @staticmethod
    async def get_google_user(access_token: str):
        try:
            idinfo = id_token.verify_oauth2_token(access_token, google_requests.Request(), settings.GOOGLE_CLIENT_ID)
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')
            return idinfo
        except ValueError:
            return None

    @staticmethod
    async def get_facebook_user(access_token: str):
        # Implement logic to get user info from Facebook using access_token
        pass

    @staticmethod
    async def get_or_create_user(db: Session, user_info: dict):
        user = db.query(User).filter(User.email == user_info["email"]).first()
        if not user:
            user = User(email=user_info["email"], hashed_password="")
            db.add(user)
            db.commit()
            db.refresh(user)
        return user

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = await AuthService.create_user(db, user.email, user.password)
    return db_user

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = await AuthService.create_user(db, user_in.email, user_in.password)
    return db_user

@router.post("/login", response_model=dict)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = await AuthService.authenticate_user(
        db, form_data.username, form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = await AuthService.create_token(user.id)
    return token

@router.post("/google", response_model=UserResponse)
async def google_login(access_token: str, db: Session = Depends(get_db)):
    user_info = await AuthService.get_google_user(access_token)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )
    user = await AuthService.get_or_create_user(db, user_info)
    return user

@router.post("/facebook", response_model=UserResponse)
async def facebook_login(access_token: str, db: Session = Depends(get_db)):
    user_info = await AuthService.get_facebook_user(access_token)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Facebook token"
        )
    user = await AuthService.get_or_create_user(db, user_info)
    return user

@router.post("/register/google", response_model=UserResponse)
async def google_register(access_token: str, db: Session = Depends(get_db)):
    user_info = await AuthService.get_google_user(access_token)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )
    user = await AuthService.get_or_create_user(db, user_info)
    return user

@router.post("/register/facebook", response_model=UserResponse)
async def facebook_register(access_token: str, db: Session = Depends(get_db)):
    user_info = await AuthService.get_facebook_user(access_token)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Facebook token"
        )
    user = await AuthService.get_or_create_user(db, user_info)
    return user

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user), token: str = Depends(oauth2_scheme)):
    await AuthService.revoke_token(token)
    return {"message": "Successfully logged out"}


