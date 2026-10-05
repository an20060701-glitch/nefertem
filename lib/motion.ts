import type { Transition, Variants } from "motion/react";

/**
 * 香水人生 motion language — see docs/NEFERTEM-DESIGN-SYSTEM.md §4.
 * Slow, elegant, cinematic. No springs, no bounce, no overshoot.
 * Every animated component should pull its timing from here.
 */

export const ease = {
  /** Default deceleration for text and image reveals. */
  editorial: [0.22, 1, 0.36, 1],
  /** Page transitions and clip-path curtains. */
  cinematic: [0.76, 0, 0.24, 1],
  /** Looping ambient motion (smoke, floating lotus). */
  drift: [0.45, 0, 0.55, 1],
  /** Fortune wheel: fast start, long decelerating tail. */
  wheel: [0.12, 0.8, 0.12, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export const duration = {
  micro: 0.3,
  base: 0.8,
  slow: 1.2,
  ritual: 1.5,
} as const;

export const stagger = {
  lines: 0.08,
  items: 0.06,
} as const;

export const transition = {
  base: { duration: duration.base, ease: ease.editorial },
  slow: { duration: duration.slow, ease: ease.editorial },
  ritual: { duration: duration.ritual, ease: ease.editorial },
  page: { duration: duration.slow, ease: ease.cinematic },
  micro: { duration: duration.micro, ease: ease.editorial },
} as const satisfies Record<string, Transition>;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.base },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: transition.base },
};

/** Curtain reveal from the bottom edge. */
export const reveal: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  visible: { clipPath: "inset(0% 0% 0% 0%)", transition: transition.page },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: { opacity: 1, scale: 1, transition: transition.slow },
};

export const lineExpand: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: transition.slow },
};

/** Parent variant that staggers its children line by line. */
export function staggerChildren(delayChildren = 0, gap: number = stagger.lines): Variants {
  return {
    hidden: {},
    visible: { transition: { delayChildren, staggerChildren: gap } },
  };
}

/** Entering page: ivory curtain lifts, content rises slightly. */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: transition.page },
};

/** Reduced-motion substitute: a short, position-free fade. */
export const reducedFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};
