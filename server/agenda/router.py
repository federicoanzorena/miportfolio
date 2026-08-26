import uuid
from datetime import datetime

from fastapi import APIRouter, BackgroundTasks, HTTPException
from sqlmodel import Session, select

from ..database import SessionFactory
from ..mail import enviar_email_confirmacion
from ..security import crear_token_turno
from .models import (
    AccesoEquipo,
    FranjaCreate,
    FranjaHoraria,
    FranjaPublic,
    Turno,
    TurnoConfirmado,
    TurnoCreate,
    TurnoPublic,
)
from .utils import ventana_franja

router = APIRouter()


@router.get("/agenda/disponibilidad", response_model=list[FranjaPublic])
def disponibilidad() -> list[FranjaPublic]:
    ahora = datetime.now().astimezone()
    with SessionFactory() as session:
        franjas = session.exec(
            select(FranjaHoraria)
            .where(FranjaHoraria.disponible)
            .order_by(FranjaHoraria.fecha, FranjaHoraria.hora_inicio)
        ).all()

    disponibles = [
        f
        for f in franjas
        if datetime.combine(f.fecha, f.hora_fin).astimezone() > ahora
    ]
    return [
        FranjaPublic(
            id=f.id,
            fecha=f.fecha,
            hora_inicio=f.hora_inicio,
            hora_fin=f.hora_fin,
        )
        for f in disponibles
    ]


@router.post("/agenda/franjas", response_model=FranjaPublic, status_code=201)
def crear_franja(body: FranjaCreate) -> FranjaPublic:
    if body.hora_inicio >= body.hora_fin:
        raise HTTPException(status_code=400, detail="hora_inicio debe ser anterior a hora_fin")

    franja = FranjaHoraria(
        fecha=body.fecha,
        hora_inicio=body.hora_inicio,
        hora_fin=body.hora_fin,
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


@router.post("/agenda/turnos", response_model=TurnoPublic, status_code=201)
def reservar_turno(body: TurnoCreate) -> TurnoPublic:
    if not body.nombre_visitante.strip():
        raise HTTPException(status_code=400, detail="El nombre es obligatorio")
    if "@" not in body.email_visitante:
        raise HTTPException(status_code=400, detail="Email inválido")

    with SessionFactory() as session:
        franja = session.get(FranjaHoraria, body.franja_id)
        if franja is None:
            raise HTTPException(status_code=404, detail="Franja no encontrada")
        if not franja.disponible:
            raise HTTPException(status_code=409, detail="La franja ya está ocupada")
        if datetime.combine(franja.fecha, franja.hora_fin).astimezone() <= datetime.now().astimezone():
            raise HTTPException(status_code=409, detail="La franja ya pasó")

        turno = Turno(
            franja_id=franja.id,
            nombre_visitante=body.nombre_visitante.strip(),
            email_visitante=body.email_visitante.strip(),
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


@router.post("/agenda/turnos/{turno_id}/confirmar", response_model=TurnoConfirmado)
def confirmar_turno(
    turno_id: int, background_tasks: BackgroundTasks
) -> TurnoConfirmado:
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
    token = crear_token_turno(turno.id, turno.sala_id, "visitante", turno.nombre_visitante)
    background_tasks.add_task(enviar_email_confirmacion, turno, inicio, fin, token)

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
    )


@router.post("/agenda/turnos/{turno_id}/acceso-equipo", response_model=AccesoEquipo)
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
