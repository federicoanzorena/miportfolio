import type { Deliverable } from "@shared/types";
import { cn } from "@shared/lib/cn";
import { Reveal } from "@shared/ui/Reveal";

interface FeatureCardProps {
  item: Deliverable;
  index: number;
}

export function FeatureCard({ item, index }: FeatureCardProps) {
  const wide = item.span === "wide";

  return (
    <Reveal
      delay={index * 0.05}
      className={cn("h-full", wide && "sm:col-span-2")}
    >
      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface/70 p-6 transition-colors duration-300 hover:border-zinc-600 sm:p-7">
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25",
            item.accent,
          )}
        />
        <div
          className={cn(
            "relative flex h-full flex-col",
            wide && "sm:flex-row sm:items-start sm:gap-6",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:scale-105",
              item.accent,
            )}
          >
            <item.icon className="size-5" />
          </span>
          <div className={cn("mt-4", wide && "sm:mt-0 sm:pt-1")}>
            <h3 className="text-lg font-semibold tracking-tight text-zinc-100">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted sm:text-[15px]">
              {item.description}
            </p>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
