from datetime import datetime
from typing import Any

from fastapi import HTTPException
from sqlmodel import select

from ..database import SessionFactory
from .models import EventoHistorial, SolicitudCambio

ESTADOS = ["nueva", "en_progreso", "en_revision", "resuelta", "reabierta"]

TRANSICIONES: dict[str, set[str]] = {
    "nueva": {"en_progreso"},
    "en_progreso": {"en_revision"},
    "en_revision": {"resuelta"},
    "resuelta": {"reabierta"},
    "reabierta": {"en_progreso"},
}


def transiciones_validas(estado: str | None = None) -> dict[str, Any]:
    if estado:
        return {estado: sorted(TRANSICIONES.get(estado, set()))}
    return {estado_: sorted(validos) for estado_, validos in TRANSICIONES.items()}


def _serializar_solicitud(s: SolicitudCambio) -> dict:
    return {
        "id": s.id,
        "cliente_id": s.cliente_id,
        "sitio_id": s.sitio_id,
        "titulo": s.titulo,
        "descripcion": s.descripcion,
        "tipo": s.tipo,
        "estado": s.estado,
        "prioridad": s.prioridad,
        "creado_en": s.creado_en.isoformat(),
        "actualizado_en": s.actualizado_en.isoformat(),
    }


def _serializar_evento(e: EventoHistorial) -> dict:
    return {
        "id": e.id,
        "solicitud_id": e.solicitud_id,
        "tipo_evento": e.tipo_evento,
        "estado_anterior": e.estado_anterior,
        "estado_nuevo": e.estado_nuevo,
        "autor": e.autor,
        "detalle": e.detalle,
        "timestamp": e.timestamp.isoformat(),
    }


def crear_solicitud(
    cliente_id: str,
    sitio_id: str,
    titulo: str,
    descripcion: str,
    tipo: str,
    prioridad: str,
    autor: str = "",
) -> dict:
    cliente_id = cliente_id.strip()
    sitio_id = sitio_id.strip()
    titulo = titulo.strip()
    if not cliente_id or not sitio_id or not titulo:
        raise HTTPException(status_code=400, detail="cliente_id, sitio_id y titulo son obligatorios")

    solicitud = SolicitudCambio(
        cliente_id=cliente_id,
        sitio_id=sitio_id,
        titulo=titulo,
        descripcion=descripcion.strip(),
        tipo=tipo.strip() or "rediseno",
        prioridad=prioridad.strip() or "media",
        estado="nueva",
    )
    evento = EventoHistorial(
        solicitud_id=0,
        tipo_evento="creacion",
        estado_anterior=None,
        estado_nuevo="nueva",
        autor=autor,
        detalle="Solicitud creada",
    )

    with SessionFactory() as session:
        session.add(solicitud)
        session.flush()
        evento.solicitud_id = solicitud.id or 0
        session.add(evento)
        session.commit()
        session.refresh(solicitud)
        return _serializar_solicitud(solicitud)


def listar_solicitudes(
    cliente_id: str | None = None,
    estado: str | None = None,
    sitio_id: str | None = None,
) -> list[dict]:
    with SessionFactory() as session:
        query = select(SolicitudCambio).order_by(SolicitudCambio.creado_en.desc())
        if cliente_id:
            query = query.where(SolicitudCambio.cliente_id == cliente_id)
        if estado:
            query = query.where(SolicitudCambio.estado == estado)
        if sitio_id:
            query = query.where(SolicitudCambio.sitio_id == sitio_id)
        filas = session.exec(query).all()
        return [_serializar_solicitud(s) for s in filas]


def obtener_solicitud(solicitud_id: int) -> dict:
    with SessionFactory() as session:
        solicitud = session.get(SolicitudCambio, solicitud_id)
        if not solicitud:
            raise HTTPException(status_code=404, detail="Solicitud no encontrada")
        eventos = session.exec(
            select(EventoHistorial)
            .where(EventoHistorial.solicitud_id == solicitud_id)
            .order_by(EventoHistorial.timestamp.asc())
        ).all()
        return {
            "solicitud": _serializar_solicitud(solicitud),
            "eventos": [_serializar_evento(e) for e in eventos],
        }


def agregar_evento(
    solicitud_id: int,
    tipo_evento: str,
    autor: str = "",
    detalle: str = "",
    estado_nuevo: str | None = None,
) -> dict:
    with SessionFactory() as session:
        solicitud = session.get(SolicitudCambio, solicitud_id)
        if not solicitud:
            raise HTTPException(status_code=404, detail="Solicitud no encontrada")

        tipo = tipo_evento.strip().lower()
        if tipo not in {"creacion", "comentario", "estado", "adjunto"}:
            raise HTTPException(status_code=400, detail="tipo_evento inválido")

        estado_anterior: str | None = None
        estado_nuevo_final: str | None = None

        if tipo == "estado":
            if not estado_nuevo:
                raise HTTPException(status_code=400, detail="estado_nuevo requerido para cambio de estado")
            estado_nuevo = estado_nuevo.strip().lower()
            if estado_nuevo not in ESTADOS:
                raise HTTPException(status_code=400, detail=f"Estado inválido: {estado_nuevo}")
            if estado_nuevo not in TRANSICIONES.get(solicitud.estado, set()):
                raise HTTPException(
                    status_code=400,
                    detail=f"Transición no permitida: {solicitud.estado} -> {estado_nuevo}",
                )
            estado_anterior = solicitud.estado
            estado_nuevo_final = estado_nuevo
            solicitud.estado = estado_nuevo
        else:
            estado_nuevo_final = solicitud.estado

        solicitud.actualizado_en = datetime.now()

        evento = EventoHistorial(
            solicitud_id=solicitud_id,
            tipo_evento=tipo,
            estado_anterior=estado_anterior,
            estado_nuevo=estado_nuevo_final,
            autor=autor,
            detalle=detalle.strip(),
        )
        session.add(evento)
        session.commit()
        session.refresh(evento)
        return _serializar_evento(evento)


def timeline_cliente(cliente_id: str) -> dict:
    with SessionFactory() as session:
        solicitudes = session.exec(
            select(SolicitudCambio).where(SolicitudCambio.cliente_id == cliente_id)
        ).all()
        ids = [s.id for s in solicitudes if s.id is not None]
        eventos: list[EventoHistorial] = []
        if ids:
            eventos = session.exec(
                select(EventoHistorial)
                .where(EventoHistorial.solicitud_id.in_(ids))
                .order_by(EventoHistorial.timestamp.asc())
            ).all()

        conteo: dict[str, int] = {estado: 0 for estado in ESTADOS}
        for s in solicitudes:
            conteo[s.estado] = conteo.get(s.estado, 0) + 1

        return {
            "cliente_id": cliente_id,
            "solicitudes": [_serializar_solicitud(s) for s in solicitudes],
            "conteo_por_estado": conteo,
            "eventos": [_serializar_evento(e) for e in eventos],
        }
