import type {
  AccesoEquipo,
  FranjaHoraria,
  Turno,
  TurnoConfirmado,
} from "../types/agenda";
import { apiUrl } from "./backendBase";

async function peticion<T>(ruta: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(ruta), init);
  if (!response.ok) {
    let detalle = `Error ${response.status}`;
    try {
      const body = (await response.json()) as { detail?: string };
      detalle = body.detail ?? detalle;
    } catch {
      // respuesta sin cuerpo JSON
    }
    throw new Error(detalle);
  }
  return (await response.json()) as T;
}

export function obtenerDisponibilidad(): Promise<FranjaHoraria[]> {
  return peticion("/api/agenda/disponibilidad");
}

export function reservarTurno(datos: {
  franja_id: number;
  nombre_visitante: string;
  email_visitante: string;
}): Promise<Turno> {
  return peticion("/api/agenda/turnos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
}

export function confirmarTurno(turnoId: number): Promise<TurnoConfirmado> {
  return peticion(`/api/agenda/turnos/${turnoId}/confirmar`, {
    method: "POST",
  });
}

export function accesoEquipo(turnoId: number): Promise<AccesoEquipo> {
  return peticion(`/api/agenda/turnos/${turnoId}/acceso-equipo`, {
    method: "POST",
  });
}
