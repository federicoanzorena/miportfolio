from collections import defaultdict

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        self._salas: dict[str, set[WebSocket]] = defaultdict(set)

    @property
    def salas_activas(self) -> tuple[str, ...]:
        return tuple(self._salas.keys())

    def registrar(self, sala_id: str, websocket: WebSocket) -> None:
        self._salas[sala_id].add(websocket)

    def desconectar(self, sala_id: str, websocket: WebSocket) -> None:
        self._salas[sala_id].discard(websocket)
        if not self._salas[sala_id]:
            del self._salas[sala_id]

    async def retransmitir(self, sala_id: str, mensaje: dict) -> None:
        for websocket in list(self._salas[sala_id]):
            try:
                await websocket.send_json(mensaje)
            except Exception:
                self.desconectar(sala_id, websocket)

    async def cerrar_sala(self, sala_id: str, code: int = 4000, reason: str = "") -> None:
        conexiones = self._salas.pop(sala_id, set())
        for websocket in conexiones:
            try:
                await websocket.close(code=code, reason=reason)
            except Exception:
                pass


manager = ConnectionManager()
