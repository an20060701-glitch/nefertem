"use client";

import { motion, useReducedMotion } from "motion/react";
import { pageTransition, reducedFade } from "@/lib/motion";

/**
 * Re-mounts on every navigation, so each page enters with the shared
 * cinematic transition (design system §4.3).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial="hidden" animate="visible" variants={reduce ? reducedFade : pageTransition}>
      {children}
    </motion.div>
  );
}
