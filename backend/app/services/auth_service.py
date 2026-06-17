from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

import httpx
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserRead

_jwks_cache: Optional[Dict[str, Any]] = None


async def fetch_clerk_jwk_set() -> Dict[str, Any]:
    global _jwks_cache
    if _jwks_cache is not None:
        return _jwks_cache

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(settings.CLERK_JWK_URL)
        response.raise_for_status()
        jwks = response.json()
        _jwks_cache = jwks
        return jwks


async def verify_clerk_token(token: str) -> Dict[str, Any]:
    try:
        header = jwt.get_unverified_header(token)
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication header") from exc

    jwks = await fetch_clerk_jwk_set()
    key_id = header.get("kid")
    if not key_id or "keys" not in jwks:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token key information")

    signing_key = next((key for key in jwks["keys"] if key.get("kid") == key_id), None)
    if signing_key is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unable to find matching JWK")

    try:
        expected_issuer = settings.CLERK_ISSUER.rstrip('/')
        payload = jwt.decode(
            token,
            signing_key,
            algorithms=["RS256"],
            issuer=expected_issuer,
            options={"verify_aud": False},
        )
        return payload
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token") from exc


async def get_or_create_user(db: AsyncSession, payload: Dict[str, Any]) -> User:
    clerk_id = payload.get("sub") or payload.get("user_id") or payload.get("uid")
    email = payload.get("email")

    if not email:
        email_addresses = payload.get("email_addresses") or []
        if isinstance(email_addresses, list) and email_addresses:
            primary = None
            primary_id = payload.get("primary_email_address_id")
            if primary_id:
                primary = next((item for item in email_addresses if item.get("id") == primary_id), None)
            if primary is None:
                primary = email_addresses[0]
            if primary:
                email = primary.get("email_address") or primary.get("email")

    if not clerk_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Clerk token payload")

    statement = select(User).where(User.clerk_id == clerk_id)
    result = await db.execute(statement)
    user = result.scalars().first()

    role = "candidate"
    public_metadata = payload.get("public_metadata") or {}
    if isinstance(public_metadata, dict):
        role = public_metadata.get("role", role)

    if user is None:
        if not email:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Clerk token payload")

        user = User(
            clerk_id=clerk_id,
            email=email,
            first_name=payload.get("first_name") or payload.get("name"),
            last_name=payload.get("last_name"),
            role=role,
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

    if user.role != role or (email and user.email != email):
        user.role = role
        if email:
            user.email = email
        await db.commit()
        await db.refresh(user)

    return user


async def authenticate_user(db: AsyncSession, token: str) -> UserRead:
    payload = await verify_clerk_token(token)
    user = await get_or_create_user(db, payload)
    return UserRead.from_orm(user)
