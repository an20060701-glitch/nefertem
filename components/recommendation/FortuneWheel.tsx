"use client";

import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LotusGlyph } from "@/components/brand/LotusGlyph";
import { SunDisc } from "@/components/brand/SunDisc";
import { FAMILIES } from "@/lib/fragrance/families";
import { ease, fadeUp, reducedFade, staggerChildren } from "@/lib/motion";
import { pickWheelIndex, type Recommendation } from "@/lib/recommendation";

const SPIN_SECONDS = 4.5;
const TREMOR_SECONDS = 0.3;
const R = 180;

interface FortuneWheelProps {
  candidates: Recommendation[];
  onClose: () => void;
  onConfirm: (fragranceId: string) => void;
}

type Phase = "ready" | "spinning" | "done";

/**
 * 選擇障礙？CAN'T DECIDE? — a night-time ritual, not a casino (design system §6.4).
 * The result is drawn with crypto.getRandomValues before the wheel moves;
 * the animation only travels to it.
 */
export function FortuneWheel({ candidates, onClose, onConfirm }: FortuneWheelProps) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("ready");
  const [winner, setWinner] = useState<number>();
  const rotate = useMotionValue(0);
  const tremor = useMotionValue(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<number[]>([]);

  const n = candidates.length;
  const slice = 360 / n;

  // Lock page scroll, make the page behind inert, move focus in; undo all on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    const behind = [...document.body.children].filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== dialogRef.current && !el.inert,
    );
    behind.forEach((el) => (el.inert = true));
    spinRef.current?.focus();
    const pending = timers.current;
    return () => {
      root.style.overflow = overflow;
      behind.forEach((el) => (el.inert = false));
      pending.forEach((t) => window.clearTimeout(t));
      previous?.focus();
    };
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled])");
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const spin = () => {
    const index = pickWheelIndex(n);
    // Land inside the sector, away from its edges, so the pointer never sits on a line.
    const jitter = (pickWheelIndex(1000) / 1000 - 0.5) * slice * 0.6;
    const stopAt = 360 - (index * slice + slice / 2 + jitter);
    const current = rotate.get();
    const turns = 4 + pickWheelIndex(3); // 4–6 full turns
    const target = current - (current % 360) + turns * 360 + (((stopAt % 360) + 360) % 360);

    setWinner(index);
    const finish = () => {
      navigator.vibrate?.(8);
      setPhase("done");
    };

    if (reduce) {
      rotate.set(target);
      finish();
      return;
    }
    setPhase("spinning");
    animate(rotate, target, { duration: SPIN_SECONDS, ease: ease.wheel }).then(finish);
    timers.current.push(
      window.setTimeout(
        () => animate(tremor, [0, 1.5, -1.5, 0.8, 0], { duration: TREMOR_SECONDS, ease: "linear" }),
        (SPIN_SECONDS - TREMOR_SECONDS) * 1000,
      ),
    );
  };

  const chosen = winner === undefined ? undefined : candidates[winner];
  const item = reduce ? reducedFade : fadeUp;

  return createPortal(
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wheel-title"
      onKeyDown={onKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0.2 : 0.8, ease: ease.editorial }}
      className="fixed inset-0 z-[80] overflow-y-auto bg-surface-inverse text-inverse"
    >
      <div className="page-x relative flex min-h-full flex-col items-center py-6 desk:py-10">
        <div className="flex w-full items-center justify-between">
          <p className="label text-gold-light">TODAY&apos;S RITUAL</p>
          <button
            type="button"
            onClick={onClose}
            className="label min-h-11 px-2 text-inverse/80 transition-colors hover:text-inverse"
          >
            關閉 · CLOSE
          </button>
        </div>

        <div className="mt-4 text-center desk:mt-2">
          <h2 id="wheel-title" className="font-serif-zh text-h1-zh text-inverse">
            選擇障礙？
          </h2>
          <p className="mt-1 font-display text-h2 font-light italic text-gold-light">Can&apos;t decide?</p>
        </div>

        <div className="relative mt-8 w-full max-w-[min(26rem,78vw)] desk:max-w-[30rem]">
          {/* pointer */}
          <motion.svg
            viewBox="0 0 20 34"
            aria-hidden
            style={{ rotate: tremor, originY: 0 }}
            className="absolute -top-3 left-1/2 z-10 w-4 -translate-x-1/2 text-gold-light"
          >
            <path d="M10 33 L4 4 H16 Z" fill="currentColor" opacity="0.9" />
            <circle cx="10" cy="4" r="3" fill="currentColor" />
          </motion.svg>

          <motion.div
            animate={{ opacity: phase === "done" ? 0.18 : 1, scale: phase === "done" ? 0.94 : 1 }}
            transition={{ duration: reduce ? 0.2 : 1.2, ease: ease.editorial }}
          >
            <motion.svg viewBox="-200 -200 400 400" style={{ rotate }} aria-hidden className="block w-full">
              <circle r={R + 10} fill="none" stroke="var(--gold-light)" strokeWidth="0.6" opacity="0.5" />
              <circle r={R} fill="none" stroke="var(--gold)" strokeWidth="1" />
              {candidates.map((c, i) => {
                const start = i * slice;
                const mid = start + slice / 2;
                const a0 = ((start - 90) * Math.PI) / 180;
                const a1 = ((start + slice - 90) * Math.PI) / 180;
                const large = slice > 180 ? 1 : 0;
                const name = c.fragrance.name;
                const fontSize = Math.min(15, 250 / Math.max(name.length, 8));
                const dotAngle = ((mid - 90) * Math.PI) / 180;
                return (
                  <g key={c.fragrance.id}>
                    <path
                      d={`M0 0 L${R * Math.cos(a0)} ${R * Math.sin(a0)} A${R} ${R} 0 ${large} 1 ${R * Math.cos(a1)} ${R * Math.sin(a1)} Z`}
                      fill={i % 2 ? "rgb(126 145 203 / 0.08)" : "transparent"}
                      stroke="var(--gold)"
                      strokeWidth="0.6"
                    />
                    <circle
                      cx={(R - 14) * Math.cos(dotAngle)}
                      cy={(R - 14) * Math.sin(dotAngle)}
                      r="3"
                      fill={FAMILIES[c.fragrance.family].color}
                    />
                    <text
                      transform={`rotate(${mid - 90}) translate(${R - 28} 0)`}
                      textAnchor="end"
                      dominantBaseline="middle"
                      fill="var(--background)"
                      fontSize={fontSize}
                      fontStyle="italic"
                      className="font-display"
                    >
                      {name}
                    </text>
                  </g>
                );
              })}
              <circle r="52" fill="var(--surface-inverse)" stroke="var(--gold)" strokeWidth="0.8" />
            </motion.svg>
            {/* centre: Ra's sun with the lotus, still while the wheel turns */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative flex size-[24%] items-center justify-center">
                <SunDisc id="wheel-sun" rays={false} className="absolute inset-0 opacity-90" />
                <LotusGlyph size="56%" className="relative text-lotus-deep" />
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {phase === "done" && chosen && (
              <motion.div
                key="result"
                className="absolute inset-0 flex flex-col items-center justify-center text-center"
                initial="hidden"
                animate="visible"
                variants={staggerChildren(reduce ? 0 : 0.3, 0.15)}
              >
                <motion.p variants={item} className="label text-gold-light">
                  {chosen.fragrance.brand}
                </motion.p>
                <motion.p
                  variants={item}
                  className="mt-3 font-display text-h1 font-light italic text-inverse"
                >
                  {chosen.fragrance.name}
                </motion.p>
                <motion.p variants={item} className="mt-5 font-serif-zh text-h2 text-inverse">
                  今天，就它了。
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p aria-live="polite" className="sr-only">
          {phase === "done" && chosen
            ? `今天，就它了：${chosen.fragrance.brand} ${chosen.fragrance.name}`
            : ""}
        </p>

        <div className="mt-10 flex min-h-28 flex-col items-center gap-4">
          {phase !== "done" ? (
            <>
              <button
                ref={spinRef}
                type="button"
                onClick={spin}
                disabled={phase === "spinning"}
                className="label inline-flex h-14 min-w-56 items-center justify-center border border-gold-light/60 px-8 text-inverse transition-colors duration-500 hover:border-gold-light hover:bg-gold-light/10 disabled:opacity-40"
              >
                {phase === "spinning" ? "命運轉動中…" : "轉動 · SPIN THE WHEEL"}
              </button>
              <p className="text-small text-inverse/60">從今天最適合你的 {n} 款香氣中，讓命運替你決定。</p>
            </>
          ) : (
            chosen && (
              <>
                <button
                  type="button"
                  onClick={() => onConfirm(chosen.fragrance.id)}
                  className="label inline-flex h-14 min-w-56 items-center justify-center bg-gold-light px-8 text-ink transition-colors duration-300 hover:bg-sun"
                >
                  就決定是你了
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhase("ready");
                    window.setTimeout(() => spinRef.current?.focus(), 0);
                  }}
                  className="label min-h-11 text-inverse/70 transition-colors hover:text-inverse"
                >
                  再轉一次 · SPIN AGAIN
                </button>
              </>
            )
          )}
        </div>
      </div>
    </motion.div>,
    document.body,
  );
}
