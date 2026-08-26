import asyncio
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .agenda.router import router as agenda_router
from .chat.router import router as chat_router, supervisor_loop
from .database import init_db
from .modificar.router import router as modificar_router
from .sumate.router import router as sumate_router

FRONTEND_ORIGINS = [
    origen.strip()
    for origen in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173",
    ).split(",")
    if origen.strip()
]


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    tarea = asyncio.create_task(supervisor_loop())
    yield
    tarea.cancel()


app = FastAPI(title="binfinito chat", version="0.2.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agenda_router, prefix="/api")
app.include_router(sumate_router, prefix="/api")
app.include_router(modificar_router, prefix="/api")
app.include_router(chat_router)
