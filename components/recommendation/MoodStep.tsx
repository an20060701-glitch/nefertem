"use client";

import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { MOODS } from "@/lib/fragrance/families";
import { ease } from "@/lib/motion";
import type { Mood } from "@/types";
import { StepHeading } from "./StepHeading";
import { MAX_MOODS } from "./useChoiceFlow";

/** STEP 03 — seven large typography tags; up to two. */
export function MoodStep({
  moods,
  onToggle,
  onReveal,
}: {
  moods: Mood[];
  onToggle: (mood: Mood) => void;
  onReveal: () => void;
}) {
  const full = moods.length >= MAX_MOODS;
  return (
    <div className="flex flex-col gap-12 desk:gap-16">
      <StepHeading
        index={3}
        label="THE IMPRESSION"
        question="今天，你想留下什麼樣的氣味？"
        glyph="eye"
        id="step-mood"
      />
      <div>
        <p className="label text-muted" aria-live="polite">
          最多選擇兩個 · CHOOSE UP TO TWO
          <span className="ml-4 text-gold-text">
            {moods.length} / {MAX_MOODS}
          </span>
        </p>
        <div
          role="group"
          aria-labelledby="step-mood"
          className="mt-6 flex flex-wrap gap-x-6 gap-y-1 desk:gap-x-10"
        >
          {MOODS.map((mood) => {
            const checked = moods.includes(mood.key);
            return (
              <MagneticTag
                key={mood.key}
                en={mood.en}
                zh={mood.zh}
                checked={checked}
                disabled={full && !checked}
                onToggle={() => onToggle(mood.key)}
              />
            );
          })}
        </div>
      </div>
      <div>
        <Button onClick={onReveal} disabled={moods.length === 0}>
          揭曉今天的香氣 · REVEAL MY SCENT
        </Button>
      </div>
    </div>
  );
}

const PULL_RADIUS = 80;
const MAX_SHIFT = 8;

/** A mood word that leans toward the cursor (desktop, motion allowed) — design system §4.4. */
function MagneticTag({
  en,
  zh,
  checked,
  disabled,
  onToggle,
}: {
  en: string;
  zh: string;
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
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
    <div className="-m-4 p-4" onPointerMove={onPointerMove} onPointerLeave={release}>
      <motion.button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        onClick={() => !disabled && onToggle()}
        style={{ x, y }}
        className={cn(
          "group flex min-h-11 items-baseline gap-3 py-1 text-left transition-colors duration-500",
          checked
            ? "text-blue"
            : disabled
              ? "cursor-not-allowed text-faint/60"
              : "text-ink hover:text-lotus-deep",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "size-2 shrink-0 self-center rounded-full bg-gold transition-[opacity,transform] duration-500",
            checked ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
        />
        <span className="font-display text-h1 font-light tracking-[0.02em]">{en}</span>
        <span className={cn("font-serif-zh text-lead", checked ? "text-blue" : "text-muted")}>{zh}</span>
      </motion.button>
    </div>
  );
}
