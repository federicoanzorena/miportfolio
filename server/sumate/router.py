from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel, EmailStr

from . import service

router = APIRouter()


class SumateCreate(BaseModel):
    nombre: str
    email: EmailStr
    website: str = ""


MENSAJE_OK = "Registro recibido. Te contactaremos cuando haya un lugar."


@router.post("/sumate", status_code=200)
def registrar_interes(body: SumateCreate, background_tasks: BackgroundTasks) -> dict:
    if service.solicitud_antispam(body.website):
        return {"ok": True, "mensaje": MENSAJE_OK}

    solicitud = service.crear_interes(
        nombre=body.nombre.strip(),
        email=body.email.strip(),
    )

    background_tasks.add_task(service.enviar_email, solicitud.nombre, solicitud.email)

    return {"ok": True, "mensaje": MENSAJE_OK}
