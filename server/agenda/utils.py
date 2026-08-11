from datetime import datetime, timedelta

from sqlmodel import Session, select

from ..config import CHAT_TOLERANCIA_MINUTOS
from ..database import SessionFactory
from .models import FranjaHoraria, Turno


def _local(fecha, hora) -> datetime:
    return datetime.combine(fecha, hora).astimezone()


def ventana_franja(franja: FranjaHoraria) -> tuple[datetime, datetime]:
    tolerancia = timedelta(minutes=CHAT_TOLERANCIA_MINUTOS)
    inicio = _local(franja.fecha, franja.hora_inicio) - tolerancia
    fin = _local(franja.fecha, franja.hora_fin) + tolerancia
    return inicio, fin


def turno_y_franja_por_id(
    turno_id: int,
) -> tuple[Turno, FranjaHoraria] | None:
    with SessionFactory() as session:
        return session.exec(
            select(Turno, FranjaHoraria)
            .join(FranjaHoraria, Turno.franja_id == FranjaHoraria.id)
            .where(Turno.id == turno_id)
        ).first()


def turno_y_franja_por_sala(
    sala_id: str,
) -> tuple[Turno, FranjaHoraria] | None:
    with SessionFactory() as session:
        return session.exec(
            select(Turno, FranjaHoraria)
            .join(FranjaHoraria, Turno.franja_id == FranjaHoraria.id)
            .where(Turno.sala_id == sala_id)
        ).first()


def marcar_finalizado(turno_id: int) -> None:
    with SessionFactory() as session:
        turno = session.get(Turno, turno_id)
        if turno and turno.estado == "confirmado":
            turno.estado = "finalizado"
            session.add(turno)
            session.commit()
