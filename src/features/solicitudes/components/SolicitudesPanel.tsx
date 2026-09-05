import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw, ClipboardList, Users } from "lucide-react";
import type {
  InformacionEstados,
  SolicitudCambio,
  SolicitudDetalle as TipoSolicitudDetalle,
  TimelineCliente,
} from "../types";
import {
  listarSolicitudes,
  obtenerInformacionEstados,
  obtenerSolicitud,
  obtenerTimelineCliente,
} from "../api";
import { ClienteTimeline } from "./ClienteTimeline";
import { KanbanBoard } from "./KanbanBoard";
import { SolicitudDetalle } from "./SolicitudDetalle";
import { cn } from "@shared/lib/cn";

type Vista = "kanban" | "cliente";

export function SolicitudesPanel() {
  const [vista, setVista] = useState<Vista>("kanban");
  const [solicitudes, setSolicitudes] = useState<SolicitudCambio[]>([]);
  const [informacionEstados, setInformacionEstados] =
    useState<InformacionEstados | null>(null);
  const [detalle, setDetalle] = useState<TipoSolicitudDetalle | null>(null);
  const [timeline, setTimeline] = useState<TimelineCliente | null>(null);
  const [clienteId, setClienteId] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  const refrescar = useCallback(async () => {
    try {
      const [lista, info] = await Promise.all([
        listarSolicitudes(),
        obtenerInformacionEstados(),
      ]);
      setSolicitudes(lista);
      setInformacionEstados(info);
      setError(false);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    Promise.all([listarSolicitudes(), obtenerInformacionEstados()])
      .then(([lista, info]) => {
        setSolicitudes(lista);
        setInformacionEstados(info);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setCargando(false));
  }, []);

  const abrirDetalle = async (id: number) => {
    try {
      const d = await obtenerSolicitud(id);
      setDetalle(d);
    } catch {
      setError(true);
    }
  };

  const cargarTimeline = async () => {
    if (!clienteId.trim()) return;
    setCargando(true);
    setError(false);
    try {
      const t = await obtenerTimelineCliente(clienteId.trim());
      setTimeline(t);
    } catch {
      setError(true);
    } finally {
      setCargando(false);
    }
  };

  const inputCls =
    "focus-ring w-full rounded-xl border border-line bg-base/60 px-3 py-2 text-sm text-zinc-100 placeholder:text-subtle";

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Rastreador"
          className="inline-flex rounded-full border border-line bg-surface p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={vista === "kanban"}
            onClick={() => setVista("kanban")}
            className={cn(
              "focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              vista === "kanban"
                ? "bg-zinc-50 text-zinc-900"
                : "text-muted hover:text-zinc-100",
            )}
          >
            <ClipboardList aria-hidden className="size-4" />
            Kanban
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={vista === "cliente"}
            onClick={() => setVista("cliente")}
            className={cn(
              "focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              vista === "cliente"
                ? "bg-zinc-50 text-zinc-900"
                : "text-muted hover:text-zinc-100",
            )}
          >
            <Users aria-hidden className="size-4" />
            Por cliente
          </button>
        </div>
        <button
          type="button"
          onClick={refrescar}
          className="focus-ring inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-600"
        >
          <RefreshCw aria-hidden className="size-4" />
          Refrescar
        </button>
      </div>

      {error && !detalle ? (
        <div className="rounded-3xl border border-line bg-surface/70 p-10 text-center">
          <p className="text-sm text-rose-400">No se pudieron cargar las solicitudes.</p>
        </div>
      ) : cargando && !detalle && vista === "kanban" && solicitudes.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-muted">
          <Loader2 aria-hidden className="mr-2 size-5 animate-spin" />
          Cargando…
        </div>
      ) : detalle ? (
        <SolicitudDetalle
          detalle={detalle}
          informacionEstados={informacionEstados}
          onCerrar={() => setDetalle(null)}
          onEventoAgregado={async () => {
            refrescar();
            try {
              const d = await obtenerSolicitud(detalle.solicitud.id);
              setDetalle(d);
            } catch {
              /* noop */
            }
          }}
        />
      ) : vista === "kanban" ? (
        <KanbanBoard solicitudes={solicitudes} onSeleccionar={abrirDetalle} />
      ) : (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              cargarTimeline();
            }}
            className="mb-5 flex max-w-md gap-2"
          >
            <input
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              placeholder="ID del cliente (ej. cli-1)"
              className={inputCls}
            />
            <button
              type="submit"
              className="focus-ring shrink-0 rounded-full bg-zinc-50 px-5 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-white"
            >
              Buscar
            </button>
          </form>
          {timeline ? (
            <ClienteTimeline
              timeline={timeline}
              onSeleccionar={abrirDetalle}
            />
          ) : (
            <p className="text-sm text-muted">
              Ingresá un ID de cliente para ver su actividad.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
