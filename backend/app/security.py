import time
import secrets
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from fastapi import Request, HTTPException, status
from app.config import SESSION_SECRET

serializer = URLSafeTimedSerializer(SESSION_SECRET)

COOKIE_NAME = "monitor_session"
SESSION_MAX_AGE = 60 * 60 * 8 

active_sessions: dict[str, float] = {}


# --- Token creation ---
def create_session_token(username: str) -> str:
    jti = secrets.token_hex(16)
    payload = {
        "username": username,
        "jti": jti,
        "iat": int(time.time())
    }
    token = serializer.dumps(payload)

    active_sessions[jti] = time.time() + SESSION_MAX_AGE
    return token


# --- Token decoding ---
def decode_session_token(token: str) -> dict:
    return serializer.loads(token, max_age=SESSION_MAX_AGE)


# --- Session management ---
def is_valid_session(jti: str) -> bool:
    expiry = active_sessions.get(jti)
    if expiry is None:
        return False
    if time.time() > expiry:
        active_sessions.pop(jti, None)
        return False
    return True


def revoke_session(jti: str):
    active_sessions.pop(jti, None)


# --- FastAPI dependency ---

def require_session(request: Request):
    token = request.cookies.get(COOKIE_NAME)

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    try:
        payload = decode_session_token(token)
    except SignatureExpired:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired"
        )
    except BadSignature:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session"
        )

    if not is_valid_session(payload["jti"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session revoked"
        )

    return payload