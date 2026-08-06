import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "LifeStyleX API"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretinstagramkey1234567890")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 43200  # 30 days
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./instagram.db")
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")

    class Config:
        case_sensitive = True

settings = Settings()
