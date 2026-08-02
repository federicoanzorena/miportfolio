import type { CSSProperties } from "react";
import { BININFINITO_DOTS } from "../../utils/brand";

const STEP = 0.45;

const LEFT = BININFINITO_DOTS.slice(0, 6);
const RIGHT = BININFINITO_DOTS.slice(6, 12);
const CENTER = BININFINITO_DOTS.slice(12);

const CHASE_ORDER = [
  ...LEFT,
  CENTER[0],
  CENTER[1],
  RIGHT[3],
  RIGHT[4],
  RIGHT[5],
  RIGHT[0],
  RIGHT[1],
  RIGHT[2],
];

const CHASE_DURATION = `${STEP * CHASE_ORDER.length}s`;

export function InfinityBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="absolute left-1/2 top-1/2 w-[150vmin] max-w-none -translate-x-1/2 -translate-y-1/2"
        style={{ "--chase-duration": CHASE_DURATION } as CSSProperties}
      >
        {CHASE_ORDER.map((dot, index) => (
          <circle
            key={index}
            cx={dot.x}
            cy={dot.y}
            r={dot.r}
            fill="currentColor"
            opacity={0.1}
            className="dot-chase text-accent-500"
            style={{ animationDelay: `${index * STEP}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
