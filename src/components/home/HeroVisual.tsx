import { motion } from "framer-motion";
import { ArrowRight, Atom, BadgeCheck, Zap } from "lucide-react";

const chipAnimation = {
  animate: { y: [0, -10, 0] },
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

function BrowserDots() {
  return (
    <span aria-hidden className="flex items-center gap-1">
      <span className="size-2 rounded-full bg-zinc-600" />
      <span className="size-2 rounded-full bg-zinc-700" />
      <span className="size-2 rounded-full bg-zinc-600" />
    </span>
  );
}

function BeforeWindow() {
  return (
    <div className="flex-1 rounded-xl border border-zinc-700/60 bg-zinc-900/70 p-3">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
        <BrowserDots />
        <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
          Antes
        </span>
      </div>
      <div className="mt-3 space-y-2 grayscale">
        <div className="flex gap-1.5">
          <div className="h-2.5 flex-1 rounded-[2px] bg-zinc-700" />
          <div className="h-2.5 w-10 rounded-[2px] bg-zinc-800" />
          <div className="h-2.5 w-10 rounded-[2px] bg-zinc-800" />
        </div>
        <div className="h-9 rounded-[3px] bg-zinc-700" />
        <div className="h-3 w-3/4 rounded-[2px] bg-zinc-600" />
        <div className="h-3 w-1/2 rounded-[2px] bg-zinc-800" />
        <div className="flex gap-2">
          <div className="h-14 flex-1 rounded-[3px] bg-zinc-700" />
          <div className="h-14 flex-1 rounded-[3px] bg-zinc-800" />
        </div>
        <div className="h-2.5 w-2/3 rounded-[2px] bg-zinc-700" />
      </div>
    </div>
  );
}

function AfterWindow() {
  return (
    <div className="relative flex-1 overflow-hidden rounded-xl border border-accent-500/30 bg-surface p-3 shadow-[0_0_40px_-8px_rgba(99,102,241,0.45)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full bg-accent-600/25 blur-2xl"
      />
      <div className="relative flex items-center justify-between gap-2 border-b border-line pb-2.5">
        <BrowserDots />
        <span className="rounded-md border border-accent-500/30 bg-accent-600/20 px-2 py-0.5 text-[10px] font-medium text-accent-300">
          Después
        </span>
      </div>
      <div className="relative mt-3 space-y-2">
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-full bg-gradient-to-br from-accent-400 to-accent-600" />
          <div className="h-2 w-8 rounded-full bg-zinc-700" />
          <div className="h-2 w-8 rounded-full bg-zinc-700" />
          <div className="h-2 w-8 rounded-full bg-zinc-700" />
          <div className="ml-auto h-4 w-12 rounded-full bg-gradient-to-r from-accent-500 to-accent-600" />
        </div>
        <div className="h-6 w-4/5 rounded-lg bg-gradient-to-r from-zinc-200 to-zinc-600" />
        <div className="h-2 w-3/5 rounded-full bg-zinc-700" />
        <div className="flex gap-2">
          <div className="flex-1 rounded-lg border border-line bg-surface-2 p-2">
            <div className="size-3 rounded-md bg-gradient-to-br from-accent-400 to-accent-600" />
            <div className="mt-1.5 h-1.5 w-3/4 rounded-full bg-zinc-700" />
          </div>
          <div className="flex-1 rounded-lg border border-line bg-surface-2 p-2">
            <div className="size-3 rounded-md bg-gradient-to-br from-violet-400 to-violet-600" />
            <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-zinc-700" />
          </div>
          <div className="hidden flex-1 rounded-lg border border-line bg-surface-2 p-2 sm:block">
            <div className="size-3 rounded-md bg-gradient-to-br from-fuchsia-400 to-fuchsia-600" />
            <div className="mt-1.5 h-1.5 w-3/4 rounded-full bg-zinc-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-xl" aria-hidden>
      <div className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-[radial-gradient(50%_50%_at_50%_40%,rgba(99,102,241,0.22),transparent)] blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-3">
          <BeforeWindow />
          <div className="flex items-center justify-center sm:flex-col">
            <div className="grid size-9 place-items-center rounded-full border border-accent-500/40 bg-surface shadow-[0_0_24px_-4px_rgba(99,102,241,0.5)]">
              <ArrowRight className="size-4 text-accent-400 sm:rotate-90" />
            </div>
          </div>
          <AfterWindow />
        </div>
      </motion.div>

      <motion.div
        {...chipAnimation}
        className="absolute -right-2 top-2 flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 shadow-lg sm:-right-6"
      >
        <Atom className="size-4 text-accent-400" />
        <span className="text-xs font-medium text-zinc-200">React</span>
      </motion.div>

      <motion.div
        {...chipAnimation}
        transition={{ ...chipAnimation.transition, delay: 1.2 }}
        className="absolute -bottom-3 left-4 flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 shadow-lg sm:-left-8"
      >
        <Zap className="size-4 text-amber-400" />
        <span className="text-xs font-medium text-zinc-200">
          +40% velocidad
        </span>
      </motion.div>

      <span className="absolute -top-4 left-1/2 hidden -translate-x-1/2 md:block">
        <motion.span
          {...chipAnimation}
          transition={{ ...chipAnimation.transition, delay: 0.6 }}
          className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 shadow-lg"
        >
          <BadgeCheck className="size-4 text-emerald-400" />
          <span className="text-xs font-medium text-zinc-200">Accesible</span>
        </motion.span>
      </span>
    </div>
  );
}
