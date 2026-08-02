import { Reveal } from "./Reveal";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  id?: string;
  className?: string;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
  id,
  className,
}: SectionTitleProps) {
  const centered = align === "center";

  return (
    <div
      className={`${centered ? "mx-auto text-center" : ""} max-w-2xl ${className ?? ""}`}
    >
      {eyebrow ? (
        <Reveal>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium uppercase tracking-widest text-accent-400">
            {eyebrow}
          </span>
        </Reveal>
      ) : null}
      <Reveal delay={0.05}>
        <h2
          id={id}
          className="text-balance text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl"
        >
          {title}
        </h2>
      </Reveal>
      {description ? (
        <Reveal delay={0.1}>
          <p className="mt-4 text-pretty text-base leading-relaxed text-muted sm:text-lg">
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
