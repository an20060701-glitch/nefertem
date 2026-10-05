"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { LotusGlyph } from "@/components/brand/LotusGlyph";
import { SunDisc } from "@/components/brand/SunDisc";
import { INTRO_DONE_EVENT, INTRO_DURATION, INTRO_STORAGE_KEY, hasSeenIntro } from "@/lib/intro";
import { ease } from "@/lib/motion";

/**
 * First-visit ritual (design system §4.4): on midnight indigo a lotus is drawn
 * in ink, "FOLLOW THE SCENT" appears, then the veil lifts. Plays once per
 * session; reduced motion shortens it to a brief still.
 */
export function LoadingRitual() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Returning visitors: CSS already hides the overlay before paint; just unmount it.
    const seen = hasSeenIntro();
    const hold = seen ? 0 : reduce ? 600 : INTRO_DURATION * 1000;
    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {
        /* storage unavailable (private mode): the ritual simply replays next time */
      }
      setVisible(false);
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
    }, hold);
    return () => window.clearTimeout(timer);
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="ritual"
          className="loading-ritual fixed inset-0 z-[80] flex flex-col items-center justify-center bg-surface-inverse text-inverse"
          role="status"
          aria-label="香水人生 載入中"
          exit={{ opacity: 0, transition: { duration: reduce ? 0.2 : 1, ease: ease.cinematic } }}
        >
          <span className="relative flex items-center justify-center">
            <motion.span
              className="absolute"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.55, scale: 1 }}
              transition={{ duration: reduce ? 0.2 : 1.8, ease: ease.editorial }}
            >
              <SunDisc id="ritual-sun" rays={false} className="w-[180px]" />
            </motion.span>
            <LotusGlyph size={88} strokeWidth={1} draw drawDuration={1.4} className="relative text-lotus" />
          </span>
          <motion.p
            className="mt-12 font-serif-zh text-[1.375rem] tracking-[0.4em] text-inverse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 0.8, duration: 1, ease: ease.editorial }}
          >
            香水人生
          </motion.p>
          <motion.p
            className="label mt-5 text-[0.6875rem] tracking-[0.42em] text-inverse/80"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduce ? 0 : 1.1, duration: 0.8, ease: ease.editorial }}
          >
            FOLLOW THE SCENT
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
