import type { EstadoSolicitud, SolicitudCambio } from "../types";
import { cn } from "@shared/lib/cn";
import { estadoClases } from "./estadoStyles";

const COLUMNAS: EstadoSolicitud[] = [
  "nueva",
  "en_progreso",
  "en_revision",
  "reabierta",
  "resuelta",
];

interface KanbanBoardProps {
  solicitudes: SolicitudCambio[];
  onSeleccionar: (id: number) => void;
}

export function KanbanBoard({ solicitudes, onSeleccionar }: KanbanBoardProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {COLUMNAS.map((estado) => {
        const items = solicitudes.filter((s) => s.estado === estado);
        return (
          <div
            key={estado}
            className="flex flex-col rounded-2xl border border-line bg-base/40 p-3"
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", estadoClases(estado))}>
                {estado.replace("_", " ")}
              </span>
              <span className="text-xs text-subtle">{items.length}</span>
            </div>
            <div className="flex flex-1 flex-col gap-2">
              {items.length === 0 ? (
                <p className="px-1 py-3 text-center text-xs text-subtle">Vacío</p>
              ) : (
                items.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSeleccionar(s.id)}
                    className="focus-ring rounded-xl border border-line bg-surface p-3 text-left transition-colors hover:border-zinc-600"
                  >
                    <p className="text-sm font-medium text-zinc-100">{s.titulo}</p>
                    <p className="mt-1 text-xs text-subtle">
                      {s.cliente_id} · {s.prioridad}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
