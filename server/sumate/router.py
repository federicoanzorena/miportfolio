from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel, EmailStr
from sqlmodel import Session

from ..database import SessionFactory
from ..email import enviar_email_sumate
from .models import SolicitudSumate

router = APIRouter()


class SumateCreate(BaseModel):
    nombre: str
    email: EmailStr
    website: str = ""


@router.post("/sumate", status_code=200)
def registrar_interes(body: SumateCreate, background_tasks: BackgroundTasks) -> dict:
    # Honeypot: si el campo oculto tiene contenido, es un bot
    if body.website.strip():
        return {
            "ok": True,
            "mensaje": "Registro recibido. Te contactaremos cuando haya un lugar.",
        }

    nombre = body.nombre.strip()
    email = body.email.strip()

    # Guardar en DB antes de enviar email
    solicitud = SolicitudSumate(nombre=nombre, email=email)
    with SessionFactory() as session:
        session.add(solicitud)
        session.commit()

    # Notificación por email (best-effort)
    background_tasks.add_task(enviar_email_sumate, nombre, email)

    return {
        "ok": True,
        "mensaje": "Registro recibido. Te contactaremos cuando haya un lugar.",
    }
