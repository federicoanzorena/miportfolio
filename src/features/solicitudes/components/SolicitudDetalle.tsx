import { useState } from "react";
import { Loader2, X } from "lucide-react";
import type {
  EstadoSolicitud,
  InformacionEstados,
  SolicitudDetalle,
  TipoEvento,
} from "../types";
import { agregarEvento } from "../api";
import { cn } from "@shared/lib/cn";
import { Timeline } from "./Timeline";
import { estadoClases } from "./estadoStyles";

interface SolicitudDetalleProps {
  detalle: SolicitudDetalle;
  informacionEstados: InformacionEstados | null;
  onCerrar: () => void;
  onEventoAgregado: () => void;
}

export function SolicitudDetalle({
  detalle,
  informacionEstados,
  onCerrar,
  onEventoAgregado,
}: SolicitudDetalleProps) {
  const { solicitud, eventos } = detalle;

  const [tipo, setTipo] = useState<TipoEvento>("comentario");
  const [detalleTexto, setDetalleTexto] = useState("");
  const [estadoNuevo, setEstadoNuevo] = useState<EstadoSolicitud | "">("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transiciones =
    informacionEstados?.transiciones[solicitud.estado] ?? [];

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (enviando) return;
    setError(null);

    if (tipo === "estado" && !estadoNuevo) {
      setError("Seleccioná un estado de destino.");
      return;
    }
    if (tipo !== "estado" && !detalleTexto.trim()) {
      setError("Completá el detalle.");
      return;
    }

    setEnviando(true);
    try {
      await agregarEvento(solicitud.id, {
        tipo_evento: tipo,
        autor: "equipo",
        detalle: detalleTexto.trim(),
        estado_nuevo: tipo === "estado" ? (estadoNuevo as EstadoSolicitud) : null,
      });
      setTipo("comentario");
      setDetalleTexto("");
      setEstadoNuevo("");
      onEventoAgregado();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el evento.");
    } finally {
      setEnviando(false);
    }
  };

  const inputCls =
    "focus-ring w-full rounded-xl border border-line bg-base/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-subtle";

  return (
    <div className="rounded-3xl border border-line bg-surface/70 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className={cn("mb-2 inline-block rounded-full px-3 py-1 text-xs font-medium", estadoClases(solicitud.estado))}>
            {solicitud.estado.replace("_", " ")}
          </span>
          <h3 className="text-lg font-semibold tracking-tight text-zinc-50">
            {solicitud.titulo}
          </h3>
          <p className="mt-1 text-sm text-muted">
            Cliente: <span className="text-zinc-200">{solicitud.cliente_id}</span>
            {" · "}
            Sitio: <span className="text-zinc-200">{solicitud.sitio_id}</span>
            {" · "}
            Prioridad: <span className="text-zinc-200">{solicitud.prioridad}</span>
          </p>
          {solicitud.descripcion ? (
            <p className="mt-2 text-sm text-muted">{solicitud.descripcion}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar detalle"
          className="focus-ring rounded-full border border-line bg-surface p-2 text-subtle transition-colors hover:text-zinc-100"
        >
          <X aria-hidden className="size-4" />
        </button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_260px]">
        <div>
          <h4 className="mb-3 text-sm font-medium uppercase tracking-widest text-subtle">
            Historial
          </h4>
          <Timeline eventos={eventos} />
        </div>

        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-line bg-base/40 p-4">
          <p className="text-sm font-medium text-zinc-100">Agregar evento</p>

          <div className="flex gap-2">
            {(["comentario", "estado", "adjunto"] as TipoEvento[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTipo(t);
                  setError(null);
                }}
                className={cn(
                  "focus-ring rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  tipo === t
                    ? "border-accent-500 bg-accent-500/15 text-accent-300"
                    : "border-line bg-surface text-muted hover:text-zinc-100",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {tipo === "estado" ? (
            <div>
              <label className="mb-1 block text-xs text-subtle" htmlFor="estado-nuevo">
                Ir a
              </label>
              <select
                id="estado-nuevo"
                value={estadoNuevo}
                onChange={(e) => setEstadoNuevo(e.target.value as EstadoSolicitud)}
                className={inputCls}
              >
                <option value="">Seleccionar…</option>
                {transiciones.map((e) => (
                  <option key={e} value={e}>
                    {e.replace("_", " ")}
                  </option>
                ))}
              </select>
              {transiciones.length === 0 ? (
                <p className="mt-1 text-xs text-subtle">
                  Sin transiciones válidas desde este estado.
                </p>
              ) : null}
            </div>
          ) : (
            <textarea
              rows={3}
              value={detalleTexto}
              onChange={(e) => setDetalleTexto(e.target.value)}
              placeholder={
                tipo === "adjunto"
                  ? "Nombre o URL del archivo…"
                  : "Escribí un comentario…"
              }
              className={inputCls + " resize-none"}
            />
          )}

          {error ? <p role="alert" className="text-xs text-rose-400">{error}</p> : null}

          <button
            type="submit"
            disabled={enviando}
            className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {enviando ? (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            ) : null}
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}
