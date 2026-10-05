import { cn } from "@/lib/cn";

/**
 * Ra's sun from the illustration: a pale-gold disc with a few fine,
 * uneven rays drawn in gilt ink. Purely decorative.
 */
const RAYS = [
  [-58, 0.9],
  [-38, 0.6],
  [-18, 1],
  [6, 0.7],
  [24, 0.95],
  [44, 0.55],
  [62, 0.85],
  [118, 0.5],
  [146, 0.75],
  [168, 0.45],
  [204, 0.6],
  [232, 0.8],
] as const;

export function SunDisc({
  className,
  rays = true,
  id = "sun",
}: {
  className?: string;
  rays?: boolean;
  id?: string;
}) {
  return (
    <svg aria-hidden viewBox="-100 -100 200 200" className={cn("pointer-events-none", className)} fill="none">
      <defs>
        <radialGradient id={`${id}-wash`} cx="40%" cy="38%" r="70%">
          <stop offset="0%" stopColor="var(--sun)" stopOpacity="0.95" />
          <stop offset="70%" stopColor="var(--gilt)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--gilt)" stopOpacity="0.35" />
        </radialGradient>
      </defs>
      <circle r="38" fill={`url(#${id}-wash)`} />
      <circle r="41" stroke="var(--gilt)" strokeWidth="0.6" opacity="0.7" />
      {rays
        ? RAYS.map(([angle, length]) => {
            const rad = (angle * Math.PI) / 180;
            const r1 = 50;
            const r2 = 50 + 40 * length;
            return (
              <line
                key={angle}
                x1={Math.cos(rad) * r1}
                y1={Math.sin(rad) * r1}
                x2={Math.cos(rad) * r2}
                y2={Math.sin(rad) * r2}
                stroke="var(--gilt)"
                strokeWidth="0.8"
                strokeLinecap="round"
                opacity="0.75"
              />
            );
          })
        : null}
    </svg>
  );
}
