import { apiUrl } from "@shared/lib/backendBase";
import type {
  CrearEventoPayload,
  CrearSolicitudPayload,
  EventoHistorial,
  InformacionEstados,
  SolicitudCambio,
  SolicitudDetalle,
  TimelineCliente,
} from "./types";

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

const auth = (init: RequestInit = {}): RequestInit => ({
  ...init,
  credentials: "include",
});

export function crearSolicitud(
  datos: CrearSolicitudPayload,
): Promise<SolicitudCambio> {
  return peticion("/api/solicitudes", auth({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }));
}

export function listarSolicitudes(params?: {
  cliente_id?: string;
  estado?: string;
  sitio_id?: string;
}): Promise<SolicitudCambio[]> {
  const query = new URLSearchParams();
  if (params?.cliente_id) query.set("cliente_id", params.cliente_id);
  if (params?.estado) query.set("estado", params.estado);
  if (params?.sitio_id) query.set("sitio_id", params.sitio_id);
  const qs = query.toString();
  return peticion(`/api/solicitudes${qs ? `?${qs}` : ""}`, auth());
}

export function obtenerInformacionEstados(): Promise<InformacionEstados> {
  return peticion("/api/solicitudes/estados", auth());
}

export function obtenerSolicitud(id: number): Promise<SolicitudDetalle> {
  return peticion(`/api/solicitudes/${id}`, auth());
}

export function agregarEvento(
  id: number,
  datos: CrearEventoPayload,
): Promise<EventoHistorial> {
  return peticion(`/api/solicitudes/${id}/eventos`, auth({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  }));
}

export function obtenerTimelineCliente(
  clienteId: string,
): Promise<TimelineCliente> {
  return peticion(`/api/clientes/${clienteId}/timeline`, auth());
}
