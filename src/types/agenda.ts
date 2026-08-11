export interface FranjaHoraria {
  id: number;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
}

export type TurnoEstado =
  | "pendiente"
  | "confirmado"
  | "cancelado"
  | "finalizado";

export interface Turno {
  id: number;
  franja_id: number;
  nombre_visitante: string;
  email_visitante: string;
  estado: TurnoEstado;
  sala_id: string;
}

export interface TurnoConfirmado extends Turno {
  token_visitante: string;
  inicio: string;
  fin: string;
}

export interface AccesoEquipo {
  sala_id: string;
  token_equipo: string;
  inicio: string;
  fin: string;
}
