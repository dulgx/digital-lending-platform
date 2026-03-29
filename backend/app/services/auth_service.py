from fastapi import HTTPException
from app.repositories.user_repository import UserRepository
from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse

class AuthService:
    def __init__(self, user_repo: UserRepository):
        self.user_repo = user_repo

    def register(self, body: RegisterRequest) -> User:
        existing = self.user_repo.get_by_email(body.email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        user = User(
            name=body.name,
            email=body.email,
            password_hash=hash_password(body.password),
            salary=body.salary,
            age=body.age,
        )
        return self.user_repo.create(user)

    def login(self, body: LoginRequest) -> TokenResponse:
        user = self.user_repo.get_by_email(body.email)
        if not user or not verify_password(body.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        token = create_access_token({"sub": str(user.id)})
        return TokenResponse(access_token=token)
