"use client";

import { motion, useReducedMotion } from "motion/react";
import { EgyptianGlyph } from "@/components/brand/EgyptianGlyph";
import { cn } from "@/lib/cn";
import { transition } from "@/lib/motion";
import type { Occasion } from "@/types";
import { StepHeading } from "./StepHeading";

const OPTIONS = [
  { key: "indoor", en: "INDOOR", zh: "涼爽的室內", note: "辦公室、咖啡廳、晚餐與會議", glyph: "eye" },
  { key: "outdoor", en: "OUTDOOR", zh: "戶外活動", note: "散步、旅行、陽光與風", glyph: "ra" },
] as const;

/** STEP 02 — two editorial selection cards, one half of the screen each. */
export function OccasionStep({
  occasion,
  onChoose,
}: {
  occasion?: Occasion;
  onChoose: (occasion: Occasion) => void;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-12 desk:gap-16">
      <StepHeading
        index={1}
        label="THE OCCASION"
        question="你今天會去哪裡？"
        glyph="ankh"
        id="step-occasion"
      />
      <div
        role="radiogroup"
        aria-labelledby="step-occasion"
        className="grid grid-cols-2 border-y border-line"
      >
        {OPTIONS.map((option, i) => {
          const checked = occasion === option.key;
          return (
            <motion.button
              key={option.key}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => onChoose(option.key)}
              whileHover={reduce ? undefined : { y: -4 }}
              transition={transition.base}
              className={cn(
                // Phones: two compact squares side by side (An, 2026-10-06), not a tall stack.
                "group relative flex min-h-[12rem] flex-col justify-between gap-6 px-4 py-6 text-left md:min-h-[24rem] md:gap-10 md:px-10 md:py-10 desk:min-h-[22rem] desk:px-8 desk:py-12",
                i === 1 && "border-l border-line",
              )}
            >
              <div className="flex items-start justify-between gap-6">
                <span
                  className={cn("label transition-colors duration-500", checked ? "text-blue" : "text-faint")}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <EgyptianGlyph name={option.glyph} size={28} className="size-5 opacity-60 md:size-7" />
              </div>
              <div>
                <span
                  className={cn(
                    // Desktop: the cards share the right column, so the word scales with the viewport.
                    "block font-display text-[clamp(1.75rem,8vw,2.25rem)] font-light italic leading-none transition-colors duration-700 md:text-display desk:text-[clamp(2.5rem,4.2vw,6.5rem)]",
                    checked ? "text-blue" : "text-ink group-hover:text-lotus-deep",
                  )}
                >
                  {option.en}
                </span>
                <span className="mt-3 flex items-center gap-2 font-serif-zh text-lead text-ink md:gap-3 md:text-h1-zh">
                  <span
                    aria-hidden
                    className={cn(
                      "size-2 rounded-full bg-gold transition-opacity duration-500",
                      checked ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.zh}
                </span>
                <span className="mt-2 block text-small text-muted md:mt-4 md:text-body">{option.note}</span>
              </div>
              <span
                aria-hidden
                className={cn(
                  "absolute bottom-0 left-4 h-px w-[calc(100%-2rem)] origin-left bg-gold transition-transform duration-700 ease-[var(--ease-editorial)] md:left-10 md:w-[calc(100%-5rem)] desk:left-8 desk:w-[calc(100%-4rem)]",
                  checked ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                )}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
