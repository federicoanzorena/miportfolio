import uuid
from datetime import date, datetime, time

from fastapi import HTTPException
from sqlmodel import select

from ..database import SessionFactory
from ..mail import enviar_email_confirmacion
from ..security import crear_token_turno
from .models import (
    AccesoEquipo,
    FranjaHoraria,
    FranjaPublic,
    Turno,
    TurnoConfirmado,
    TurnoPublic,
)
from .utils import ventana_franja


def franjas_disponibles() -> list[FranjaPublic]:
    ahora = datetime.now().astimezone()
    with SessionFactory() as session:
        franjas = session.exec(
            select(FranjaHoraria)
            .where(FranjaHoraria.disponible)
            .order_by(FranjaHoraria.fecha, FranjaHoraria.hora_inicio)
        ).all()

    disponibles = [
        f for f in franjas if datetime.combine(f.fecha, f.hora_fin).astimezone() > ahora
    ]
    return [
        FranjaPublic(id=f.id, fecha=f.fecha, hora_inicio=f.hora_inicio, hora_fin=f.hora_fin)
        for f in disponibles
    ]


def crear_franja(fecha: date, hora_inicio: time, hora_fin: time) -> FranjaPublic:
    if hora_inicio >= hora_fin:
        raise HTTPException(status_code=400, detail="hora_inicio debe ser anterior a hora_fin")

    franja = FranjaHoraria(
        fecha=fecha,
        hora_inicio=hora_inicio,
        hora_fin=hora_fin,
        disponible=True,
    )
    with SessionFactory() as session:
        session.add(franja)
        session.commit()
        session.refresh(franja)

    return FranjaPublic(
        id=franja.id,
        fecha=franja.fecha,
        hora_inicio=franja.hora_inicio,
        hora_fin=franja.hora_fin,
    )


def reservar_turno(
    franja_id: int, nombre_visitante: str, email_visitante: str
) -> TurnoPublic:
    if not nombre_visitante.strip():
        raise HTTPException(status_code=400, detail="El nombre es obligatorio")
    if "@" not in email_visitante:
        raise HTTPException(status_code=400, detail="Email inválido")

    with SessionFactory() as session:
        franja = session.get(FranjaHoraria, franja_id)
        if franja is None:
            raise HTTPException(status_code=404, detail="Franja no encontrada")
        if not franja.disponible:
            raise HTTPException(status_code=409, detail="La franja ya está ocupada")
        if (
            datetime.combine(franja.fecha, franja.hora_fin).astimezone()
            <= datetime.now().astimezone()
        ):
            raise HTTPException(status_code=409, detail="La franja ya pasó")

        turno = Turno(
            franja_id=franja.id,
            nombre_visitante=nombre_visitante.strip(),
            email_visitante=email_visitante.strip(),
            estado="pendiente",
            sala_id=uuid.uuid4().hex,
        )
        franja.disponible = False
        session.add(turno)
        session.add(franja)
        session.commit()
        session.refresh(turno)

        return TurnoPublic(
            id=turno.id,
            franja_id=turno.franja_id,
            nombre_visitante=turno.nombre_visitante,
            email_visitante=turno.email_visitante,
            estado=turno.estado,
            sala_id=turno.sala_id,
        )


def confirmar_turno(turno_id: int) -> tuple[TurnoConfirmado, callable]:
    with SessionFactory() as session:
        turno = session.get(Turno, turno_id)
        if turno is None:
            raise HTTPException(status_code=404, detail="Turno no encontrado")
        if turno.estado == "cancelado":
            raise HTTPException(status_code=409, detail="El turno fue cancelado")
        if turno.estado == "finalizado":
            raise HTTPException(status_code=409, detail="El turno ya finalizó")

        franja = session.get(FranjaHoraria, turno.franja_id)
        turno.estado = "confirmado"
        session.add(turno)
        session.commit()

    inicio, fin = ventana_franja(franja)
    token = crear_token_turno(
        turno.id, turno.sala_id, "visitante", turno.nombre_visitante
    )

    def enviar_email() -> None:
        enviar_email_confirmacion(turno, inicio, fin, token)

    return TurnoConfirmado(
        id=turno.id,
        franja_id=turno.franja_id,
        nombre_visitante=turno.nombre_visitante,
        email_visitante=turno.email_visitante,
        estado=turno.estado,
        sala_id=turno.sala_id,
        token_visitante=token,
        inicio=inicio,
        fin=fin,
    ), enviar_email


def acceso_equipo(turno_id: int) -> AccesoEquipo:
    with SessionFactory() as session:
        turno = session.get(Turno, turno_id)
        if turno is None:
            raise HTTPException(status_code=404, detail="Turno no encontrado")
        franja = session.get(FranjaHoraria, turno.franja_id)

    inicio, fin = ventana_franja(franja)
    token = crear_token_turno(turno.id, turno.sala_id, "equipo", "Equipo binfinito")
    return AccesoEquipo(
        sala_id=turno.sala_id,
        token_equipo=token,
        inicio=inicio,
        fin=fin,
    )
