import { cn } from "@/lib/cn";

/*
 * Very few gold motes rising through the hero (≤ 12, per the brief).
 * Positions are fixed so server and client markup match.
 */
const MOTES = [
  { left: "12%", top: "78%", size: 2, duration: 11, delay: 0, drift: 10 },
  { left: "22%", top: "64%", size: 3, duration: 13, delay: -4, drift: -8 },
  { left: "31%", top: "86%", size: 2, duration: 9, delay: -2, drift: 6 },
  { left: "44%", top: "72%", size: 2, duration: 12, delay: -7, drift: -12 },
  { left: "53%", top: "90%", size: 3, duration: 14, delay: -1, drift: 14 },
  { left: "61%", top: "68%", size: 2, duration: 10, delay: -5, drift: -6 },
  { left: "70%", top: "82%", size: 2, duration: 12, delay: -9, drift: 8 },
  { left: "79%", top: "60%", size: 3, duration: 15, delay: -3, drift: -10 },
  { left: "87%", top: "76%", size: 2, duration: 11, delay: -8, drift: 6 },
];

export function GoldParticles({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {MOTES.map((m) => (
        <span
          key={`${m.left}-${m.top}`}
          className="gold-particle absolute rounded-full bg-sun"
          style={
            {
              left: m.left,
              top: m.top,
              width: m.size,
              height: m.size,
              boxShadow: "0 0 6px rgb(227 194 153 / 0.9)",
              "--particle-duration": `${m.duration}s`,
              "--particle-delay": `${m.delay}s`,
              "--drift-x": `${m.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
