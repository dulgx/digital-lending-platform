from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.services.auth_service import AuthService
from app.repositories.user_repository import UserRepository

router = APIRouter(prefix="/auth", tags=["Auth"])


def get_auth_service(db: Session = Depends(get_db)):
    return AuthService(UserRepository(db))


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.register(body)


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, auth_service: AuthService = Depends(get_auth_service)):
    return auth_service.login(body)
