import type { Technology } from "@shared/types";
import { Reveal } from "@shared/ui/Reveal";

interface TechnologyCardProps {
  technology: Technology;
  index: number;
}

export function TechnologyCard({ technology, index }: TechnologyCardProps) {
  return (
    <Reveal delay={index * 0.06} className="h-full">
      <article className="group flex h-full flex-col gap-5 rounded-2xl border border-line bg-surface/70 p-6 transition-colors duration-300 hover:border-zinc-600 sm:p-7">
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className="grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-accent-400 transition-transform duration-300 group-hover:scale-105"
          >
            <technology.icon className="size-6" />
          </span>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
              {technology.name}
            </h3>
            <p className="text-xs font-medium uppercase tracking-widest text-subtle">
              {technology.role}
            </p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted sm:text-[15px]">
          {technology.reason}
        </p>
      </article>
    </Reveal>
  );
}
