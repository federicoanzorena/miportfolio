export type EstadoSolicitud =
  | "nueva"
  | "en_progreso"
  | "en_revision"
  | "resuelta"
  | "reabierta";

export type TipoEvento =
  | "creacion"
  | "comentario"
  | "estado"
  | "adjunto";

export interface SolicitudCambio {
  id: number;
  cliente_id: string;
  sitio_id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  estado: EstadoSolicitud;
  prioridad: string;
  creado_en: string;
  actualizado_en: string;
}

export interface EventoHistorial {
  id: number;
  solicitud_id: number;
  tipo_evento: TipoEvento;
  estado_anterior: EstadoSolicitud | null;
  estado_nuevo: EstadoSolicitud | null;
  autor: string;
  detalle: string;
  timestamp: string;
}

export interface SolicitudDetalle {
  solicitud: SolicitudCambio;
  eventos: EventoHistorial[];
}

export interface InformacionEstados {
  estados: EstadoSolicitud[];
  transiciones: Record<string, string[]>;
}

export interface TimelineCliente {
  cliente_id: string;
  solicitudes: SolicitudCambio[];
  conteo_por_estado: Record<string, number>;
  eventos: EventoHistorial[];
}

export interface CrearSolicitudPayload {
  cliente_id: string;
  sitio_id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  prioridad: string;
  autor: string;
}

export interface CrearEventoPayload {
  tipo_evento: TipoEvento;
  autor: string;
  detalle: string;
  estado_nuevo?: EstadoSolicitud | null;
}

export type EstadoFiltro = EstadoSolicitud | "todos";
