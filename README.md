# VaultKeeper - Secrets Management & Encryption Platform

A secure secrets management platform with AES encryption, secret rotation, audit logging, and cryptographic tools.

## Quick Start

```bash
docker compose up -d
```

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Features

- **Encrypted Secret Vault** — Store API keys, passwords, certificates, env vars, and more. All values are encrypted at rest using AES-256 via Fernet.
- **AES Encryption API** — Standalone encrypt/decrypt endpoints with key generation.
- **Secret Rotation** — Re-encrypt secrets with new keys on demand.
- **Audit Logging** — Every action (create, read, update, delete, rotate, decrypt) is logged with timestamps and IP addresses.
- **Real-time WebSocket Feed** — Live audit events and rotation alerts streamed to the dashboard.
- **Vault Agent** — Simulated vault health assessments, expiration checks, rotation policy recommendations, and audit report generation.
- **Dark-themed UI** — Built with React + Tailwind, amber (#eab308) accent.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, FastAPI, SQLAlchemy (async), PostgreSQL |
| Encryption | cryptography (Fernet / AES-256) |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Frontend | React, TypeScript, Zustand, Tailwind CSS |
| Real-time | WebSockets |
| Deployment | Docker, Docker Compose, nginx |

## API Endpoints

### Auth
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login, returns JWT token

### Secrets
- `POST /api/secrets` — Store a new secret (encrypted)
- `GET /api/secrets` — List all secrets (metadata only, never plaintext)
- `GET /api/secrets/{id}` — Get secret metadata
- `DELETE /api/secrets/{id}` — Delete a secret
- `POST /api/secrets/rotate` — Rotate a secret (re-encrypt)
- `GET /api/secrets/stats` — Secret statistics

### Crypto
- `POST /api/crypto/encrypt` — Encrypt plaintext
- `POST /api/crypto/decrypt` — Decrypt ciphertext
- `POST /api/crypto/key` — Generate a new encryption key

### Audit
- `GET /api/audit` — List audit logs
- `GET /api/audit/stats` — Audit statistics

### WebSocket
- `ws://host/ws/events` — Real-time event feed

### Health
- `GET /api/health` — Health check

## Architecture

```
User → React SPA (port 80) → FastAPI (port 8000) → PostgreSQL (port 5432)
                        ↕
                  WebSocket (real-time events)
```

All secrets are encrypted before storage using Fernet (AES-256-CBC with HMAC). Encryption keys are generated per-secret and stored alongside the ciphertext. The plaintext value is never exposed through the API.

## Demo Credentials

Register a new account at http://localhost/register to get started.

## License

MIT
