"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";

/**
 * Nefertem speaking to the visitor: a sheer watercolour bubble, near-clear white
 * at the top left deepening through lavender to pale blue-violet at the bottom
 * right, with a thin champagne-gold line. No heavy shadow, no frosted glass.
 * Its tail points down toward the figure.
 */
const OUTLINE = {
  // tail at the lower right, for a bubble left of the figure's head
  right: "M24 6 H296 Q314 6 314 24 V78 Q314 96 296 96 H214 L236 118 L188 96 H24 Q6 96 6 78 V24 Q6 6 24 6 Z",
  // tail at the lower left, for a bubble right of the figure's head
  left: "M24 6 H296 Q314 6 314 24 V78 Q314 96 296 96 H132 L84 118 L106 96 H24 Q6 96 6 78 V24 Q6 6 24 6 Z",
} as const;

export function SpeechBubble({
  children,
  delay = 0,
  tail = "right",
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  /** Which lower corner the tail points from, toward the speaker. */
  tail?: keyof typeof OUTLINE;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const fillId = useId();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.2 : 1.2, delay, ease: ease.editorial }}
      className={cn("pointer-events-none", className)}
    >
      <div className={cn("relative aspect-[320/120]", !reduce && "lotus-float")}>
        <svg
          aria-hidden
          viewBox="0 0 320 120"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#FFFDF8" stopOpacity="0.28" />
              <stop offset="0.5" stopColor="#F3F1FA" stopOpacity="0.5" />
              <stop offset="1" stopColor="#B8C6EA" stopOpacity="0.62" />
            </linearGradient>
          </defs>
          <path
            d={OUTLINE[tail]}
            fill={`url(#${fillId})`}
            stroke="#B9A06A"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M30 12 H290"
            stroke="#C8B27C"
            strokeWidth="1"
            opacity="0.45"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <p className="absolute inset-x-0 top-0 flex h-[80%] items-center justify-center px-5 text-center font-serif-zh text-lead leading-snug text-ink">
          {children}
        </p>
      </div>
    </motion.div>
  );
}
