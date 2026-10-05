"use client";

import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

/** Single-line blue-lotus mark. Drawn, never filled — echoes the ink-line illustration. */
const PETALS = [
  // centre petal
  "M32 12 C38.5 21 38.5 33 32 44 C25.5 33 25.5 21 32 12 Z",
  // inner petals
  "M32 44 C35 33 41.5 26.5 50 24.5 C50.5 35 43 43 32 44 Z",
  "M32 44 C29 33 22.5 26.5 14 24.5 C13.5 35 21 43 32 44 Z",
  // outer petals
  "M33 44 C43 44.5 52.5 40.5 59 33.5 C51 32.5 43.5 36 38.5 41",
  "M31 44 C21 44.5 11.5 40.5 5 33.5 C13 32.5 20.5 36 25.5 41",
];
const WATERLINE = "M18 50.5 H46";

interface LotusGlyphProps {
  size?: number | string;
  strokeWidth?: number;
  className?: string;
  /** Draw the strokes in on mount. */
  draw?: boolean;
  /** Seconds before drawing starts. */
  delay?: number;
  /** Total drawing time in seconds. */
  drawDuration?: number;
  title?: string;
}

export function LotusGlyph({
  size = 32,
  strokeWidth = 1.25,
  className,
  draw = false,
  delay = 0,
  drawDuration = 1.5,
  title,
}: LotusGlyphProps) {
  const reduce = useReducedMotion();
  const animate = draw && !reduce;
  const paths = [...PETALS, WATERLINE];

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {paths.map((d, i) =>
        animate ? (
          <motion.path
            key={d}
            d={d}
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { delay: delay + i * 0.12, duration: drawDuration, ease: ease.editorial },
              opacity: { delay: delay + i * 0.12, duration: 0.3 },
            }}
          />
        ) : (
          <path key={d} d={d} vectorEffect="non-scaling-stroke" />
        ),
      )}
    </svg>
  );
}
