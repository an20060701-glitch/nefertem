"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { useIntroDelay } from "@/hooks/useIntroDelay";
import { BRAND } from "@/lib/brand";
import { ease, fadeUp, reducedFade, staggerChildren, transition } from "@/lib/motion";

const EN_LINES = ["SCENT IS A WAY", "OF CHOOSING", "WHO YOU BECOME TODAY."];

/** An's cover art (2026-10-06), with its baked-in text painted out by scripts/cover/clean.py. */
const COVER_IMAGE = "/images/cover.webp";
const COVER_ALT =
  "Nefertem 封面：藍紫水彩中，頭戴藍色睡蓮的香氣之神手持香水瓶與睡蓮，對話框寫著「讓香氣定義此刻的自己」";

/**
 * Immersive opening (design system §4.4, architecture §6).
 * The cover is An's supplied artwork as is (2026-10-06): the watercolour, the figure
 * and its speech bubble are one image; the wordmark and lines are set live on its
 * white left side. Phones show the figure first, then the text.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const delay = useIntroDelay();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Slow parallax: the art sinks a touch, the wordmark drifts the other way.
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "3%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-6%"]);

  const item = reduce ? reducedFade : fadeUp;

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="page-x relative flex flex-col overflow-x-clip pb-20 desk:min-h-svh desk:justify-center desk:pb-16 desk:pt-[var(--nav-desktop-height)]"
    >
      {/* The art: full-bleed behind the text on desktop, a block above it on phones and tablets */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0.2 : 2, delay, ease: ease.editorial }}
        className="cover-art relative -mx-[var(--gutter)] aspect-square overflow-hidden md:aspect-[16/10] desk:absolute desk:inset-0 desk:-z-10 desk:mx-0 desk:aspect-auto"
      >
        <motion.div className="absolute inset-0" style={{ y: imageY }}>
          <Image
            src={COVER_IMAGE}
            alt={COVER_ALT}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[94%_50%] md:object-[70%_40%] desk:object-[72%_top]"
          />
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y: titleY }}
        initial="hidden"
        animate="visible"
        variants={staggerChildren(delay + 0.3, 0.12)}
        className="relative z-10 mt-10 flex flex-col desk:mt-[5vh] desk:w-[40%] desk:max-w-[36rem]"
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
          {BRAND.logoLine}
        </motion.p>
        <motion.span
          variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: transition.slow } }}
          aria-hidden
          className="mt-6 block h-px w-24 origin-left bg-gold desk:mt-10 desk:w-44"
        />
        <motion.p variants={item} className="mt-6 font-serif-zh text-h1-zh text-ink desk:mt-10">
          {BRAND.coverLine}
        </motion.p>
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
          className="group mt-10 inline-flex w-fit items-center gap-4 text-blue desk:mt-14"
        >
          <span className="label gold-underline text-[0.875rem] desk:text-[0.9375rem]">
            BEGIN TODAY&apos;S RITUAL
          </span>
          <span aria-hidden className="h-px w-12 bg-blue transition-[width] duration-500 group-hover:w-20" />
        </motion.a>
      </motion.div>
    </section>
  );
}
