from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel

from .. import config
from ..modificar import service as modificar_service
from ..security import crear_token_admin, _exigir_admin
from ..sumate import service as sumate_service

router = APIRouter()


class LoginBody(BaseModel):
    clave: str


@router.post("/panel/login")
def login(body: LoginBody, response: Response) -> dict:
    if not config.ADMIN_PASSWORD:
        raise HTTPException(status_code=403, detail="Panel deshabilitado")
    if body.clave != config.ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Clave incorrecta")

    response.set_cookie(
        "panel_session",
        crear_token_admin(),
        httponly=True,
        samesite=config.COOKIE_SAMESITE,
        secure=config.COOKIE_SECURE,
        max_age=8 * 60 * 60,
    )
    return {"ok": True}


@router.post("/panel/logout")
def logout(response: Response) -> dict:
    response.delete_cookie(
        "panel_session",
        samesite=config.COOKIE_SAMESITE,
        secure=config.COOKIE_SECURE,
    )
    return {"ok": True}


@router.get("/panel/estado", dependencies=[Depends(_exigir_admin)])
def estado() -> dict:
    return {"autenticado": True}


@router.get("/panel/solicitudes-sumate", dependencies=[Depends(_exigir_admin)])
def solicitudes_sumate() -> list[dict]:
    return sumate_service.listar_publico()


@router.get("/panel/solicitudes-modificar", dependencies=[Depends(_exigir_admin)])
def solicitudes_modificar() -> list[dict]:
    return modificar_service.listar_publico()
