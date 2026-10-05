"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";

/**
 * Nefertem speaking to the visitor: an ink-line speech bubble on ivory,
 * its tail pointing down toward the figure. Drawn like the illustration's
 * hand-lettered notes, not a chat UI.
 */
export function SpeechBubble({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
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
          {/* bubble with a tail toward the lower right, where the figure is */}
          <path
            d="M24 6 H296 Q314 6 314 24 V78 Q314 96 296 96 H214 L236 118 L188 96 H24 Q6 96 6 78 V24 Q6 6 24 6 Z"
            fill="var(--surface)"
            fillOpacity="0.92"
            stroke="var(--gold)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M30 12 H290"
            stroke="var(--gold-light)"
            strokeWidth="1"
            opacity="0.6"
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
