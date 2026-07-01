from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.core.crypto import encrypt_value, decrypt_value, generate_key
from app.core.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/crypto", tags=["crypto"])


class EncryptRequest(BaseModel):
    plaintext: str
    key: str | None = None


class DecryptRequest(BaseModel):
    ciphertext: str
    key: str


class CryptoResponse(BaseModel):
    result: str
    key: str | None = None


class KeyResponse(BaseModel):
    key: str


@router.post("/encrypt", response_model=CryptoResponse)
async def encrypt(
    data: EncryptRequest,
    user: User = Depends(get_current_user),
):
    key = data.key or generate_key()
    try:
        result = encrypt_value(data.plaintext, key)
    except Exception as e:
        raise HTTPException(400, f"Encryption failed: {e}")
    return CryptoResponse(result=result, key=key if not data.key else None)


@router.post("/decrypt", response_model=CryptoResponse)
async def decrypt(
    data: DecryptRequest,
    user: User = Depends(get_current_user),
):
    try:
        result = decrypt_value(data.ciphertext, data.key)
    except Exception as e:
        raise HTTPException(400, f"Decryption failed: {e}")
    return CryptoResponse(result=result)


@router.post("/key", response_model=KeyResponse)
async def generate_encryption_key(
    user: User = Depends(get_current_user),
):
    return KeyResponse(key=generate_key())
