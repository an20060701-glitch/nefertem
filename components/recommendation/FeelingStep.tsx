"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import { FEELINGS } from "@/lib/recommendation/scenes";
import type { Feeling } from "@/types";
import { StepHeading } from "./StepHeading";

/** STEP 02 — the five feelings of An's scene guide as large typography; one choice reveals today's scent. */
export function FeelingStep({
  feeling,
  onChoose,
}: {
  feeling?: Feeling;
  onChoose: (feeling: Feeling) => void;
}) {
  return (
    <div className="flex flex-col gap-5 md:gap-8">
      <StepHeading
        index={2}
        label="THE FEELING"
        question="你想呈現什麼感覺？"
        glyph="eye"
        id="step-feeling"
      />
      <div
        role="radiogroup"
        aria-labelledby="step-feeling"
        className="flex flex-col md:flex-row md:flex-wrap md:gap-x-8 desk:gap-x-10"
      >
        {FEELINGS.map((f) => (
          <MagneticTag
            key={f.key}
            en={f.en}
            zh={f.zh}
            checked={feeling === f.key}
            onChoose={() => onChoose(f.key)}
          />
        ))}
      </div>
    </div>
  );
}

const PULL_RADIUS = 80;
const MAX_SHIFT = 8;

/** A feeling word that leans toward the cursor (desktop, motion allowed) — design system §4.4. */
function MagneticTag({
  en,
  zh,
  checked,
  onChoose,
}: {
  en: string;
  zh: string;
  checked: boolean;
  onChoose: () => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const reach = Math.max(r.width, r.height) / 2 + PULL_RADIUS;
    const pull = Math.max(0, 1 - Math.hypot(dx, dy) / reach);
    x.set((dx / reach) * MAX_SHIFT * 2 * pull);
    y.set((dy / reach) * MAX_SHIFT * 2 * pull);
  };
  const release = () => {
    animate(x, 0, { duration: 0.8, ease: ease.editorial });
    animate(y, 0, { duration: 0.8, ease: ease.editorial });
  };

  return (
    <div className="md:-m-4 md:p-4" onPointerMove={onPointerMove} onPointerLeave={release}>
      <motion.button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={checked}
        onClick={onChoose}
        style={{ x, y }}
        whileTap={{ scale: 0.97, transition: { duration: 0.08 } }}
        className={cn(
          "group flex min-h-11 items-baseline gap-2 py-1 text-left md:gap-3 transition-colors duration-500",
          checked ? "text-blue" : "text-ink hover:text-lotus-deep",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "size-2 shrink-0 self-center rounded-full bg-gold transition-[opacity,transform] duration-500",
            checked ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
        <span className="font-display text-h1 font-light tracking-[0.02em] max-md:text-[1.5rem] max-md:tracking-normal md:text-[clamp(2rem,3.4vw,2.75rem)] desk:text-[clamp(2rem,2.4vw,2.75rem)]">
          {en}
        </span>
        <span
          className={cn(
            "shrink-0 font-serif-zh text-lead max-md:text-body",
            checked ? "text-blue" : "text-muted",
          )}
        >
          {zh}
        </span>
      </motion.button>
    </div>
  );
}
