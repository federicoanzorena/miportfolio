import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { PanelEquipo } from "../components/contacto/PanelEquipo";
import { SalaDeChat } from "../components/contacto/SalaDeChat";
import { SelectorFranjas } from "../components/contacto/SelectorFranjas";
import { Container } from "../components/ui/Container";
import { Reveal } from "../components/ui/Reveal";
import { content } from "../data/content";
import type { TurnoConfirmado } from "../types/agenda";

export function ContactPage() {
  const contact = content.contact;
  const agenda = content.agenda;
  const channel = contact.channels[0];
  const [turno, setTurno] = useState<TurnoConfirmado | null>(null);

  return (
    <section className="relative overflow-hidden pb-24 pt-28 sm:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[30rem] bg-[radial-gradient(55%_100%_at_50%_0%,rgba(99,102,241,0.16),transparent)]"
      />

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent-400"
          >
            <span
              aria-hidden
              className="size-1.5 rounded-full bg-emerald-500"
            />
            {contact.availability.value}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl"
          >
            {contact.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.16,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg"
          >
            {contact.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.24,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-10"
          >
            <div className="inline-flex items-center gap-3 rounded-2xl border border-line bg-surface px-6 py-4">
              <span className="font-mono text-base font-semibold text-zinc-100 sm:text-lg">
                {channel.value}
              </span>
            </div>
          </motion.div>
        </div>

        <div className="mx-auto mt-24 max-w-4xl">
          <Reveal>
            <div className="text-center">
              <h2 className="text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
                {agenda.title}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                {agenda.description}
              </p>
            </div>
          </Reveal>

          <div className="mt-10 rounded-3xl border border-line bg-surface/70 p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
                {turno ? agenda.reservadoTitle : agenda.selectHint}
              </h3>
              {turno ? (
                <button
                  type="button"
                  onClick={() => setTurno(null)}
                  className="focus-ring shrink-0 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-600"
                >
                  {agenda.reservarOtro}
                </button>
              ) : null}
            </div>

            {turno ? (
              <SalaDeChat
                salaId={turno.sala_id}
                token={turno.token_visitante}
                rol="visitante"
                inicio={turno.inicio}
                fin={turno.fin}
              />
            ) : (
              <SelectorFranjas onReservado={setTurno} />
            )}
          </div>

          <details className="group mt-8 overflow-hidden rounded-3xl border border-line bg-surface/50">
            <summary className="flex cursor-pointer list-none flex-col gap-1 px-6 py-5 [&::-webkit-details-marker]:hidden">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-100">
                <KeyRound aria-hidden className="size-4 text-accent-400" />
                {agenda.equipoTitle}
              </span>
              <span className="text-xs text-muted">{agenda.equipoDescription}</span>
            </summary>
            <div className="border-t border-line px-6 py-5">
              <PanelEquipo />
            </div>
          </details>
        </div>

        <div className="mx-auto mt-24 max-w-4xl">
          <Reveal>
            <h2 className="text-center text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">
              Qué pasa después de escribirnos
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {contact.nextSteps.map((step, index) => (
              <Reveal key={step.step} delay={index * 0.1} className="h-full">
                <article className="relative h-full rounded-2xl border border-line bg-surface/70 p-6 text-left transition-colors duration-300 hover:border-zinc-600">
                  <span className="font-mono text-xs font-semibold tracking-widest text-accent-400">
                    {step.step}
                  </span>
                  <h3 className="mt-3 text-base font-semibold tracking-tight text-zinc-100">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
