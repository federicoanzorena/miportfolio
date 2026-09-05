import type { EstadoSolicitud, TimelineCliente } from "../types";
import { Timeline } from "./Timeline";
import { estadoClases } from "./estadoStyles";

interface ClienteTimelineProps {
  timeline: TimelineCliente;
  onSeleccionar: (id: number) => void;
}

const ORDEN_ESTADOS: EstadoSolicitud[] = [
  "nueva",
  "en_progreso",
  "en_revision",
  "reabierta",
  "resuelta",
];

export function ClienteTimeline({ timeline, onSeleccionar }: ClienteTimelineProps) {
  const total = timeline.solicitudes.length;

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="space-y-4">
        <div className="rounded-2xl border border-line bg-surface/70 p-5">
          <p className="text-sm text-subtle">Cliente</p>
          <p className="mt-1 font-semibold text-zinc-50">{timeline.cliente_id}</p>
          <p className="mt-3 text-sm text-subtle">
            Solicitudes: <span className="font-medium text-zinc-100">{total}</span>
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface/70 p-5">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-subtle">
            Por estado
          </p>
          <ul className="space-y-2">
            {ORDEN_ESTADOS.map((estado) => (
              <li key={estado} className="flex items-center justify-between text-sm">
                <span className={estadoClases(estado)}>
                  {estado.replace("_", " ")}
                </span>
                <span className="text-zinc-200">
                  {timeline.conteo_por_estado[estado] ?? 0}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-surface/70 p-5">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-subtle">
            Solicitudes
          </p>
          <ul className="space-y-2">
            {timeline.solicitudes.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onSeleccionar(s.id)}
                  className="focus-ring w-full rounded-lg border border-line bg-base/40 p-2.5 text-left text-sm text-zinc-100 transition-colors hover:border-zinc-600"
                >
                  {s.titulo}
                </button>
              </li>
            ))}
            {timeline.solicitudes.length === 0 ? (
              <li className="text-sm text-subtle">Sin solicitudes.</li>
            ) : null}
          </ul>
        </div>
      </aside>

      <div className="rounded-2xl border border-line bg-surface/40 p-5">
        <h4 className="mb-4 text-sm font-medium uppercase tracking-widest text-subtle">
          Actividad del cliente
        </h4>
        <Timeline eventos={timeline.eventos} />
      </div>
    </div>
  );
}
