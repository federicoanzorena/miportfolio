import asyncio
from datetime import datetime

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from ..agenda.utils import (
    marcar_finalizado,
    turno_y_franja_por_id,
    ventana_franja,
)
from ..security import verificar_token
from . import service
from .manager import manager

router = APIRouter()


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

    if turno.estado not in service.ESTADOS_PERMITIDOS:
        await websocket.close(code=4403, reason="turno-no-confirmado")
        return

    manager.registrar(sala_id, websocket)

    historial = await asyncio.to_thread(service.cargar_historial, sala_id)
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

            publico = await asyncio.to_thread(
                service.guardar_mensaje, sala_id, contenido, rol
            )
            await manager.retransmitir(
                sala_id, {"tipo": "nuevo", "mensaje": publico}
            )
    except WebSocketDisconnect:
        manager.desconectar(sala_id, websocket)
    except Exception:
        manager.desconectar(sala_id, websocket)
