from datetime import datetime

from pydantic import BaseModel


class AuditLogResponse(BaseModel):
    id: int
    user_id: int | None
    action: str
    resource_type: str
    resource_id: str | None
    details: dict | None
    ip_address: str | None
    created_at: datetime | None

    class Config:
        from_attributes = True


class AuditStats(BaseModel):
    total_events: int
    actions: dict
    resource_types: dict
    recent_events: list[AuditLogResponse]
