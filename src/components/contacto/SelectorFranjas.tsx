import { CalendarDays, Loader2, RefreshCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { content } from "../../data/content";
import type { FranjaHoraria, TurnoConfirmado } from "../../types/agenda";
import {
  confirmarTurno,
  obtenerDisponibilidad,
  reservarTurno,
} from "../../utils/agendaApi";
import { cn } from "../../utils/cn";

interface SelectorFranjasProps {
  onReservado: (turno: TurnoConfirmado) => void;
}

function formatearFecha(iso: string): string {
  const [anio, mes, dia] = iso.split("-").map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(fecha);
}

function formatearHora(hora: string): string {
  return hora.slice(0, 5);
}

export function SelectorFranjas({ onReservado }: SelectorFranjasProps) {
  const agenda = content.agenda;

  const [franjas, setFranjas] = useState<FranjaHoraria[] | null>(null);
  const [error, setError] = useState(false);
  const [seleccionId, setSeleccionId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [errorReserva, setErrorReserva] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    obtenerDisponibilidad()
      .then((lista) => {
        if (activo) setFranjas(lista);
      })
      .catch(() => {
        if (activo) setError(true);
      });
    return () => {
      activo = false;
    };
  }, []);

  const cargar = useCallback(() => {
    setFranjas(null);
    setError(false);
    obtenerDisponibilidad()
      .then(setFranjas)
      .catch(() => setError(true));
  }, []);

  const agrupadas = useMemo(() => {
    if (!franjas) return [];
    const porFecha = new Map<string, FranjaHoraria[]>();
    for (const franja of franjas) {
      const lista = porFecha.get(franja.fecha) ?? [];
      lista.push(franja);
      porFecha.set(franja.fecha, lista);
    }
    return Array.from(porFecha.entries());
  }, [franjas]);

  const seleccionada = franjas?.find((f) => f.id === seleccionId) ?? null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!seleccionada || enviando) return;
    if (!nombre.trim() || !email.trim() || !email.includes("@")) {
      setErrorReserva(agenda.invalidForm);
      return;
    }
    setErrorReserva(null);
    setEnviando(true);
    reservarTurno({
      franja_id: seleccionada.id,
      nombre_visitante: nombre.trim(),
      email_visitante: email.trim(),
    })
      .then((turno) => confirmarTurno(turno.id))
      .then(onReservado)
      .catch((err: unknown) => {
        setErrorReserva(err instanceof Error ? err.message : agenda.error);
      })
      .finally(() => setEnviando(false));
  };

  return (
    <div>
      <p className="flex items-center gap-2 text-sm font-medium text-zinc-100">
        <CalendarDays aria-hidden className="size-4 text-accent-400" />
        {agenda.selectHint}
      </p>

      {error ? (
        <div className="mt-6 rounded-2xl border border-line bg-surface p-6 text-center">
          <p className="text-sm text-muted">{agenda.error}</p>
          <button
            type="button"
            onClick={cargar}
            className="focus-ring mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-600"
          >
            <RefreshCcw aria-hidden className="size-4" />
            {agenda.retry}
          </button>
        </div>
      ) : franjas === null ? (
        <div className="mt-6 grid h-32 place-items-center">
          <Loader2 aria-hidden className="size-6 animate-spin text-accent-400" />
          <span className="sr-only">{agenda.loading}</span>
        </div>
      ) : franjas.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-line bg-surface p-6 text-center text-sm text-muted">
          {agenda.empty}
        </p>
      ) : (
        <div className="mt-6 space-y-6">
          {agrupadas.map(([fecha, lista]) => (
            <section key={fecha} aria-label={formatearFecha(fecha)}>
              <h4 className="text-sm font-semibold capitalize tracking-tight text-zinc-200">
                {formatearFecha(fecha)}
              </h4>
              <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {lista.map((franja) => {
                  const seleccionadaActual = franja.id === seleccionId;
                  return (
                    <li key={franja.id}>
                      <button
                        type="button"
                        aria-pressed={seleccionadaActual}
                        onClick={() => setSeleccionId(franja.id)}
                        className={cn(
                          "focus-ring w-full rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                          seleccionadaActual
                            ? "border-accent-500 bg-accent-500/15 text-accent-300"
                            : "border-line bg-surface text-zinc-200 hover:border-zinc-600",
                        )}
                      >
                        {formatearHora(franja.hora_inicio)} –{" "}
                        {formatearHora(franja.hora_fin)}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="agenda-nombre"
              className="mb-1.5 block text-sm font-medium text-zinc-200"
            >
              {agenda.nombreLabel}
            </label>
            <input
              id="agenda-nombre"
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder={agenda.nombrePlaceholder}
              autoComplete="name"
              className="focus-ring w-full rounded-xl border border-line bg-base/60 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-subtle"
            />
          </div>
          <div>
            <label
              htmlFor="agenda-email"
              className="mb-1.5 block text-sm font-medium text-zinc-200"
            >
              {agenda.emailLabel}
            </label>
            <input
              id="agenda-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={agenda.emailPlaceholder}
              autoComplete="email"
              className="focus-ring w-full rounded-xl border border-line bg-base/60 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-subtle"
            />
          </div>
        </div>

        {errorReserva ? (
          <p role="alert" className="text-sm text-rose-400">
            {errorReserva}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={!seleccionada || enviando}
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-zinc-50 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {enviando ? (
            <Loader2 aria-hidden className="size-4 animate-spin" />
          ) : null}
          {agenda.reservar}
        </button>
      </form>
    </div>
  );
}
