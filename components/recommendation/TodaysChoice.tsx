"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCollection } from "@/components/collection/CollectionProvider";
import { PetalScatter } from "@/components/brand/PetalScatter";
import { Button } from "@/components/ui/Button";
import { DEMO_FRAGRANCES } from "@/data/fragrances";
import { cn } from "@/lib/cn";
import { ease, transition } from "@/lib/motion";
import { explain, recommend, WHEEL_MIN, wheelCandidates } from "@/lib/recommendation";
import { FortuneWheel } from "./FortuneWheel";
import { MoodStep } from "./MoodStep";
import { OccasionStep } from "./OccasionStep";
import { RecommendationResult } from "./RecommendationResult";
import { STEPS, type Step, useChoiceFlow } from "./useChoiceFlow";
import { WeatherStep } from "./WeatherStep";

const PROGRESS: Record<Step, { zh: string; en: string }> = {
  weather: { zh: "天氣", en: "WEATHER" },
  occasion: { zh: "場合", en: "OCCASION" },
  mood: { zh: "印象", en: "IMPRESSION" },
  result: { zh: "今日香氣", en: "TODAY'S SCENT" },
};

const ALTERNATIVES = 3;

/**
 * Today's Choice ritual: weather → occasion → impression → today's scent,
 * with the fortune wheel for undecided days. Guests choose from the demo
 * catalogue; their choices are kept on this device until sign-in (Phase 3).
 */
