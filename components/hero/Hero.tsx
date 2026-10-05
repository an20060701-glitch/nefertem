"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { LotusGlyph } from "@/components/brand/LotusGlyph";
import { useIntroDelay } from "@/hooks/useIntroDelay";
import { ease, fadeUp, reducedFade, scaleIn, staggerChildren, transition } from "@/lib/motion";
import { GoldParticles } from "./GoldParticles";
import { ReferenceImage } from "./ReferenceImage";
import { SmokeLayer } from "./SmokeLayer";

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
        className="relative grid grid-cols-1 gap-10 desk:grid-cols-12 desk:gap-6"
        initial="hidden"
        animate="visible"
        variants={staggerChildren(delay + 0.2, 0.12)}
      >
        {/* Wordmark + Chinese line */}
        <motion.div
          style={{ y: titleY }}
          className="relative z-10 flex flex-col desk:col-span-7 desk:col-start-1 desk:row-start-1 desk:pt-[12vh]"
        >
          <motion.p variants={item} className="label text-muted">
            SCENT • RITUAL • MEMORY
          </motion.p>
          <motion.h1
            id="hero-title"
            variants={item}
            className="mt-5 font-display text-hero font-light text-ink desk:mt-8"
          >
            NEFERTEM
          </motion.h1>
          <motion.span
            variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: transition.slow } }}
            aria-hidden
            className="mt-6 block h-px w-24 origin-left bg-gold desk:mt-10 desk:w-40"
          />
          <motion.p
            variants={item}
            className="mt-6 max-w-[18em] font-serif-zh text-h1-zh text-ink desk:mt-10"
          >
            香氣，是你今天選擇成為誰的方式。
          </motion.p>
        </motion.div>

        {/* Arched illustration with vapour and gold motes */}
        <motion.figure
          variants={reduce ? reducedFade : scaleIn}
          className="relative mx-auto w-full max-w-[26rem] desk:col-span-6 desk:col-start-7 desk:row-span-2 desk:row-start-1 desk:-mr-[var(--gutter)] desk:max-w-none"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full desk:aspect-[5/6]">
            <motion.div className="absolute inset-[-3%]" style={{ y: imageY }}>
              <ReferenceImage
                available={hasReferenceImage}
                priority
                sizes="(min-width: 1200px) 50vw, 26rem"
              />
            </motion.div>
            <GoldParticles />
          </div>
          <SmokeLayer className="absolute -top-[18%] left-[8%] h-[70%] w-[55%] desk:-left-[12%]" />
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-blue desk:bottom-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.6, duration: 1.5, ease: ease.editorial }}
          >
            <span className="lotus-float block">
              <LotusGlyph size={56} strokeWidth={1} draw={!reduce} delay={delay + 0.6} drawDuration={1.6} />
            </span>
          </motion.div>
          <figcaption className="sr-only">Nefertem — 藍色睡蓮之神</figcaption>
        </motion.figure>

        {/* English statement + way in */}
        <motion.div
          variants={staggerChildren(0, 0.08)}
          className="relative z-10 mt-6 flex flex-col gap-10 desk:col-span-5 desk:col-start-1 desk:row-start-2 desk:mt-0 desk:self-end"
        >
          <p className="font-display text-h2 font-light italic leading-[1.15] text-ink/90">
            {EN_LINES.map((line) => (
              <motion.span key={line} variants={item} className="block">
                {line}
              </motion.span>
            ))}
          </p>
          <motion.a
            variants={item}
            href="#todays-choice"
            className="group inline-flex w-fit items-center gap-4 text-blue"
          >
            <span className="label gold-underline">BEGIN TODAY&apos;S RITUAL</span>
            <span
              aria-hidden
              className="h-px w-10 bg-blue transition-[width] duration-500 group-hover:w-16"
            />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
