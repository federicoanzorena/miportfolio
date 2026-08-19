from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel, EmailStr

from ..email import enviar_email_sumate

router = APIRouter()


class SumateCreate(BaseModel):
    nombre: str
    email: EmailStr


@router.post("/sumate", status_code=202)
def registrar_interes(body: SumateCreate, background_tasks: BackgroundTasks) -> dict:
    nombre = body.nombre.strip()
    email = body.email.strip()

    background_tasks.add_task(enviar_email_sumate, nombre, email)

    return {
        "ok": True,
        "mensaje": "Registro recibido. Te contactaremos cuando haya un lugar.",
    }
