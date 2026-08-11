import { KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { content } from "../../data/content";
import type { AccesoEquipo } from "../../types/agenda";
import { accesoEquipo } from "../../utils/agendaApi";
import { SalaDeChat } from "./SalaDeChat";

export function PanelEquipo() {
  const agenda = content.agenda;
  const [turnoId, setTurnoId] = useState("");
  const [acceso, setAcceso] = useState<AccesoEquipo | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conectar = (event: React.FormEvent) => {
    event.preventDefault();
    const id = Number(turnoId);
    if (!Number.isInteger(id) || id <= 0 || cargando) return;

    setCargando(true);
    setError(null);
    accesoEquipo(id)
      .then(setAcceso)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : agenda.equipoError),
      )
      .finally(() => setCargando(false));
  };

  if (acceso) {
    return (
      <div className="space-y-4">
        <SalaDeChat
          salaId={acceso.sala_id}
          token={acceso.token_equipo}
          rol="equipo"
          inicio={acceso.inicio}
          fin={acceso.fin}
        />
        <button
          type="button"
          onClick={() => setAcceso(null)}
          className="focus-ring inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-600"
        >
          {agenda.equipoOtroTurno}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={conectar} className="flex flex-wrap items-end gap-3">
      <div className="min-w-0 flex-1">
        <label
          htmlFor="equipo-turno-id"
          className="mb-1.5 block text-sm font-medium text-zinc-200"
        >
          {agenda.equipoTurnoIdLabel}
        </label>
        <input
          id="equipo-turno-id"
          type="number"
          min={1}
          value={turnoId}
          onChange={(event) => setTurnoId(event.target.value)}
          placeholder={agenda.equipoTurnoIdPlaceholder}
          className="focus-ring w-full rounded-xl border border-line bg-base/60 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-subtle"
        />
      </div>
      <button
        type="submit"
        disabled={cargando || turnoId.trim() === ""}
        className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-zinc-50 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        {cargando ? (
          <Loader2 aria-hidden className="size-4 animate-spin" />
        ) : (
          <KeyRound aria-hidden className="size-4" />
        )}
        {agenda.equipoConectar}
      </button>
      {error ? (
        <p role="alert" className="w-full text-sm text-rose-400">
          {error}
        </p>
      ) : null}
    </form>
  );
}
