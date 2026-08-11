import os
from datetime import datetime, timedelta, timezone

import jwt

SECRET_KEY = os.getenv("BINFINITO_SECRET", "dev-secret-change-me")
ALGORITHM = "HS256"


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


def verificar_token(token: str | None) -> dict | None:
    if not token:
        return None
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        return None
