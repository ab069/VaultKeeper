from datetime import datetime

from pydantic import BaseModel


class SecretCreate(BaseModel):
    name: str
    secret_type: str = "other"
    value: str
    rotation_days: int = 90
    expires_at: datetime | None = None


class SecretResponse(BaseModel):
    id: int
    name: str
    secret_type: str
    rotation_days: int
    last_rotated: datetime | None
    expires_at: datetime | None
    created_at: datetime | None

    class Config:
        from_attributes = True


class SecretList(BaseModel):
    secrets: list[SecretResponse]
    total: int


class RotateRequest(BaseModel):
    secret_id: int
