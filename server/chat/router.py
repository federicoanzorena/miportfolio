import asyncio
from datetime import datetime

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlmodel import Session, select

from ..agenda.models import FranjaHoraria, Turno
from ..agenda.utils import (
    marcar_finalizado,
    turno_y_franja_por_id,
    turno_y_franja_por_sala,
    ventana_franja,
)
from ..config import CHAT_BARRE_SEGUNDOS
from ..database import SessionFactory
from ..security import verificar_token
from .manager import manager
from .models import Mensaje, MensajePublic

router = APIRouter()

ESTADOS_PERMITIDOS = ("confirmado",)


def _a_publico(mensaje: Mensaje) -> dict:
    return MensajePublic(
        id=mensaje.id,
        sala_id=mensaje.sala_id,
        contenido=mensaje.contenido,
        autor=mensaje.autor,
        timestamp=mensaje.timestamp,
    ).model_dump(mode="json")


def _cargar_historial(sala_id: str) -> list[dict]:
    with SessionFactory() as session:
        mensajes = session.exec(
            select(Mensaje)
            .where(Mensaje.sala_id == sala_id)
            .order_by(Mensaje.timestamp.asc(), Mensaje.id.asc())
        ).all()
    return [_a_publico(m) for m in mensajes]


def _guardar_mensaje(mensaje: Mensaje) -> dict:
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


@router.websocket("/ws/chat/{sala_id}")
async def chat_websocket(websocket: WebSocket, sala_id: str) -> None:
    await websocket.accept()

    payload = verificar_token(websocket.query_params.get("token"))
    if payload is None:
        await websocket.close(code=4401, reason="token-invalido")
        return

    turno_id = int(payload["sub"])
    resultado = await asyncio.to_thread(turno_y_franja_por_id, turno_id)
    if resultado is None:
        await websocket.close(code=4404, reason="turno-no-encontrado")
        return

    turno, franja = resultado
    if turno.sala_id != sala_id:
        await websocket.close(code=4404, reason="sala-incorrecta")
        return

    rol = payload.get("rol")
    if rol not in ("visitante", "equipo"):
        await websocket.close(code=4401, reason="token-invalido")
        return

    inicio, fin = ventana_franja(franja)
    ahora = datetime.now().astimezone()
    if ahora < inicio:
        await websocket.close(code=4403, reason="turno-no-iniciado")
        return
    if ahora > fin:
        await asyncio.to_thread(marcar_finalizado, turno.id)
        await websocket.close(code=4403, reason="turno-finalizado")
        return

    if turno.estado not in ESTADOS_PERMITIDOS:
        await websocket.close(code=4403, reason="turno-no-confirmado")
        return

    manager.registrar(sala_id, websocket)

    historial = await asyncio.to_thread(_cargar_historial, sala_id)
    await websocket.send_json(
        {
            "tipo": "historial",
            "mensajes": historial,
            "rol": rol,
        }
    )

    try:
        while True:
            data = await websocket.receive_json()
            contenido = (data.get("contenido") or "").strip()
            if not contenido:
                continue

            mensaje = Mensaje(
                sala_id=sala_id,
                contenido=contenido,
                autor=rol,
            )
            publico = await asyncio.to_thread(_guardar_mensaje, mensaje)
            await manager.retransmitir(
                sala_id, {"tipo": "nuevo", "mensaje": publico}
            )
    except WebSocketDisconnect:
        manager.desconectar(sala_id, websocket)
    except Exception:
        manager.desconectar(sala_id, websocket)
