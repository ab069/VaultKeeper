from datetime import datetime, timezone, timedelta


def check_expiration(secrets: list) -> list:
    now = datetime.now(timezone.utc)
    warning_range = now + timedelta(days=7)
    expiring = []
    for secret in secrets:
        expires = getattr(secret, "expires_at", None)
        if expires and expires <= warning_range:
            expiring.append({
                "id": secret.id,
                "name": secret.name,
                "expires_at": expires.isoformat(),
                "days_left": (expires - now).days,
            })
    return expiring


def assess_vault_health(secrets: list, audit_logs: list) -> dict:
    findings = []
    score = 100
    now = datetime.now(timezone.utc)

    for secret in secrets:
        if secret.rotation_days is None or secret.rotation_days <= 0:
            findings.append({
                "severity": "medium",
                "message": f"Secret '{secret.name}' has no rotation policy",
            })
            score -= 10

        if secret.expires_at and secret.expires_at < now:
            findings.append({
                "severity": "high",
                "message": f"Secret '{secret.name}' has expired",
            })
            score -= 15

        rotated = getattr(secret, "last_rotated", None)
        if rotated and secret.rotation_days and secret.rotation_days > 0:
            age = (now - rotated).days
            if age > secret.rotation_days:
                findings.append({
                    "severity": "medium",
                    "message": f"Secret '{secret.name}' is past its rotation interval",
                })
                score -= 10

    if not audit_logs:
        score -= 5
        findings.append({"severity": "low", "message": "No audit logs recorded"})

    return {
        "security_score": max(0, score),
        "findings": findings,
        "total_secrets": len(secrets),
        "total_audit_events": len(audit_logs),
    }


def generate_audit_report(logs: list) -> str:
    actions = {}
    resources = {}
    for log in logs:
        action = getattr(log, "action", "unknown")
        actions[action] = actions.get(action, 0) + 1
        rt = getattr(log, "resource_type", "unknown")
        resources[rt] = resources.get(rt, 0) + 1

    total = len(logs)
    if total == 0:
        return "No audit events recorded."

    top_action = max(actions, key=actions.get)
    top_resource = max(resources, key=resources.get)

    return (
        f"Audit Report: {total} events recorded. "
        f"Most common action: '{top_action}' ({actions[top_action]} times). "
        f"Most accessed resource type: '{top_resource}' ({resources[top_resource]} times)."
    )


def simulate_rotation_policy(secret) -> dict:
    now = datetime.now(timezone.utc)
    rotated = getattr(secret, "last_rotated", None)
    rotation_days = getattr(secret, "rotation_days", 90)

    if not rotated:
        return {
            "secret_id": secret.id,
            "secret_name": secret.name,
            "status": "never_rotated",
            "recommendation": "Rotate immediately",
            "suggested_interval_days": rotation_days,
        }

    age = (now - rotated).days
    if age >= rotation_days:
        return {
            "secret_id": secret.id,
            "secret_name": secret.name,
            "status": "overdue",
            "days_overdue": age - rotation_days,
            "recommendation": "Rotate immediately",
            "suggested_interval_days": rotation_days,
        }

    days_remaining = rotation_days - age
    return {
        "secret_id": secret.id,
        "secret_name": secret.name,
        "status": "healthy",
        "days_remaining": days_remaining,
        "recommendation": f"Rotate in {days_remaining} days",
        "suggested_interval_days": rotation_days,
    }
