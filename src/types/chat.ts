export type ChatRol = "visitante" | "equipo";

export type ChatConnectionState =
  | "conectando"
  | "conectado"
  | "reconectando"
  | "desconectado";

export interface ChatMensaje {
  id: number;
  sala_id: string;
  contenido: string;
  autor: ChatRol;
  timestamp: string;
}

export interface ChatHistorialPayload {
  tipo: "historial";
  mensajes: ChatMensaje[];
  rol: ChatRol;
}

export interface ChatNuevoPayload {
  tipo: "nuevo";
  mensaje: ChatMensaje;
}

export type ChatServerPayload = ChatHistorialPayload | ChatNuevoPayload;
