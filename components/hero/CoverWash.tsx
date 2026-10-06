"use client";

import { motion, useReducedMotion } from "motion/react";
import { ease } from "@/lib/motion";

/**
 * The cover's watercolour ground. Pre-rendered from scripts/watercolor/wash.html
 * (landscape for tablet and up, portrait for phones), so nothing is filtered at
 * runtime. It reaches up under the mobile top bar, dissolves into the page colour
 * at the bottom where Today's Choice begins on ivory, and seeps in slowly on arrival.
 */
export function CoverWash({ delay = 0 }: { delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduce ? 0.2 : 2.4, delay, ease: ease.editorial }}
      className="cover-wash pointer-events-none absolute inset-x-0 -top-16 bottom-0 -z-10 bg-[url(/images/cover-wash-portrait.webp)] bg-cover bg-[position:right_top] md:top-0 md:bg-[url(/images/cover-wash-landscape.webp)] md:bg-[position:right_bottom]"
    />
  );
}
