from fastapi import APIRouter, BackgroundTasks

from . import service
from .models import (
    AccesoEquipo,
    FranjaCreate,
    FranjaPublic,
    TurnoConfirmado,
    TurnoCreate,
    TurnoPublic,
)

router = APIRouter()


@router.get("/agenda/disponibilidad", response_model=list[FranjaPublic])
def disponibilidad() -> list[FranjaPublic]:
    return service.franjas_disponibles()


@router.post("/agenda/franjas", response_model=FranjaPublic, status_code=201)
def crear_franja(body: FranjaCreate) -> FranjaPublic:
    return service.crear_franja(body.fecha, body.hora_inicio, body.hora_fin)


@router.post("/agenda/turnos", response_model=TurnoPublic, status_code=201)
def reservar_turno(body: TurnoCreate) -> TurnoPublic:
    return service.reservar_turno(
        body.franja_id, body.nombre_visitante, body.email_visitante
    )


@router.post(
    "/agenda/turnos/{turno_id}/confirmar", response_model=TurnoConfirmado
)
def confirmar_turno(
    turno_id: int, background_tasks: BackgroundTasks
) -> TurnoConfirmado:
    resultado, enviar_email = service.confirmar_turno(turno_id)
    background_tasks.add_task(enviar_email)
    return resultado


@router.post("/agenda/turnos/{turno_id}/acceso-equipo", response_model=AccesoEquipo)
def acceso_equipo(turno_id: int) -> AccesoEquipo:
    return service.acceso_equipo(turno_id)
