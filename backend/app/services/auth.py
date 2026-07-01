from fastapi import Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.models.user import User
from app.schemas.user import UserCreate, LoginRequest


async def register_user(user_data: UserCreate, db: AsyncSession) -> User:
    result = await db.execute(select(User).where(
        (User.email == user_data.email) | (User.username == user_data.username)
    ))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email or username already registered")

    user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=get_password_hash(user_data.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def authenticate_user(login: LoginRequest, db: AsyncSession) -> str:
    result = await db.execute(select(User).where(User.username == login.username))
    user = result.scalar_one_or_none()
    if not user or not verify_password(login.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return create_access_token(subject=user.id)
