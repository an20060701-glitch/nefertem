"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SunDisc } from "@/components/brand/SunDisc";
import { useIntroDelay } from "@/hooks/useIntroDelay";
import { BRAND } from "@/lib/brand";
import { fadeUp, reducedFade, scaleIn, staggerChildren, transition } from "@/lib/motion";
import { GoldParticles } from "./GoldParticles";
import { ReferenceImage } from "./ReferenceImage";
import { SmokeLayer } from "./SmokeLayer";
import { SpeechBubble } from "./SpeechBubble";

interface HeroProps {
  hasReferenceImage: boolean;
}

const EN_LINES = ["SCENT IS A WAY", "OF CHOOSING", "WHO YOU BECOME TODAY."];

/**
 * Immersive opening (design system §4.4, architecture §6).
 * Mobile: a vertical editorial stack. Desktop: the wordmark overlaps an arched
 * illustration that breaks out of the right edge of the grid.
 */
export function Hero({ hasReferenceImage }: HeroProps) {
  const reduce = useReducedMotion();
  const delay = useIntroDelay();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // 1–2% slow parallax on the illustration; the wordmark drifts a touch the other way.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "2%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-6%"]);

  const item = reduce ? reducedFade : fadeUp;

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="page-x relative overflow-x-clip pb-20 pt-4 md:pt-[calc(var(--nav-desktop-height)+2rem)] desk:min-h-svh desk:pb-28"
    >
      <motion.div
        className="relative grid grid-cols-1 gap-8 desk:grid-cols-12 desk:gap-6"
        initial="hidden"
        animate="visible"
        variants={staggerChildren(delay + 0.2, 0.12)}
      >
        {/* Wordmark + Chinese line */}
        <motion.div
          style={{ y: titleY }}
          className="relative z-10 flex flex-col desk:col-span-5 desk:col-start-1 desk:row-start-1 desk:pt-[9vh]"
        >
          <motion.p variants={item} className="label text-muted">
            {BRAND.museLine}
          </motion.p>
          <motion.h1
            id="hero-title"
            variants={item}
            className="mt-6 font-display text-[clamp(3.75rem,8.5vw,8rem)] font-light leading-[0.95] tracking-[0.01em] text-ink desk:mt-10"
          >
            {BRAND.coverTitle}
          </motion.h1>
          <motion.p variants={item} className="mt-3 font-display text-h2 font-light italic text-lotus-deep">
            A Life in Scent
          </motion.p>
          <motion.span
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: transition.slow } }}
            aria-hidden
            className="mt-6 block h-px w-24 origin-left bg-gold desk:mt-10 desk:w-40"
          />
          <motion.p variants={item} className="mt-6 font-serif-zh text-h1-zh text-ink desk:mt-10">
            {BRAND.coverLine}
          </motion.p>

          {/* English statement right under the Chinese line, then the way in */}
          <p className="mt-6 font-display text-h2 font-light italic leading-[1.15] text-ink/90 desk:mt-8">
            {EN_LINES.map((line) => (
              <motion.span key={line} variants={item} className="block">
                {line}
              </motion.span>
            ))}
          </p>
          <motion.a
            variants={item}
            href="#todays-choice"
            className="group mt-10 inline-flex w-fit items-center gap-4 text-blue desk:mt-12"
          >
            <span className="label gold-underline text-[0.875rem] desk:text-[0.9375rem]">
              BEGIN TODAY&apos;S RITUAL
            </span>
            <span
              aria-hidden
              className="h-px w-12 bg-blue transition-[width] duration-500 group-hover:w-20"
            />
          </motion.a>
        </motion.div>

        {/* The official illustration, printed onto the ivory page (multiply), with Ra's sun, vapour and motes */}
        <motion.figure
          variants={reduce ? reducedFade : scaleIn}
          className="relative -mx-[var(--gutter)] mt-24 md:mt-28 desk:col-span-7 desk:col-start-6 desk:row-span-2 desk:row-start-1 desk:-mr-[var(--gutter)] desk:ml-0 desk:mt-[14vh] desk:self-center"
        >
          <SpeechBubble
            delay={delay + 1.4}
            tail="left"
            // Upper right of the figure, beside the head (An, 2026-10-06).
            className="absolute -top-16 right-[4%] z-10 w-[min(16rem,62%)] md:-top-24 desk:-top-28 desk:right-[3%] desk:w-[19rem]"
          >
            {BRAND.coverVoice}
          </SpeechBubble>
          <div className="relative aspect-[4/3] overflow-hidden">
            <motion.div className="absolute inset-[-2%]" style={{ y: imageY }}>
              <ReferenceImage
                available={hasReferenceImage}
                priority
                sizes="(min-width: 1200px) 66vw, 100vw"
                className="mix-blend-multiply"
              />
            </motion.div>
            <GoldParticles />
            {/* Ivory veil at the left edge so the headline stays legible where it crosses the artwork */}
            <div
              aria-hidden
              className="absolute inset-y-0 left-0 hidden w-[22%] bg-gradient-to-r from-surface to-transparent desk:block"
            />
          </div>
          <SunDisc
            id="hero-sun"
            className="absolute -top-[7%] right-[8%] w-[16%] opacity-70 desk:-top-[9%] desk:right-[14%] desk:w-[12%]"
          />
          <SmokeLayer className="absolute bottom-[8%] left-[14%] h-[60%] w-[30%] opacity-80" />
          <figcaption className="sr-only">Nefertem：香氣與療癒之神，手持藍色睡蓮與香水瓶</figcaption>
        </motion.figure>

        {/* English statement + way in */}
      </motion.div>
    </section>
  );
}
