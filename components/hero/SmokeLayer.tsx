import { cn } from "@/lib/cn";

/*
 * Scent vapour drawn as fine periwinkle and iridescent-lilac lines, as in the illustration, that drift very slowly (20–30s loops).
 * Pure CSS animation; stilled by prefers-reduced-motion in globals.css.
 */
const WISPS = [
  {
    d: "M120 620 C 160 520, 80 450, 140 360 S 220 210, 170 90",
    duration: 28,
    delay: 0,
    opacity: 0.55,
    color: "var(--lotus)",
  },
  {
    d: "M170 640 C 230 540, 150 470, 210 380 S 300 240, 250 120",
    duration: 24,
    delay: -6,
    opacity: 0.6,
    color: "var(--vapour)",
  },
  {
    d: "M90 660 C 110 580, 40 500, 90 420 S 150 300, 110 180",
    duration: 31,
    delay: -12,
    opacity: 0.35,
    color: "var(--lotus)",
  },
  {
    d: "M220 650 C 290 560, 220 500, 270 410 S 360 300, 330 200",
    duration: 26,
    delay: -3,
    opacity: 0.45,
    color: "var(--vapour)",
  },
];

export function SmokeLayer({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 400 700"
      preserveAspectRatio="xMidYMax meet"
      className={cn("pointer-events-none", className)}
      fill="none"
    >
      {WISPS.map((w) => (
        <path
          key={w.d}
          d={w.d}
          className="smoke-path"
          stroke={w.color}
          strokeWidth={1}
          strokeLinecap="round"
          opacity={w.opacity}
          style={
            {
              "--smoke-duration": `${w.duration}s`,
              "--smoke-delay": `${w.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </svg>
  );
}
