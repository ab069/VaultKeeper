from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.secret import SecretCreate, SecretResponse, SecretList, RotateRequest
from app.services.secret_service import create_secret, list_secrets, get_secret, delete_secret, rotate_secret, get_stats
from app.services.audit_service import log_action

router = APIRouter(prefix="/api/secrets", tags=["secrets"])


@router.post("", response_model=SecretResponse, status_code=201)
async def create(
    data: SecretCreate,
    request: Request,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    secret = await create_secret(user.id, data, db)
    await log_action(db, "create", "secret", str(secret.id), user.id, {"name": secret.name}, request.client.host)
    return secret


@router.get("", response_model=SecretList)
async def list_all(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    secrets = await list_secrets(user.id, db)
    return SecretList(secrets=secrets, total=len(secrets))


@router.get("/stats")
async def stats(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_stats(user.id, db)


@router.get("/{secret_id}", response_model=SecretResponse)
async def get(
    secret_id: int,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    secret = await get_secret(secret_id, user.id, db)
    if not secret:
        raise HTTPException(404, "Secret not found")
    return secret


@router.delete("/{secret_id}", status_code=204)
async def delete(
    secret_id: int,
    request: Request,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    deleted = await delete_secret(secret_id, user.id, db)
    if not deleted:
        raise HTTPException(404, "Secret not found")
    await log_action(db, "delete", "secret", str(secret_id), user.id, {}, request.client.host)


@router.post("/rotate", response_model=SecretResponse)
async def rotate(
    data: RotateRequest,
    request: Request,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    secret = await rotate_secret(data.secret_id, user.id, db)
    if not secret:
        raise HTTPException(404, "Secret not found")
    await log_action(db, "rotate", "secret", str(secret.id), user.id, {"name": secret.name}, request.client.host)
    return secret
