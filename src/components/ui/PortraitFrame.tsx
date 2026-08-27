import { motion } from "framer-motion";
import { User } from "lucide-react";
import { content } from "../../data/content";

import photo from "../../assets/insta2.jpeg";

type PortraitFrameProps = {
  showPill?: boolean;
  className?: string;
};

export function PortraitFrame({
  showPill = false,
  className = "",
}: PortraitFrameProps) {
  const lead = content.team.members.find(
    (member) => member.filled && member.photo,
  );

  return (
    <div className={`relative mx-auto w-full max-w-sm ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-size-[18px_18px] mask-[radial-gradient(60%_60%_at_50%_45%,black,transparent)]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 animate-glow rounded-[3rem] bg-[radial-gradient(45%_45%_at_50%_40%,rgba(99,102,241,0.3),rgba(139,92,246,0.12),transparent)] blur-2xl"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 translate-x-4 translate-y-4 rounded-4xl bg-linear-to-br from-accent-500/30 via-accent-700/20 to-transparent blur-md"
      />

      <div className="group relative">
        <div className="rounded-4xl bg-linear-to-br from-accent-500/70 via-accent-700/30 to-transparent p-px shadow-2xl shadow-accent-950/40">
          <div className="relative overflow-hidden rounded-[calc(2rem-1px)]">
            <img
              src={photo}
              alt={lead?.photoAlt ?? lead?.name ?? "Miembro de binfinito"}
              width={768}
              height={960}
              loading="lazy"
              className="aspect-4/5 w-full object-cover object-[center_30%] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-linear-to-b from-white/10 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/30 to-transparent"
            />
          </div>
        </div>

        <motion.span
          aria-hidden
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-3 -top-4 rounded-xl border border-line bg-surface/80 px-3 py-1.5 font-mono text-xs font-semibold tracking-widest text-accent-400 shadow-lg backdrop-blur-md sm:-right-5"
        >
          01
        </motion.span>
        <motion.span
          aria-hidden
          animate={{ y: [0, 7, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2,
          }}
          className="absolute -bottom-3 -left-3 rounded-xl border border-line bg-surface/80 px-3 py-1.5 font-mono text-xs font-semibold tracking-widest text-violet-400 shadow-lg backdrop-blur-md sm:-left-5"
        >
          11
        </motion.span>
      </div>

      {showPill ? (
        <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface/80 px-4 py-2 shadow-xl backdrop-blur-md">
          <span
            aria-hidden
            className="grid size-6 place-items-center rounded-full bg-accent-600/20 text-accent-400"
          >
            <User className="size-3.5" />
          </span>
          <span className="text-xs font-medium text-zinc-200">
            {lead?.name ?? content.team.title}
          </span>
        </div>
      ) : null}
    </div>
  );
}
