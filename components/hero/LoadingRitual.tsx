"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { NefertemEmblem } from "@/components/brand/NefertemEmblem";
import { ChromaticTitle } from "./ChromaticTitle";
import { INTRO_DONE_EVENT, INTRO_DURATION, INTRO_STORAGE_KEY, hasSeenIntro } from "@/lib/intro";
import { ease } from "@/lib/motion";

/**
 * First-visit ritual (design system §4.4): on midnight indigo the gilt Nefertem
 * emblem rises into view, "FOLLOW THE SCENT" appears, then the veil lifts. Plays once per
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
          aria-label="Nefertem 載入中"
          exit={{ opacity: 0, transition: { duration: reduce ? 0.2 : 1, ease: ease.cinematic } }}
        >
          <span className="relative flex items-center justify-center">
            <motion.span
              className="relative"
              initial={{ opacity: 0, y: reduce ? 0 : 10, filter: reduce ? "none" : "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: reduce ? 0.2 : 1.4, ease: ease.editorial }}
            >
              <NefertemEmblem className="h-[150px] w-auto" />
            </motion.span>
          </span>
          {/* The name assembles in chromatic light, like the cover's wordmark (An, 2026-10-08). */}
          <ChromaticTitle
            as="p"
            text="Nefertem"
            delay={0.6}
            assemble={1.3}
            replayOnHover={false}
            className="mt-10 font-display text-[2rem] tracking-[0.08em] text-inverse"
          />
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
