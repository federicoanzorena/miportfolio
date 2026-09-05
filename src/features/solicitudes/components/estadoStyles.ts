import type { EstadoSolicitud } from "../types";

export function estadoClases(estado: EstadoSolicitud): string {
  switch (estado) {
    case "nueva":
      return "bg-sky-500/15 text-sky-300";
    case "en_progreso":
      return "bg-amber-500/15 text-amber-300";
    case "en_revision":
      return "bg-violet-500/15 text-violet-300";
    case "resuelta":
      return "bg-emerald-500/15 text-emerald-300";
    case "reabierta":
      return "bg-rose-500/15 text-rose-300";
    default:
      return "bg-zinc-500/15 text-zinc-300";
  }
}
