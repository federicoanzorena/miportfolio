from sqlmodel import select

from ..database import SessionFactory
from ..mail import enviar_email_sumate
from .models import SolicitudSumate


def crear_interes(nombre: str, email: str) -> SolicitudSumate:
    solicitud = SolicitudSumate(nombre=nombre, email=email)
    with SessionFactory() as session:
        session.add(solicitud)
        session.commit()
        session.refresh(solicitud)
    return solicitud


def solicitud_antispam(website: str) -> bool:
    return bool(website.strip())


def enviar_email(nombre: str, email: str) -> None:
    enviar_email_sumate(nombre, email)


def listar() -> list[SolicitudSumate]:
    with SessionFactory() as session:
        return list(
            session.exec(select(SolicitudSumate).order_by(SolicitudSumate.fecha.desc()))
        )


def listar_publico() -> list[dict]:
    return [
        {
            "id": f.id,
            "nombre": f.nombre,
            "email": f.email,
            "fecha": f.fecha.strftime("%d/%m/%Y %H:%M"),
        }
        for f in listar()
    ]
