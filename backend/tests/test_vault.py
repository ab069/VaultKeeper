import pytest
from app.core.crypto import generate_key, encrypt_value, decrypt_value, hash_value


def test_generate_key():
    key = generate_key()
    assert isinstance(key, str)
    assert len(key) > 0


def test_encrypt_decrypt():
    key = generate_key()
    plaintext = "my-secret-password"
    encrypted = encrypt_value(plaintext, key)
    assert encrypted != plaintext
    decrypted = decrypt_value(encrypted, key)
    assert decrypted == plaintext


def test_hash_value():
    result = hash_value("hello")
    assert len(result) == 64
    assert result == hash_value("hello")
    assert result != hash_value("world")


def test_encrypt_wrong_key():
    key1 = generate_key()
    key2 = generate_key()
    encrypted = encrypt_value("secret", key1)
    with pytest.raises(Exception):
        decrypt_value(encrypted, key2)
