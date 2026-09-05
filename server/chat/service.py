import asyncio
from datetime import datetime

from sqlmodel import select

from ..agenda.utils import (
    marcar_finalizado,
    turno_y_franja_por_sala,
    ventana_franja,
)
from ..config import CHAT_BARRE_SEGUNDOS
from ..database import SessionFactory
from .manager import manager
from .models import Mensaje, MensajePublic

ESTADOS_PERMITIDOS = ("confirmado",)


def _a_publico(mensaje: Mensaje) -> dict:
    return MensajePublic(
        id=mensaje.id,
        sala_id=mensaje.sala_id,
        contenido=mensaje.contenido,
        autor=mensaje.autor,
        timestamp=mensaje.timestamp,
    ).model_dump(mode="json")


def cargar_historial(sala_id: str) -> list[dict]:
    with SessionFactory() as session:
        mensajes = session.exec(
            select(Mensaje)
            .where(Mensaje.sala_id == sala_id)
            .order_by(Mensaje.timestamp.asc(), Mensaje.id.asc())
        ).all()
    return [_a_publico(m) for m in mensajes]


def guardar_mensaje(sala_id: str, contenido: str, autor: str) -> dict:
    mensaje = Mensaje(sala_id=sala_id, contenido=contenido, autor=autor)
    with SessionFactory() as session:
        session.add(mensaje)
        session.commit()
        session.refresh(mensaje)
    return _a_publico(mensaje)


async def _barrer_turnos_vencidos() -> None:
    ahora = datetime.now().astimezone()
    for sala_id in manager.salas_activas:
        resultado = await asyncio.to_thread(turno_y_franja_por_sala, sala_id)
        if resultado is None:
            continue
        turno, franja = resultado
        if turno.estado not in ESTADOS_PERMITIDOS:
            continue
        _, fin = ventana_franja(franja)
        if ahora >= fin:
            await asyncio.to_thread(marcar_finalizado, turno.id)
            await manager.cerrar_sala(sala_id, code=4000, reason="turno-finalizado")


async def supervisor_loop() -> None:
    while True:
        await asyncio.sleep(CHAT_BARRE_SEGUNDOS)
        await _barrer_turnos_vencidos()
