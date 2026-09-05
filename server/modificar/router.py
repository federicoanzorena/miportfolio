from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel, EmailStr

from . import service

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


MENSAJE_OK = "Solicitud recibida. Te contactaremos pronto."


@router.post("/modificar", status_code=200)
def registrar_modificacion(
    body: ModificacionCreate, background_tasks: BackgroundTasks
) -> dict:
    if service.solicitud_antispam(body.website):
        return {"ok": True, "mensaje": MENSAJE_OK}

    solicitud = service.crear_solicitud(
        nombre=body.nombre.strip(),
        email=body.email.strip(),
        url_sitio=body.url_sitio.strip(),
        que_cambiar=body.que_cambiar.strip(),
        prioridades=body.prioridades.strip(),
        presupuesto=body.presupuesto.strip(),
        plazos=body.plazos.strip(),
        detalles_tecnicos=body.detalles_tecnicos.strip(),
    )

    background_tasks.add_task(
        service.enviar_email,
        solicitud.nombre,
        solicitud.email,
        solicitud.url_sitio,
        solicitud.que_cambiar,
        solicitud.prioridades,
        solicitud.presupuesto,
        solicitud.plazos,
        solicitud.detalles_tecnicos,
    )

    return {"ok": True, "mensaje": MENSAJE_OK}
