import { MessageSquare, Paperclip, Sparkles, ArrowRight } from "lucide-react";
import type { EventoHistorial, TipoEvento } from "../types";
import { cn } from "@shared/lib/cn";

function tiempoRelativo(iso: string): string {
  const fecha = new Date(iso);
  const diffMs = Date.now() - fecha.getTime();
  const minutos = Math.floor(diffMs / 60000);
  if (minutos < 1) return "ahora";
  if (minutos < 60) return `hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  if (dias < 30) return `hace ${dias} d`;
  return fecha.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

const iconos: Record<TipoEvento, typeof MessageSquare> = {
  creacion: Sparkles,
  comentario: MessageSquare,
  estado: ArrowRight,
  adjunto: Paperclip,
};

export interface TimelineProps {
  eventos: EventoHistorial[];
}

export function Timeline({ eventos }: TimelineProps) {
  if (eventos.length === 0) {
    return <p className="text-sm text-muted">Sin actividad todavía.</p>;
  }

  return (
    <ol className="relative space-y-6">
      <span
        aria-hidden
        className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-accent-500/60 via-accent-500/25 to-transparent"
      />
      {eventos.map((ev) => {
        const Icon = iconos[ev.tipo_evento] ?? MessageSquare;
        const esEstado = ev.tipo_evento === "estado";
        return (
          <li key={ev.id} className="relative pl-12">
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-0 grid size-8 place-items-center rounded-full border",
                esEstado
                  ? "border-accent-500/50 bg-base text-accent-400"
                  : "border-line bg-surface-2 text-subtle",
              )}
            >
              <Icon className="size-3.5" />
            </span>
            <div className="rounded-xl border border-line bg-surface/60 p-4">
              {esEstado ? (
                <p className="text-sm text-zinc-100">
                  <span className="font-medium text-accent-400">{ev.estado_anterior}</span>
                  <ArrowRight aria-hidden className="mx-1.5 inline size-3.5 text-subtle" />
                  <span className="font-medium text-zinc-50">{ev.estado_nuevo}</span>
                </p>
              ) : (
                <p className="text-sm text-zinc-100">
                  {ev.detalle ? (
                    ev.detalle
                  ) : (
                    <span className="text-subtle">
                      {ev.tipo_evento === "comentario" ? "Comentario" : "Evento"}
                    </span>
                  )}
                </p>
              )}
              <p className="mt-1.5 text-xs text-subtle">
                {ev.autor ? `${ev.autor} · ` : ""}
                {tiempoRelativo(ev.timestamp)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
