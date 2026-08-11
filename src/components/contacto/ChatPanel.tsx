import { useReducedMotion } from "framer-motion";
import { Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { content } from "../../data/content";
import { useWebSocket } from "../../hooks/useWebSocket";
import type { ChatConnectionState, ChatMensaje, ChatRol } from "../../types/chat";
import { cn } from "../../utils/cn";

interface ChatPanelProps {
  salaId: string;
  token: string;
  miRol: ChatRol;
}

function formatearHora(iso: string): string {
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return "";
  return fecha.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function colorEstado(estado: ChatConnectionState): string {
  switch (estado) {
    case "conectado":
      return "bg-emerald-500";
    case "desconectado":
      return "bg-zinc-500";
    default:
      return "bg-amber-400";
  }
}

export function ChatPanel({ salaId, token, miRol }: ChatPanelProps) {
  const chat = content.chat;
  const reduceMotion = useReducedMotion();

  const [mensajes, setMensajes] = useState<ChatMensaje[]>([]);
  const [texto, setTexto] = useState("");
  const listaRef = useRef<HTMLOListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onMensaje = useCallback((mensaje: ChatMensaje) => {
    setMensajes((prev) =>
      prev.some((m) => m.id === mensaje.id) ? prev : [...prev, mensaje],
    );
  }, []);

  const onHistorial = useCallback((payload: { mensajes: ChatMensaje[] }) => {
    setMensajes(payload.mensajes);
  }, []);

  const { estado, enviarMensaje } = useWebSocket({
    salaId,
    token,
    onMensaje,
    onHistorial,
  });

  useEffect(() => {
    const lista = listaRef.current;
    if (!lista) return;
    lista.scrollTo({
      top: lista.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [mensajes, estado, reduceMotion]);

  const conectado = estado === "conectado";

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!conectado || texto.trim() === "") return;
    enviarMensaje(texto);
    setTexto("");
    inputRef.current?.focus();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface/70 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-zinc-100">
            {chat.title}
          </h3>
          <p className="mt-0.5 text-xs text-muted">{chat.description}</p>
        </div>
        <p
          role="status"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted"
        >
          <span
            aria-hidden
            className={cn("size-2 rounded-full", colorEstado(estado))}
          />
          {chat.status[estado]}
        </p>
      </div>

      <ol
        ref={listaRef}
        role="log"
        aria-label={chat.historyLabel}
        aria-live="polite"
        className="h-80 space-y-4 overflow-y-auto px-5 py-4"
      >
        {mensajes.length === 0 ? (
          <li className="grid h-full place-items-center text-sm text-muted">
            {chat.empty}
          </li>
        ) : (
          mensajes.map((mensaje) => {
            const propio = mensaje.autor === miRol;
            return (
              <li
                key={mensaje.id}
                className={cn(
                  "flex flex-col",
                  propio ? "items-end" : "items-start",
                )}
              >
                <span className="mb-1 px-1 text-[11px] text-subtle">
                  {mensaje.autor === "equipo" ? "Equipo" : "Visitante"} ·{" "}
                  {formatearHora(mensaje.timestamp)}
                </span>
                <p
                  className={cn(
                    "max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-sm leading-relaxed",
                    propio
                      ? "rounded-br-md bg-accent-600 text-white"
                      : "rounded-bl-md bg-elevated text-zinc-100",
                  )}
                >
                  {mensaje.contenido}
                </p>
              </li>
            );
          })
        )}
      </ol>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-line p-3"
      >
        <label htmlFor="chat-input" className="sr-only">
          {chat.inputLabel}
        </label>
        <input
          id="chat-input"
          ref={inputRef}
          type="text"
          value={texto}
          onChange={(event) => setTexto(event.target.value)}
          placeholder={chat.inputPlaceholder}
          autoComplete="off"
          maxLength={1000}
          className="focus-ring w-full rounded-xl border border-line bg-base/60 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-subtle"
        />
        <button
          type="submit"
          disabled={!conectado || texto.trim() === ""}
          aria-label={chat.send}
          className="focus-ring grid size-10 shrink-0 place-items-center rounded-xl bg-zinc-50 text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Send aria-hidden className="size-4" />
        </button>
      </form>
    </div>
  );
}
