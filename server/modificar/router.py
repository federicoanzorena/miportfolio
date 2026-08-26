from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel, EmailStr
from sqlmodel import Session

from ..database import SessionFactory
from ..email import enviar_email_modificacion
from .models import SolicitudModificacion

router = APIRouter()


class ModificacionCreate(BaseModel):
    nombre: str
    email: EmailStr
    url_sitio: str
    que_cambiar: str
    prioridades: str
    presupuesto: str
    plazos: str
    detalles_tecnicos: str = ""
    website: str = ""


@router.post("/modificar", status_code=200)
def registrar_modificacion(
    body: ModificacionCreate, background_tasks: BackgroundTasks
) -> dict:
    if body.website.strip():
        return {
            "ok": True,
            "mensaje": "Solicitud recibida. Te contactaremos pronto.",
        }

    nombre = body.nombre.strip()
    email = body.email.strip()
    url_sitio = body.url_sitio.strip()
    que_cambiar = body.que_cambiar.strip()
    prioridades = body.prioridades.strip()
    presupuesto = body.presupuesto.strip()
    plazos = body.plazos.strip()
    detalles_tecnicos = body.detalles_tecnicos.strip()

    solicitud = SolicitudModificacion(
        nombre=nombre,
        email=email,
        url_sitio=url_sitio,
        que_cambiar=que_cambiar,
        prioridades=prioridades,
        presupuesto=presupuesto,
        plazos=plazos,
        detalles_tecnicos=detalles_tecnicos,
    )
    with SessionFactory() as session:
        session.add(solicitud)
        session.commit()

    background_tasks.add_task(
        enviar_email_modificacion,
        nombre,
        email,
        url_sitio,
        que_cambiar,
        prioridades,
        presupuesto,
        plazos,
        detalles_tecnicos,
    )

    return {
        "ok": True,
        "mensaje": "Solicitud recibida. Te contactaremos pronto.",
    }
