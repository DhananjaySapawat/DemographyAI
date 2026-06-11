import bcrypt
from fastapi import APIRouter, HTTPException, Request, Response, status
from pydantic import BaseModel
from app.config import MONITOR_USERNAME, MONITOR_PASSWORD_HASH
from app.security import (
    create_session_token,
    decode_session_token,
    revoke_session,
    COOKIE_NAME,
    SESSION_MAX_AGE
)

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/login")
def login(body: LoginRequest, response: Response):
    password_match = bcrypt.checkpw(
        body.password.encode(),
        MONITOR_PASSWORD_HASH.encode()
    )

    if body.username != MONITOR_USERNAME or not password_match:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    token = create_session_token(body.username)

    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=SESSION_MAX_AGE,
    )
    return {"message": "Logged in"}


@router.post("/logout")
def logout(request: Request, response: Response):
    token = request.cookies.get(COOKIE_NAME)

    if token:
        try:
            payload = decode_session_token(token)
            revoke_session(payload["jti"])
        except Exception:
            pass

    response.delete_cookie(COOKIE_NAME)
    return {"message": "Logged out"}