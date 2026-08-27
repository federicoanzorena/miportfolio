from datetime import datetime

from datetime import datetime

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response
from pydantic import BaseModel
from sqlmodel import select

from .. import config
from ..database import SessionFactory
from ..modificar.models import SolicitudModificacion
from ..security import crear_token_admin, es_token_admin
from ..sumate.models import SolicitudSumate

router = APIRouter()


def _exigir_admin(panel_session: str | None = Cookie(default=None)) -> None:
    if not es_token_admin(panel_session):
        raise HTTPException(status_code=401, detail="No autorizado")


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
        samesite="lax",
        max_age=8 * 60 * 60,
    )
    return {"ok": True}


@router.post("/panel/logout")
def logout(response: Response) -> dict:
    response.delete_cookie("panel_session")
    return {"ok": True}


@router.get("/panel/estado", dependencies=[Depends(_exigir_admin)])
def estado() -> dict:
    return {"autenticado": True}


@router.get("/panel/solicitudes-sumate", dependencies=[Depends(_exigir_admin)])
def solicitudes_sumate() -> list[dict]:
    with SessionFactory() as session:
        filas = session.exec(
            select(SolicitudSumate).order_by(SolicitudSumate.fecha.desc())
        ).all()
    return [
        {
            "id": f.id,
            "nombre": f.nombre,
            "email": f.email,
            "fecha": f.fecha.strftime("%d/%m/%Y %H:%M"),
        }
        for f in filas
    ]


@router.get("/panel/solicitudes-modificar", dependencies=[Depends(_exigir_admin)])
def solicitudes_modificar() -> list[dict]:
    with SessionFactory() as session:
        filas = session.exec(
            select(SolicitudModificacion).order_by(SolicitudModificacion.fecha.desc())
        ).all()
    return [
        {
            "id": f.id,
            "nombre": f.nombre,
            "email": f.email,
            "url_sitio": f.url_sitio,
            "que_cambiar": f.que_cambiar,
            "prioridades": f.prioridades,
            "presupuesto": f.presupuesto,
            "plazos": f.plazos,
            "detalles_tecnicos": f.detalles_tecnicos,
            "fecha": f.fecha.strftime("%d/%m/%Y %H:%M"),
        }
        for f in filas
    ]
