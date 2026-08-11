from datetime import datetime, timezone

from sqlmodel import Field, SQLModel


class MensajeBase(SQLModel):
    sala_id: str = Field(index=True)
    contenido: str
    autor: str = Field(description="visitante o equipo")


class Mensaje(MensajeBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class MensajePublic(MensajeBase):
    id: int
    timestamp: datetime
