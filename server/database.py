import os
from collections.abc import Generator

from sqlalchemy.orm import sessionmaker
from sqlmodel import Session, SQLModel, create_engine

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./binfinito.db")

engine_kwargs: dict = {}
if DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, pool_pre_ping=True, **engine_kwargs)

SessionFactory = sessionmaker(bind=engine, class_=Session, expire_on_commit=False)


def init_db() -> None:
    from .agenda.models import FranjaHoraria, Turno
    from .chat.models import Mensaje
    from .modificar.models import SolicitudModificacion
    from .sumate.models import SolicitudSumate

    SQLModel.metadata.create_all(engine)


def get_session() -> Generator:
    with SessionFactory() as session:
        yield session
