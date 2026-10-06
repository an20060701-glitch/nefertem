import { cn } from "@/lib/cn";

/*
 * A few loose blue-lotus petals at the edge of a section, like the petals
 * falling across the key visual. Watercolour wash, very low contrast.
 */
const LAYOUTS = {
  left: [
    { left: "3%", top: "12%", rotate: -28, size: 34, opacity: 0.55 },
    { left: "11%", top: "52%", rotate: 34, size: 24, opacity: 0.4 },
    { left: "2%", top: "80%", rotate: -62, size: 20, opacity: 0.35 },
  ],
  right: [
    { left: "90%", top: "10%", rotate: 22, size: 32, opacity: 0.5 },
    { left: "95%", top: "44%", rotate: -40, size: 22, opacity: 0.38 },
    { left: "84%", top: "74%", rotate: 58, size: 28, opacity: 0.45 },
  ],
  // Cover: a few petals around the figure, none over the text on the left.
  hero: [
    { left: "58%", top: "16%", rotate: -24, size: 26, opacity: 0.5 },
    { left: "94%", top: "34%", rotate: 38, size: 22, opacity: 0.45 },
    { left: "52%", top: "84%", rotate: -58, size: 30, opacity: 0.45 },
    { left: "80%", top: "8%", rotate: 64, size: 18, opacity: 0.4 },
  ],
} as const;

export function PetalScatter({
  side = "right",
  drift = false,
  className,
}: {
  side?: keyof typeof LAYOUTS;
  /** Let the petals drift slowly on air. */
  drift?: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {LAYOUTS[side].map((p, i) => (
        <svg
          key={`${p.left}-${p.top}`}
          viewBox="-8 -15 16 30"
          width={p.size * 0.55}
          height={p.size}
          className={cn("absolute", drift && "petal-drift")}
          style={
            {
              left: p.left,
              top: p.top,
              transform: `rotate(${p.rotate}deg)`,
              opacity: p.opacity,
              "--petal-duration": `${11 + i * 2.5}s`,
              "--petal-delay": `${-i * 3}s`,
            } as React.CSSProperties
          }
        >
          <path d="M0 -14 C 6.5 -8, 6.5 6, 0 14 C -6.5 6, -6.5 -8, 0 -14 Z" fill="var(--lotus)" />
          <path d="M0 -11 V 11" stroke="var(--lotus-deep)" strokeWidth="0.6" opacity="0.6" />
        </svg>
      ))}
    </div>
  );
}
