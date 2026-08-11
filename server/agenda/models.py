from datetime import date, datetime, time

from sqlmodel import Field, SQLModel


class FranjaHoraria(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    fecha: date
    hora_inicio: time
    hora_fin: time
    disponible: bool = True


class Turno(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    franja_id: int = Field(foreign_key="franjahoraria.id")
    nombre_visitante: str
    email_visitante: str
    estado: str = "pendiente"
    sala_id: str = Field(index=True)


class FranjaPublic(SQLModel):
    id: int
    fecha: date
    hora_inicio: time
    hora_fin: time


class FranjaCreate(SQLModel):
    fecha: date
    hora_inicio: time
    hora_fin: time


class TurnoCreate(SQLModel):
    franja_id: int
    nombre_visitante: str
    email_visitante: str


class TurnoPublic(SQLModel):
    id: int
    franja_id: int
    nombre_visitante: str
    email_visitante: str
    estado: str
    sala_id: str


class TurnoConfirmado(TurnoPublic):
    token_visitante: str
    inicio: datetime
    fin: datetime


class AccesoEquipo(SQLModel):
    sala_id: str
    token_equipo: str
    inicio: datetime
    fin: datetime
