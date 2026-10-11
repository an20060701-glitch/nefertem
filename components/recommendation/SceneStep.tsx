"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { transition } from "@/lib/motion";
import { SCENES } from "@/lib/recommendation/scenes";
import type { Scene } from "@/types";
import { StepHeading } from "./StepHeading";

/** STEP 01 — the six places of An's scene guide in two rows of three, so phones answer without scrolling. */
export function SceneStep({ scene, onChoose }: { scene?: Scene; onChoose: (scene: Scene) => void }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-5 md:gap-8">
      <StepHeading index={1} label="THE PLACE" question="你現在要去哪裡？" glyph="ankh" id="step-scene" />
      <div role="radiogroup" aria-labelledby="step-scene" className="grid grid-cols-3 border-t border-line">
        {SCENES.map((option, i) => {
          const checked = scene === option.key;
          return (
            <motion.button
              key={option.key}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => onChoose(option.key)}
              whileHover={reduce ? undefined : { y: -3 }}
              whileTap={reduce ? undefined : { scale: 0.985, transition: { duration: 0.08 } }}
              transition={transition.base}
              className={cn(
                "group relative flex flex-col gap-1.5 border-b border-line px-3 py-3 text-left md:gap-3 md:px-6 md:py-5 desk:py-6",
                i % 3 !== 0 && "border-l",
              )}
            >
              <span
                className={cn("label transition-colors duration-500", checked ? "text-blue" : "text-faint")}
              >
                {String(i + 1).padStart(2, "0")}
                <span className="ml-3 max-md:hidden">{option.en}</span>
              </span>
              <span
                className={cn(
                  "flex items-center gap-2 font-serif-zh text-body transition-colors duration-700 md:text-h2",
                  checked ? "text-blue" : "text-ink group-hover:text-lotus-deep",
                )}
              >
                {option.zh}
              </span>
              <span className="block text-small text-muted max-md:hidden">{option.note}</span>
              <span className="label text-faint md:hidden">{option.en}</span>
              <span
                aria-hidden
                className={cn(
                  "absolute bottom-0 left-3 h-px w-[calc(100%-1.5rem)] origin-left bg-gold transition-transform duration-700 ease-[var(--ease-editorial)] md:left-6 md:w-[calc(100%-3rem)]",
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
