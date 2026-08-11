import { Check, CircleCheck, Clock3, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { content } from "../../data/content";
import type { ChatRol } from "../../types/chat";
import { ChatPanel } from "./ChatPanel";

interface SalaDeChatProps {
  salaId: string;
  token: string;
  rol: ChatRol;
  inicio: string;
  fin: string;
}

interface Restante {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}

function calcularRestante(ms: number): Restante {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    dias: Math.floor(total / 86400),
    horas: Math.floor((total % 86400) / 3600),
    minutos: Math.floor((total % 3600) / 60),
    segundos: total % 60,
  };
}

function dosDigitos(n: number): string {
  return String(n).padStart(2, "0");
}

function useCopiar(valor: string) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard?.writeText(valor);
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      // portapapeles no disponible
    }
  };

  return { copiado, copiar };
}

function FilaAcceso({
  etiqueta,
  valor,
  copiado,
  copiar,
}: {
  etiqueta: string;
  valor: string;
  copiado: boolean;
  copiar: () => void;
}) {
  const agenda = content.agenda;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="min-w-0">
        <dt className="text-[11px] font-medium uppercase tracking-wider text-subtle">
          {etiqueta}
        </dt>
        <dd className="truncate font-mono text-xs text-zinc-200">{valor}</dd>
      </div>
      <button
        type="button"
        onClick={copiar}
        className="focus-ring inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs font-medium text-zinc-100 transition-colors hover:border-zinc-600"
      >
        {copiado ? (
          <Check aria-hidden className="size-3.5 text-emerald-400" />
        ) : (
          <Copy aria-hidden className="size-3.5" />
        )}
        {copiado ? agenda.copiado : agenda.copiar}
      </button>
    </div>
  );
}

function InfoAcceso({ salaId, token }: { salaId: string; token: string }) {
  const agenda = content.agenda;
  const sala = useCopiar(salaId);
  const clave = useCopiar(token);

  return (
    <div className="rounded-2xl border border-line bg-base/50 p-4">
      <p className="text-sm font-medium text-zinc-100">
        {agenda.reservadoTitle}
      </p>
      <p className="mt-1 text-xs text-muted">{agenda.reservadoDescription}</p>
      <dl className="mt-4 space-y-2">
        <FilaAcceso
          etiqueta={agenda.salaLabel}
          valor={salaId}
          copiado={sala.copiado}
          copiar={sala.copiar}
        />
        <FilaAcceso
          etiqueta={agenda.tokenLabel}
          valor={token}
          copiado={clave.copiado}
          copiar={clave.copiar}
        />
      </dl>
    </div>
  );
}

function CajaTiempo({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  return (
    <div className="flex min-w-16 flex-col items-center rounded-xl border border-line bg-base/60 px-3 py-2.5">
      <span className="font-mono text-xl font-semibold text-zinc-50">
        {valor}
      </span>
      <span className="mt-0.5 text-[10px] uppercase tracking-wider text-subtle">
        {etiqueta}
      </span>
    </div>
  );
}

function Espera({ inicio }: { inicio: number }) {
  const chat = content.chat;
  const [ahora, setAhora] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setAhora(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const restante = calcularRestante(inicio - ahora);

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 text-center">
      <Clock3 aria-hidden className="mx-auto size-6 text-accent-400" />
      <p className="mt-3 text-sm font-medium text-zinc-100">
        {chat.countdownTitle}
      </p>
      <p className="mt-1 text-xs text-muted">{chat.countdownDescription}</p>
      <div
        role="timer"
        aria-label={chat.countdownTitle}
        className="mt-5 flex justify-center gap-2"
      >
        {restante.dias > 0 ? (
          <CajaTiempo valor={String(restante.dias)} etiqueta={chat.dias} />
        ) : null}
        <CajaTiempo valor={dosDigitos(restante.horas)} etiqueta={chat.horas} />
        <CajaTiempo
          valor={dosDigitos(restante.minutos)}
          etiqueta={chat.minutos}
        />
        <CajaTiempo
          valor={dosDigitos(restante.segundos)}
          etiqueta={chat.segundos}
        />
      </div>
    </div>
  );
}

function Finalizado() {
  const chat = content.chat;

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 text-center">
      <CircleCheck aria-hidden className="mx-auto size-6 text-emerald-400" />
      <p className="mt-3 text-sm font-medium text-zinc-100">
        {chat.finalizadoTitle}
      </p>
      <p className="mt-1 text-xs text-muted">{chat.finalizadoDescription}</p>
    </div>
  );
}

export function SalaDeChat({
  salaId,
  token,
  rol,
  inicio,
  fin,
}: SalaDeChatProps) {
  const [ahora, setAhora] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setAhora(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const tInicio = new Date(inicio).getTime();
  const tFin = new Date(fin).getTime();

  const enCurso = ahora >= tInicio && ahora < tFin;

  return (
    <div className="space-y-6">
      <InfoAcceso salaId={salaId} token={token} />
      {ahora < tInicio ? (
        <Espera inicio={tInicio} />
      ) : enCurso ? (
        <ChatPanel salaId={salaId} token={token} miRol={rol} />
      ) : (
        <Finalizado />
      )}
    </div>
  );
}
