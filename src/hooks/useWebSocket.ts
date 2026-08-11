import { useCallback, useEffect, useRef, useState } from "react";
import type {
  ChatConnectionState,
  ChatMensaje,
  ChatRol,
  ChatServerPayload,
} from "../types/chat";
import { wsUrl } from "../utils/backendBase";

interface UseWebSocketOptions {
  salaId: string;
  token: string | null;
  onMensaje: (mensaje: ChatMensaje) => void;
  onHistorial: (payload: { mensajes: ChatMensaje[]; rol: ChatRol }) => void;
}

interface UseWebSocketResult {
  estado: ChatConnectionState;
  enviarMensaje: (contenido: string) => void;
}

export function useWebSocket({
  salaId,
  token,
  onMensaje,
  onHistorial,
}: UseWebSocketOptions): UseWebSocketResult {
  const [estado, setEstado] = useState<ChatConnectionState>(
    token ? "conectando" : "desconectado",
  );

  const [clave, setClave] = useState({ salaId, token });
  if (clave.salaId !== salaId || clave.token !== token) {
    setClave({ salaId, token });
    setEstado(token ? "conectando" : "desconectado");
  }

  const socketRef = useRef<WebSocket | null>(null);
  const onMensajeRef = useRef(onMensaje);
  const onHistorialRef = useRef(onHistorial);

  useEffect(() => {
    onMensajeRef.current = onMensaje;
    onHistorialRef.current = onHistorial;
  });

  useEffect(() => {
    if (!token) {
      return;
    }

    let disposed = false;
    let socket: WebSocket | null = null;
    let timer: number | undefined;
    let reintentos = 0;

    const conectar = () => {
      if (disposed) return;

      socket = new WebSocket(wsUrl(salaId, token));
      socketRef.current = socket;

      socket.onopen = () => {
        reintentos = 0;
        setEstado("conectado");
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as ChatServerPayload;
          if (payload.tipo === "historial") {
            onHistorialRef.current({
              mensajes: payload.mensajes,
              rol: payload.rol,
            });
          } else {
            onMensajeRef.current(payload.mensaje);
          }
        } catch {
          // frame no JSON: se ignora
        }
      };

      socket.onclose = () => {
        socketRef.current = null;
        socket = null;
        if (disposed) return;
        setEstado("reconectando");
        const espera = Math.min(1000 * 2 ** reintentos, 10000);
        reintentos += 1;
        timer = window.setTimeout(conectar, espera);
      };

      socket.onerror = () => {
        socket?.close();
      };
    };

    conectar();

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      socket?.close();
      socketRef.current = null;
    };
  }, [salaId, token]);

  const enviarMensaje = useCallback((contenido: string) => {
    const texto = contenido.trim();
    if (!texto) return;

    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ contenido: texto }));
    }
  }, []);

  return { estado, enviarMensaje };
}
