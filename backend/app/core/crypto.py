import base64
import hashlib
import os

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes


def generate_key() -> str:
    return base64.urlsafe_b64encode(Fernet.generate_key()).decode()


def encrypt_value(plaintext: str, key: str) -> str:
    f = Fernet(key.encode() if isinstance(key, str) else key)
    return f.encrypt(plaintext.encode()).decode()


def decrypt_value(ciphertext: str, key: str) -> str:
    f = Fernet(key.encode() if isinstance(key, str) else key)
    return f.decrypt(ciphertext.encode()).decode()


def hash_value(value: str) -> str:
    return hashlib.sha256(value.encode()).hexdigest()
