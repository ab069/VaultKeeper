from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.audit import AuditLog


async def log_action(
    db: AsyncSession,
    action: str,
    resource_type: str,
    resource_id: str | None = None,
    user_id: int | None = None,
    details: dict | None = None,
    ip_address: str | None = None,
) -> AuditLog:
    entry = AuditLog(
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        details=details,
        ip_address=ip_address,
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


async def list_logs(db: AsyncSession, skip: int = 0, limit: int = 50) -> list[AuditLog]:
    result = await db.execute(
        select(AuditLog).order_by(AuditLog.created_at.desc()).offset(skip).limit(limit)
    )
    return list(result.scalars().all())


async def get_stats(db: AsyncSession) -> dict:
    total = await db.scalar(select(func.count(AuditLog.id)))
    actions_result = await db.execute(
        select(AuditLog.action, func.count(AuditLog.id)).group_by(AuditLog.action)
    )
    actions = {row[0]: row[1] for row in actions_result}

    types_result = await db.execute(
        select(AuditLog.resource_type, func.count(AuditLog.id)).group_by(AuditLog.resource_type)
    )
    resource_types = {row[0]: row[1] for row in types_result}

    recent_result = await db.execute(
        select(AuditLog).order_by(AuditLog.created_at.desc()).limit(10)
    )
    recent = list(recent_result.scalars().all())

    return {
        "total_events": total or 0,
        "actions": actions,
        "resource_types": resource_types,
        "recent_events": recent,
    }
