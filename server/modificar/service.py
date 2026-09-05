from sqlmodel import select

from ..database import SessionFactory
from ..mail import enviar_email_modificacion
from .models import SolicitudModificacion


def crear_solicitud(
    nombre: str,
    email: str,
    url_sitio: str,
    que_cambiar: str,
    prioridades: str,
    presupuesto: str,
    plazos: str,
    detalles_tecnicos: str,
) -> SolicitudModificacion:
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
        session.refresh(solicitud)
    return solicitud


def solicitud_antispam(website: str) -> bool:
    return bool(website.strip())


def enviar_email(
    nombre: str,
    email: str,
    url_sitio: str,
    que_cambiar: str,
    prioridades: str,
    presupuesto: str,
    plazos: str,
    detalles_tecnicos: str,
) -> None:
    enviar_email_modificacion(
        nombre,
        email,
        url_sitio,
        que_cambiar,
        prioridades,
        presupuesto,
        plazos,
        detalles_tecnicos,
    )


def listar() -> list[SolicitudModificacion]:
    with SessionFactory() as session:
        return list(
            session.exec(
                select(SolicitudModificacion).order_by(
                    SolicitudModificacion.fecha.desc()
                )
            )
        )


def listar_publico() -> list[dict]:
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
        for f in listar()
    ]
