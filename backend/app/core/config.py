from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Digital Lending Platform"
    DEBUG: bool = False

    DATABASE_URL: str = "sqlite:///./lending.db"

    SECRET_KEY: str = Field(default="change-this-in-production", min_length=16)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Comma-separated allowed origins, e.g. "http://localhost:3000,https://lending.dulgx.com"
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
