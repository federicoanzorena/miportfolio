from fastapi import APIRouter, Depends, Query

from ..security import _exigir_admin
from . import service
from .schemas import EventoCreate, SolicitudCreate

router = APIRouter()


@router.post("/solicitudes", dependencies=[Depends(_exigir_admin)], status_code=201)
def crear_solicitud(body: SolicitudCreate) -> dict:
    return service.crear_solicitud(
        cliente_id=body.cliente_id,
        sitio_id=body.sitio_id,
        titulo=body.titulo,
        descripcion=body.descripcion,
        tipo=body.tipo,
        prioridad=body.prioridad,
        autor=body.autor,
    )


@router.get("/solicitudes", dependencies=[Depends(_exigir_admin)])
def listar_solicitudes(
    cliente_id: str | None = Query(default=None),
    estado: str | None = Query(default=None),
    sitio_id: str | None = Query(default=None),
) -> list[dict]:
    return service.listar_solicitudes(
        cliente_id=cliente_id, estado=estado, sitio_id=sitio_id
    )


@router.get("/solicitudes/estados", dependencies=[Depends(_exigir_admin)])
def obtener_estados(estado: str | None = Query(default=None)) -> dict:
    return {
        "estados": service.ESTADOS,
        "transiciones": service.transiciones_validas(estado),
    }


@router.get("/solicitudes/{solicitud_id}", dependencies=[Depends(_exigir_admin)])
def obtener_solicitud(solicitud_id: int) -> dict:
    return service.obtener_solicitud(solicitud_id)


@router.post(
    "/solicitudes/{solicitud_id}/eventos",
    dependencies=[Depends(_exigir_admin)],
    status_code=201,
)
def agregar_evento(solicitud_id: int, body: EventoCreate) -> dict:
    return service.agregar_evento(
        solicitud_id=solicitud_id,
        tipo_evento=body.tipo_evento,
        autor=body.autor,
        detalle=body.detalle,
        estado_nuevo=body.estado_nuevo,
    )


@router.get("/clientes/{cliente_id}/timeline", dependencies=[Depends(_exigir_admin)])
def obtener_timeline_cliente(cliente_id: str) -> dict:
    return service.timeline_cliente(cliente_id)
