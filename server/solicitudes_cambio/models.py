from datetime import datetime

from sqlmodel import Field, SQLModel


class SolicitudCambio(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    cliente_id: str
    sitio_id: str
    titulo: str
    descripcion: str
    tipo: str
    estado: str = "nueva"
    prioridad: str = "media"
    creado_en: datetime = Field(default_factory=datetime.now)
    actualizado_en: datetime = Field(default_factory=datetime.now)


class EventoHistorial(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    solicitud_id: int = Field(foreign_key="solicitudcambio.id")
    tipo_evento: str
    estado_anterior: str | None = None
    estado_nuevo: str | None = None
    autor: str
    detalle: str = ""
    timestamp: datetime = Field(default_factory=datetime.now)
