from datetime import datetime

from sqlmodel import Field, SQLModel


class SolicitudSumate(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str
    email: str
    fecha: datetime = Field(default_factory=datetime.now)
