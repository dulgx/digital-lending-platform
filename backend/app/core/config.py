from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Digital Lending Platform"
    DEBUG: bool = True

    DATABASE_URL: str = "sqlite:///./lending.db"

    SECRET_KEY: str = "change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    class Config:
        env_file = ".env"


settings = Settings()
