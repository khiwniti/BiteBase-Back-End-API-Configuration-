from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from Auth_API_V1.db.database import get_db
from Auth_API_V1.schemas import user as schemas
from Auth_API_V1.models import user as models
from app.schemas.token import Token  # Ensure correct import
from app.services.authServices import AuthService  # Ensure correct import
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/users/{user_id}", response_model=schemas.User)
async def read_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/users", response_model=schemas.User)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(email=user.email, hashed_password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/register", response_model=schemas.User)
async def register(
    user_in: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    user = await AuthService.create_user(
        db=db,
        email=user_in.email,
        password=user_in.password
    )
    return user

@router.post("/login", response_model=Token)
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
    return await AuthService.create_token(user.id)

@router.post("/google", response_model=schemas.User)
async def google_login(access_token: str, db: Session = Depends(get_db)):
    user_info = await AuthService.get_google_user(access_token)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"

        )
    user = await AuthService.get_or_create_user(db, user_info)
    return user

@router.post("/facebook", response_model=schemas.User)
async def facebook_login(access_token: str, db: Session = Depends(get_db)):
    user_info = await AuthService.get_facebook_user(access_token)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Facebook token"
        )
    user = await AuthService.get_or_create_user(db, user_info)
    return user

@router.post("/register/google", response_model=schemas.User)
async def google_register(access_token: str, db: Session = Depends(get_db)):
    user_info = await AuthService.get_google_user(access_token)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )
    user = await AuthService.get_or_create_user(db, user_info)
    return user

@router.post("/register/facebook", response_model=schemas.User)
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
async def logout(current_user: int = Depends(get_current_user)):
    await AuthService.revoke_token(current_user)
    return {"message": "Successfully logged out"}
