import os
from datetime import datetime, timedelta, timezone

import jwt

SECRET_KEY = os.getenv("BINFINITO_SECRET", "dev-secret-change-me")
ALGORITHM = "HS256"
ROL_ADMIN = "admin"


def crear_token_turno(
    turno_id: int,
    sala_id: str,
    rol: str,
    nombre: str,
    expires_delta: timedelta | None = None,
) -> str:
    expira = datetime.now(timezone.utc) + (expires_delta or timedelta(hours=24))
    payload = {
        "sub": str(turno_id),
        "sala_id": sala_id,
        "rol": rol,
        "nombre": nombre,
        "exp": expira,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def crear_token_admin(expires_delta: timedelta | None = None) -> str:
    expira = datetime.now(timezone.utc) + (expires_delta or timedelta(hours=8))
    payload = {"rol": ROL_ADMIN, "exp": expira}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def es_token_admin(token: str | None) -> bool:
    datos = verificar_token(token)
    return bool(datos and datos.get("rol") == ROL_ADMIN)


def verificar_token(token: str | None) -> dict | None:
    if not token:
        return None
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        return None
