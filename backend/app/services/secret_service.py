from datetime import datetime, timedelta, timezone

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.crypto import generate_key, encrypt_value
from app.models.secret import Secret
from app.schemas.secret import SecretCreate


async def create_secret(
    user_id: int,
    secret_data: SecretCreate,
    db: AsyncSession,
) -> Secret:
    key = generate_key()
    encrypted_val = encrypt_value(secret_data.value, key)

    secret = Secret(
        user_id=user_id,
        name=secret_data.name,
        secret_type=secret_data.secret_type,
        encrypted_value=encrypted_val,
        key_id=key,
        rotation_days=secret_data.rotation_days,
        expires_at=secret_data.expires_at,
    )
    db.add(secret)
    await db.commit()
    await db.refresh(secret)
    return secret


async def list_secrets(user_id: int, db: AsyncSession) -> list[Secret]:
    result = await db.execute(
        select(Secret).where(Secret.user_id == user_id).order_by(Secret.created_at.desc())
    )
    return list(result.scalars().all())


async def get_secret(secret_id: int, user_id: int, db: AsyncSession) -> Secret | None:
    result = await db.execute(
        select(Secret).where(Secret.id == secret_id, Secret.user_id == user_id)
    )
    return result.scalar_one_or_none()


async def delete_secret(secret_id: int, user_id: int, db: AsyncSession) -> bool:
    secret = await get_secret(secret_id, user_id, db)
    if not secret:
        return False
    await db.delete(secret)
    await db.commit()
    return True


async def rotate_secret(secret_id: int, user_id: int, db: AsyncSession) -> Secret | None:
    secret = await get_secret(secret_id, user_id, db)
    if not secret:
        return None

    from app.core.crypto import decrypt_value, encrypt_value
    plaintext = decrypt_value(secret.encrypted_value, secret.key_id)

    new_key = generate_key()
    new_encrypted = encrypt_value(plaintext, new_key)

    secret.encrypted_value = new_encrypted
    secret.key_id = new_key
    secret.last_rotated = datetime.now(timezone.utc)
    await db.commit()
    await db.refresh(secret)
    return secret


async def get_stats(user_id: int, db: AsyncSession) -> dict:
    total = await db.scalar(
        select(func.count(Secret.id)).where(Secret.user_id == user_id)
    )
    by_type = {}
    types_result = await db.execute(
        select(Secret.secret_type, func.count(Secret.id)).where(Secret.user_id == user_id).group_by(Secret.secret_type)
    )
    for row in types_result:
        by_type[row[0]] = row[1]

    now = datetime.now(timezone.utc)
    expiring_soon = await db.scalar(
        select(func.count(Secret.id)).where(
            Secret.user_id == user_id,
            Secret.expires_at.isnot(None),
            Secret.expires_at <= now + timedelta(days=7),
        )
    )

    return {
        "total": total or 0,
        "by_type": by_type,
        "expiring_soon": expiring_soon or 0,
    }
