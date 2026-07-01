from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "VaultKeeper"
    DATABASE_URL: str = "postgresql+asyncpg://vaultkeeper:vaultkeeper@db:5432/vaultkeeper"
    SECRET_KEY: str = "super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ENCRYPTION_KEY: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
