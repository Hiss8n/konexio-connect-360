from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from auth.schemas import AuthResponse, LoginRequest, RegisterRequest, UserResponse
from auth.security import create_access_token, get_token_user_id
from auth.service import authenticate_user, get_user_by_email, register_learner_user, register_user
from database import get_db
from models import User

load_dotenv()

router = APIRouter(prefix="/auth", tags=["authentication"])
bearer_scheme = HTTPBearer(auto_error=False)


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    if get_user_by_email(db, str(request.email)):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists")
    try:
        user = register_user(db, request)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(error)) from error
    return AuthResponse(access_token=create_access_token(user.id), user=user)


@router.post("/learner/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register_learner(request: RegisterRequest, db: Session = Depends(get_db)):
    if request.account_type != "learner":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This endpoint only accepts learner registrations")
    if get_user_by_email(db, str(request.email)):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="An account with this email already exists")
    try:
        user = register_learner_user(db, request)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(error)) from error
    return AuthResponse(access_token=create_access_token(user.id), user=user)


@router.post("/login", response_model=AuthResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, request)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return AuthResponse(access_token=create_access_token(user.id), user=user)


@router.get("/me", response_model=UserResponse)
def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bearer token required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = get_token_user_id(credentials.credentials)
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User no longer exists")
    return user