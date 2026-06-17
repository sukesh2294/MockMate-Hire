import json
from pathlib import Path
from typing import List

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    from pydantic import BaseSettings
    from pydantic import ConfigDict as SettingsConfigDict

from pydantic import Field, field_validator


class Settings(BaseSettings):
    PROJECT_NAME: str = "Virento Hire API"

    DATABASE_URL: str = Field(..., env="DATABASE_URL")

    CLERK_JWK_URL: str = Field(..., env="CLERK_JWK_URL")
    CLERK_ISSUER: str = Field(..., env="CLERK_ISSUER")

    LIVEKIT_API_KEY: str = Field(..., env="LIVEKIT_API_KEY")
    LIVEKIT_API_SECRET: str = Field(..., env="LIVEKIT_API_SECRET")
    LIVEKIT_URL: str = Field(..., env="LIVEKIT_URL")

    RESUME_STORAGE_DIR: str = "./storage/resumes"

    ALLOWED_HOSTS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
    ]

    ALLOW_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
    ]

    @field_validator("ALLOW_ORIGINS", mode="before")
    @classmethod
    def parse_allow_origins(cls, value):

        if value is None:
            return []

        if isinstance(value, str):
            value = value.strip()

            if not value:
                return []

            try:
                return json.loads(value)
            except Exception:
                return [v.strip() for v in value.split(",")]

        return value

    model_config = SettingsConfigDict(
        env_file=Path(__file__).resolve().parents[2] / ".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()