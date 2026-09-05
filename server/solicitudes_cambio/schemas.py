from pydantic import BaseModel


class SolicitudCreate(BaseModel):
    cliente_id: str
    sitio_id: str
    titulo: str
    descripcion: str = ""
    tipo: str = "rediseno"
    prioridad: str = "media"
    autor: str = ""


class EventoCreate(BaseModel):
    tipo_evento: str
    autor: str = ""
    detalle: str = ""
    estado_nuevo: str | None = None
