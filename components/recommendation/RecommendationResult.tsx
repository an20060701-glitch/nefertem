"use client";

import { motion, useReducedMotion } from "motion/react";
import { HairlineHeading } from "@/components/brand/EditorialHeading";
import { SunDisc } from "@/components/brand/SunDisc";
import { FamilyDot } from "@/components/fragrance/FamilyDot";
import { FragranceBottle } from "@/components/fragrance/FragranceBottle";
import { Button } from "@/components/ui/Button";
import { noteInfo } from "@/data/notes";
import { cn } from "@/lib/cn";
import { fadeUp, reducedFade, reveal, staggerChildren } from "@/lib/motion";
import type { Explanation, Recommendation } from "@/lib/recommendation";

const LAYERS = [
  { key: "topNotes", en: "TOP", zh: "前調" },
  { key: "heartNotes", en: "HEART", zh: "中調" },
  { key: "baseNotes", en: "BASE", zh: "後調" },
] as const;

interface RecommendationResultProps {
  featured: Recommendation;
  explanation: Explanation;
  alternatives: Recommendation[];
  canSpin: boolean;
  confirmed?: { count: number; viaWheel: boolean };
  onFeature: (id: string) => void;
  onConfirm: () => void;
  onOpenWheel: () => void;
  onEditMood: () => void;
  onRestart: () => void;
}

/** TODAY'S SCENT — a magazine spread: the flacon on the left, the story on the right. */
export function RecommendationResult({
  featured,
  explanation,
  alternatives,
  canSpin,
  confirmed,
  onFeature,
  onConfirm,
  onOpenWheel,
  onEditMood,
  onRestart,
}: RecommendationResultProps) {
  const reduce = useReducedMotion();
  const item = reduce ? reducedFade : fadeUp;
  const f = featured.fragrance;

  return (
    <motion.article
      key={f.id}
      aria-labelledby="todays-scent"
      initial="hidden"
      animate="visible"
      variants={staggerChildren(0.1, 0.1)}
      className="grid gap-12 desk:grid-cols-12 desk:gap-6"
    >
      {/* Flacon under Ra's sun */}
      <motion.figure
        variants={reduce ? reducedFade : reveal}
        className="relative mx-auto w-full max-w-[20rem] desk:sticky desk:top-28 desk:col-span-5 desk:max-w-[26rem] desk:self-start"
      >
        <div className="relative aspect-[4/5]">
          <SunDisc id="result-sun" className="absolute left-1/2 top-0 w-[78%] -translate-x-1/2 opacity-60" />
          <FragranceBottle
            family={f.family}
            label={`${f.brand} ${f.name} 的瓶身線稿`}
            className="absolute bottom-0 left-1/2 w-[52%] -translate-x-1/2"
          />
        </div>
        {f.origin === "demo" && (
          <figcaption className="label mt-6 text-center text-faint">示範資料 · DEMO DATA</figcaption>
        )}
      </motion.figure>

      <div className="desk:col-span-6 desk:col-start-7">
        <motion.p variants={item} className="label text-gold-text">
          TODAY&apos;S SCENT
        </motion.p>
        <motion.p variants={item} className="mt-4 font-serif-zh text-h2 text-ink">
          今天，這款香氣很適合你。
        </motion.p>
        <motion.p variants={item} className="label mt-10 text-muted">
          {f.brand}
        </motion.p>
        <motion.h3
          variants={item}
          id="todays-scent"
          className="mt-3 font-display text-display font-light text-ink"
        >
          {f.name}
        </motion.h3>
        <motion.div variants={item} className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          <FamilyDot family={f.family} />
          {featured.favourite && <span className="label text-lotus-deep">你的常用香氣 · YOUR SIGNATURE</span>}
        </motion.div>
        {f.description && (
          <motion.p variants={item} className="mt-6 max-w-[30em] text-muted">
            {f.description}
          </motion.p>
        )}

        <motion.dl variants={item} className="mt-10 border-t border-line">
          {LAYERS.map((layer) =>
            f[layer.key].length ? (
              <div key={layer.key} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-line py-4">
                <dt>
                  <span className="label block text-ink">{layer.en}</span>
                  <span className="text-small text-faint">{layer.zh}</span>
                </dt>
                <dd className="font-serif-zh text-ink">
                  {f[layer.key].map((n) => noteInfo(n)?.zh ?? n).join("・")}
                  <span className="mt-1 block font-display text-small italic text-faint">
                    {f[layer.key].map((n) => noteInfo(n)?.en ?? n).join(", ")}
                  </span>
                </dd>
              </div>
            ) : null,
          )}
        </motion.dl>

        <motion.section variants={item} aria-labelledby="why-title" className="mt-14">
          <HairlineHeading as="h4">
            <span id="why-title">
              為什麼推薦給你？ <span className="text-faint">WHY THIS SCENT?</span>
            </span>
          </HairlineHeading>
          <blockquote className="relative mt-8 pl-8 desk:pl-10">
            <span
              aria-hidden
              className="absolute -top-4 left-0 font-display text-numeral leading-none text-gold"
            >
              &ldquo;
            </span>
            <p className="font-serif-zh text-lead text-ink">{explanation.lead}</p>
            {explanation.details.map((d) => (
              <p key={d} className="mt-3 text-muted">
                {d}
              </p>
            ))}
          </blockquote>
        </motion.section>

        <motion.div variants={item} className="mt-14" aria-live="polite">
          {confirmed ? (
            <div className="border-l border-gold pl-6">
              <p className="font-serif-zh text-h2 text-ink">今天，就是 {f.name}。</p>
              <p className="mt-3 text-muted">
                已記在這台裝置{confirmed.count > 1 ? `，這是你第 ${confirmed.count} 次選擇它` : ""}
                。登入後，紀錄會同步到你的香水櫃。
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
              <Button onClick={onConfirm}>就決定是你了</Button>
              {canSpin && (
                <Button variant="text" onClick={onOpenWheel}>
                  選擇障礙？CAN&apos;T DECIDE?
                </Button>
              )}
            </div>
          )}
        </motion.div>

        {alternatives.length > 0 && (
          <motion.section variants={item} aria-labelledby="also-title" className="mt-20">
            <HairlineHeading as="h4">
              <span id="also-title">
                也很適合 <span className="text-faint">ALSO FOR TODAY</span>
              </span>
            </HairlineHeading>
            <ul className="mt-2">
              {alternatives.map((alt) => (
                <li key={alt.fragrance.id} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => onFeature(alt.fragrance.id)}
                    className="group flex min-h-16 w-full items-center justify-between gap-6 py-4 text-left"
                  >
                    <span>
                      <span className="label block text-faint">{alt.fragrance.brand}</span>
                      <span className="mt-1 block font-display text-h2 font-light text-ink transition-colors duration-500 group-hover:text-blue">
                        {alt.fragrance.name}
                      </span>
                    </span>
                    <FamilyDot family={alt.fragrance.family} className="shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        <motion.div variants={item} className={cn("mt-14 flex flex-wrap gap-x-10 gap-y-2")}>
          <Button variant="text" onClick={onEditMood}>
            ← 換個印象
          </Button>
          <Button variant="text" onClick={onRestart}>
            重新開始 · START OVER
          </Button>
        </motion.div>
      </div>
    </motion.article>
  );
}