export function TodaysChoice() {
  const flow = useChoiceFlow();
  const { step, selection, weather } = flow;
  const reduce = useReducedMotion();
  const { items, usage, repo } = useCollection();
  // Recommend from the member's own cabinet; the demo catalogue until it has a scent.
  const fromCollection = items.length > 0;
  const candidates = fromCollection ? items : DEMO_FRAGRANCES;

  const selectionKey = `${weather?.city}|${selection.occasion}|${selection.moods.join(",")}`;
  const [featured, setFeatured] = useState<{ key: string; id: string }>();
  const [confirmed, setConfirmed] = useState<{ key: string; id: string; viaWheel: boolean }>();
  const [wheelOpen, setWheelOpen] = useState(false);

  const ranked = useMemo(() => {
    if (!weather || !selection.occasion || selection.moods.length === 0) return [];
    return recommend({
      weather,
      occasion: selection.occasion,
      moods: selection.moods,
      candidates,
      usage,
    });
  }, [weather, selection.occasion, selection.moods, usage, candidates]);

  const confirmedHere = confirmed?.key === selectionKey ? confirmed : undefined;
  const featuredId =
    confirmedHere?.id ?? (featured?.key === selectionKey ? featured.id : ranked[0]?.fragrance.id);
  const top = ranked.find((r) => r.fragrance.id === featuredId) ?? ranked[0];

  const [saveError, setSaveError] = useState<string>();
  const confirm = async (fragranceId: string, viaWheel: boolean) => {
    if (!weather || !selection.occasion) return;
    setSaveError(undefined);
    setWheelOpen(false);
    try {
      await repo.logUsage({
        fragranceId,
        weather: weather.condition,
        temperature: weather.temperature,
        city: weather.city,
        occasion: selection.occasion,
        mood: selection.moods,
        viaWheel,
      });
      setConfirmed({ key: selectionKey, id: fragranceId, viaWheel });
    } catch (error) {
      console.error("[usage] log failed", error);
      setSaveError("紀錄沒有完成，請再試一次。");
    }
  };

  // Move focus and view to the new step after user navigation (not on first paint).
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const previousStep = useRef(step);
  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    stageRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    const id = window.setTimeout(() => {
      document
        .getElementById(step === "result" ? "todays-scent" : `step-${step}`)
        ?.focus({ preventScroll: true });
    }, 650);
    return () => window.clearTimeout(id);
  }, [step, reduce]);

  const stepIndex = STEPS.indexOf(step);

  return (
    <section
      ref={sectionRef}
      id="todays-choice"
      aria-labelledby="choice-title"
      className="page-x relative scroll-mt-20 border-t border-line py-20 desk:scroll-mt-16 desk:py-28"
    >
      <PetalScatter side="left" />

      <header className="relative grid gap-10 desk:grid-cols-12 desk:items-end desk:gap-6">
        <div className="desk:col-span-5">
          <p className="label text-muted">TODAY&apos;S CHOICE</p>
          <h2 id="choice-title" className="mt-5 font-serif-zh text-h1-zh text-ink">
            三個問題
            <br />
            找到今天的你
          </h2>
        </div>
        <nav aria-label="儀式進度" className="desk:col-span-7 desk:col-start-6">
          <ol className="grid grid-cols-4 gap-3 desk:gap-6">
            {STEPS.map((s, i) => {
              const done = i < stepIndex;
              const current = i === stepIndex;
              return (
                <li key={s}>
                  <button
                    type="button"
                    disabled={!done}
                    onClick={() => flow.goTo(s)}
                    aria-current={current ? "step" : undefined}
                    className="group flex w-full flex-col items-start gap-2 text-left disabled:cursor-default"
                  >
                    <span className="relative block h-px w-full bg-line">
                      <motion.span
                        className="absolute inset-0 origin-left bg-gold"
                        initial={false}
                        animate={{ scaleX: done || current ? 1 : 0 }}
                        transition={transition.slow}
                      />
                    </span>
                    <span
                      className={cn(
                        "label",
                        current ? "text-ink" : done ? "text-muted group-hover:text-blue" : "text-faint",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                      <span className="hidden md:inline"> {PROGRESS[s].en}</span>
                    </span>
                    <span className={cn("text-small", current ? "text-ink" : "text-faint")}>
                      {PROGRESS[s].zh}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </header>

      <div ref={stageRef} className="relative mt-16 min-h-[70svh] scroll-mt-24 desk:mt-24 desk:scroll-mt-28">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: reduce ? 0 : 30 }}
            animate={{ opacity: 1, y: 0, transition: { duration: reduce ? 0.2 : 0.9, ease: ease.editorial } }}
            exit={{
              opacity: 0,
              y: reduce ? 0 : -16,
              transition: { duration: reduce ? 0.15 : 0.45, ease: ease.editorial },
            }}
          >
            {step === "weather" && (
              <WeatherStep
                place={selection.place}
                weather={weather}
                status={flow.weatherStatus}
                locateFailed={flow.locateFailed}
                onLocate={flow.locate}
                onChooseCity={flow.chooseCity}
                onContinue={() => flow.goTo("occasion")}
              />
            )}
            {step === "occasion" && (
              <OccasionStep occasion={selection.occasion} onChoose={flow.chooseOccasion} />
            )}
            {step === "mood" && (
              <MoodStep
                moods={selection.moods}
                onToggle={flow.toggleMood}
                onReveal={() => flow.goTo("result")}
              />
            )}
            {step === "result" &&
              (top && weather && selection.occasion ? (
                <RecommendationResult
                  featured={top}
                  explanation={explain(top, {
                    weather,
                    occasion: selection.occasion,
                    moods: selection.moods,
                  })}
                  alternatives={ranked.filter((r) => r !== top).slice(0, ALTERNATIVES)}
                  canSpin={ranked.length >= WHEEL_MIN}
                  source={
                    fromCollection
                      ? `從你的 ${items.length} 款收藏中挑選`
                      : "目前從示範目錄推薦，把你的香水放進香水櫃後，就會從你的收藏挑選。"
                  }
                  confirmed={
                    confirmedHere && {
                      viaWheel: confirmedHere.viaWheel,
                      count: usage.filter((u) => u.fragranceId === confirmedHere.id).length,
                      savedTo: repo.kind,
                      inCollection: items.some((i) => i.id === confirmedHere.id),
                    }
                  }
                  saveError={saveError}
                  onAddToCollection={() => void repo.add({ ...top.fragrance }, { id: top.fragrance.id })}
                  onFeature={(id) => {
                    setFeatured({ key: selectionKey, id });
                    stageRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
                  }}
                  onConfirm={() => confirm(top.fragrance.id, false)}
                  onOpenWheel={() => setWheelOpen(true)}
                  onEditMood={() => flow.goTo("mood")}
                  onRestart={() => {
                    setConfirmed(undefined);
                    setFeatured(undefined);
                    flow.restart();
                  }}
                />
              ) : flow.weatherStatus === "error" ? (
                <div className="flex flex-col items-start gap-6">
                  <p className="font-serif-zh text-h2 text-ink">暫時無法取得天氣。</p>
                  <Button variant="ghost" onClick={() => flow.goTo("weather")}>
                    選擇城市
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4" aria-live="polite">
                  <span className="skeleton block h-24 w-full max-w-[40rem]" />
                  <p className="label text-muted">正在調配今天的香氣…</p>
                </div>
              ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {wheelOpen && (
          <FortuneWheel
            candidates={wheelCandidates(ranked)}
            onClose={() => setWheelOpen(false)}
            onConfirm={(id) => confirm(id, true)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
