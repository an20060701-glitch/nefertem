"use client";

import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";
import { useRef } from "react";
import { PetalScatter } from "@/components/brand/PetalScatter";
import { useIntroDelay } from "@/hooks/useIntroDelay";
import { BRAND } from "@/lib/brand";
import { ease, fadeUp, reducedFade, staggerChildren, transition } from "@/lib/motion";
import { CoverWash } from "./CoverWash";
import { GoldParticles } from "./GoldParticles";
import { ReferenceImage } from "./ReferenceImage";
import { SmokeLayer } from "./SmokeLayer";
import { SpeechBubble } from "./SpeechBubble";

interface HeroProps {
  hasReferenceImage: boolean;
}

const EN_LINES = ["SCENT IS A WAY", "OF CHOOSING", "WHO YOU BECOME TODAY."];

/** The figure surfaces from the wash: a very slow fade and a slight rise, no zoom. */
const figureIn: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 2.4, ease: ease.editorial } },
};

/**
 * Immersive opening (design system §4.4, architecture §6; An's cover spec, 2026-10-06).
 * Desktop: ~42% quiet text on near-white paper at the left, ~58% art at the right,
 * where the figure dissolves into the watercolour and runs off the right edge.
 * Mobile: the figure first, then the wordmark, slogan and the way in.
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
      {/* Watercolour wash (An, 2026-10-06): white margin top-left → lavender mist → blue-violet → indigo ink. */}
      <CoverWash delay={delay} />
      <PetalScatter side="hero" drift={!reduce} className="hidden md:block" />
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

        {/* The official illustration, its paper made transparent so the wash runs through it, with vapour and motes */}
        <motion.figure
          variants={reduce ? reducedFade : figureIn}
          // Phones: first in the stack, under the top bar. Desktop: from the 5th of 12
          // columns to past the right edge, so it can cross into the text's margin.
          className="relative order-first -mx-[var(--gutter)] mt-24 md:mt-28 desk:order-none desk:col-span-8 desk:col-start-5 desk:row-span-2 desk:row-start-1 desk:-mr-[calc(var(--gutter)+2vw)] desk:ml-0 desk:-mb-28 desk:mt-[12vh] desk:w-[calc(100%-1.5vw)] desk:max-w-[112svh] desk:self-end desk:justify-self-end"
        >
          <SpeechBubble
            delay={delay + 1.4}
            tail="left"
            // Upper right of the figure (An, 2026-10-06); on desktop its left edge sits
            // above the rightmost petal of the lotus crown, at ~52% of the illustration.
            className="absolute -top-16 right-[4%] z-10 w-[min(16rem,62%)] md:-top-24 desk:-top-28 desk:right-auto desk:left-[52%] desk:w-[19rem]"
          >
            {BRAND.coverVoice}
          </SpeechBubble>
          <div className="relative aspect-[4/3]">
            <motion.div className="absolute inset-[-2%]" style={{ y: imageY }}>
              <ReferenceImage
                available={hasReferenceImage}
                transparent
                priority
                sizes="(min-width: 1200px) 66vw, 100vw"
              />
            </motion.div>
            <GoldParticles />
          </div>
          <SmokeLayer className="absolute bottom-[8%] left-[14%] h-[60%] w-[30%] opacity-80" />
          <figcaption className="sr-only">Nefertem：香氣與療癒之神，手持藍色睡蓮與香水瓶</figcaption>
        </motion.figure>

        {/* English statement + way in */}
      </motion.div>
    </section>
  );
}
