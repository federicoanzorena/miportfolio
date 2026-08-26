from datetime import datetime

from sqlmodel import Field, SQLModel


class SolicitudModificacion(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nombre: str
    email: str
    url_sitio: str
    que_cambiar: str
    prioridades: str
    presupuesto: str
    plazos: str
    detalles_tecnicos: str = ""
    fecha: datetime = Field(default_factory=datetime.now)
