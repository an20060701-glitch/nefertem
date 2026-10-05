"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { fadeUp, reducedFade } from "@/lib/motion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  as?: "div" | "section" | "li" | "p" | "h2" | "span";
  /** Fraction of the element that must be visible before it animates. */
  amount?: number;
}

/** Scroll-triggered entrance using the shared motion language; plays once. */
export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
  as = "div",
  amount = 0.3,
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={reduce ? reducedFade : variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </Tag>
  );
}
