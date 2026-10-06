"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Desktop-only cursor: a small blue dot and a hairline ring that widens over
 * interactive elements. Disabled on touch devices and for reduced motion.
 * (The trailing ring uses a critically-damped follow — no overshoot.)
 * It sits above the full-screen sheets (z-80), or the pointer vanishes there.
 */
export function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 300, damping: 40, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 300, damping: 40, mass: 0.6 });

  useEffect(() => {
    const query = window.matchMedia("(pointer: fine) and (min-width: 1200px)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled || reduce) return;
    document.documentElement.classList.add("has-custom-cursor");
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      setHovering(
        Boolean(target?.closest("a, button, [role='button'], [role='radio'], [role='checkbox'], label")),
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
    };
  }, [enabled, reduce, x, y]);

  if (!enabled || reduce) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]">
      <motion.div
        className="absolute left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue"
        style={{ x, y }}
      />
      <motion.div
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue/40"
        style={{ x: ringX, y: ringY }}
        animate={{ width: hovering ? 64 : 32, height: hovering ? 64 : 32, opacity: hovering ? 1 : 0.7 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
