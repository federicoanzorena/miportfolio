import argparse
import sys
from datetime import date, datetime, time, timedelta

from sqlmodel import select

from ..database import SessionFactory, init_db
from .models import FranjaHoraria

HORARIOS_EJEMPLO = [
    (time(10, 0), time(10, 30)),
    (time(15, 0), time(15, 30)),
    (time(17, 0), time(17, 30)),
]
DIAS_EJEMPLO = 5


def _parsear_franja(valores: list[str]) -> tuple[date, time, time]:
    fecha, hora_inicio, hora_fin = valores
    try:
        dia = datetime.strptime(fecha, "%Y-%m-%d").date()
    except ValueError:
        raise SystemExit(f"Fecha inválida: {fecha!r} (formato YYYY-MM-DD)")
    try:
        inicio = datetime.strptime(hora_inicio, "%H:%M").time()
    except ValueError:
        raise SystemExit(f"Hora de inicio inválida: {hora_inicio!r} (formato HH:MM)")
    try:
        fin = datetime.strptime(hora_fin, "%H:%M").time()
    except ValueError:
        raise SystemExit(f"Hora de fin inválida: {hora_fin!r} (formato HH:MM)")
    if inicio >= fin:
        raise SystemExit(
            f"hora_inicio debe ser anterior a hora_fin: {inicio} >= {fin}"
        )
    return dia, inicio, fin


def _proximos_dias_habiles(cantidad: int) -> list[date]:
    dias: list[date] = []
    cursor = date.today()
    while len(dias) < cantidad:
        cursor += timedelta(days=1)
        if cursor.weekday() < 5:
            dias.append(cursor)
    return dias


def _existe(session, fecha: date, inicio: time, fin: time) -> bool:
    return (
        session.exec(
            select(FranjaHoraria).where(
                FranjaHoraria.fecha == fecha,
                FranjaHoraria.hora_inicio == inicio,
                FranjaHoraria.hora_fin == fin,
            )
        ).first()
        is not None
    )


def _crear(args: argparse.Namespace) -> None:
    modo_ejemplo = args.franja is None
    if modo_ejemplo:
        bloques = [
            (dia, inicio, fin)
            for dia in _proximos_dias_habiles(DIAS_EJEMPLO)
            for inicio, fin in HORARIOS_EJEMPLO
        ]
    else:
        bloques = [_parsear_franja(bloque) for bloque in args.franja]

    init_db()
    creadas = 0
    existentes = 0
    with SessionFactory() as session:
        for fecha, inicio, fin in bloques:
            if _existe(session, fecha, inicio, fin):
                existentes += 1
                print(f"  ya existía: {fecha} {inicio:%H:%M}–{fin:%H:%M}")
                continue
            session.add(
                FranjaHoraria(
                    fecha=fecha,
                    hora_inicio=inicio,
                    hora_fin=fin,
                    disponible=True,
                )
            )
            creadas += 1
            print(f"  creada:     {fecha} {inicio:%H:%M}–{fin:%H:%M}")
        session.commit()

    print(f"\nResumen: {creadas} franjas creadas, {existentes} ya existían")
    if modo_ejemplo:
        print(
            "⚠ Modo ejemplo: se crearon franjas de prueba, no es una carga real "
            "de agenda."
        )


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Crea franjas horarias disponibles para el chat de contacto.",
    )
    parser.add_argument(
        "--franja",
        nargs=3,
        action="append",
        metavar=("FECHA", "INICIO", "FIN"),
        help="Bloque fecha/hora (formato FECHA=YYYY-MM-DD, INICIO/FIN=HH:MM). "
        "Se puede repetir para crear varias franjas.",
    )
    args = parser.parse_args()
    if args.franja is None:
        print(
            "Sin --franja: modo ejemplo con franjas de prueba en los próximos "
            f"{DIAS_EJEMPLO} días hábiles.\n"
        )
    try:
        _crear(args)
    except SystemExit as error:
        print(error, file=sys.stderr)
        raise


if __name__ == "__main__":
    main()
