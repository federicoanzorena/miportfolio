import { cn } from "../../utils/cn";
import { BININFINITO_DOTS } from "../../utils/brand";

interface BinfiniteMarkProps {
  className?: string;
}

export function BinfiniteMark({ className }: BinfiniteMarkProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid place-items-center rounded-lg bg-gradient-to-br from-accent-500 to-accent-700 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)]",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-[62%]">
        {BININFINITO_DOTS.map((dot, index) => (
          <circle
            key={index}
            cx={dot.x}
            cy={dot.y}
            r={dot.r}
            fill="currentColor"
            opacity={dot.r > 1.3 ? 1 : 0.62}
          />
        ))}
      </svg>
    </span>
  );
}

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BinfiniteMark className="size-8" />
      {showWordmark ? (
        <span className="font-extrabold uppercase italic leading-none tracking-tight">
          <span className="bg-gradient-to-r from-accent-300 via-accent-400 to-violet-400 bg-clip-text text-transparent">
            BI
          </span>
          <span className="text-zinc-50">NFINITO</span>
        </span>
      ) : null}
    </span>
  );
}
