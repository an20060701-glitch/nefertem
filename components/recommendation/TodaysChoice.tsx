"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCollection } from "@/components/collection/CollectionProvider";
import { PetalScatter } from "@/components/brand/PetalScatter";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { ease, transition } from "@/lib/motion";
import { explain, recommend, WHEEL_MIN, wheelCandidates } from "@/lib/recommendation";
import { saveSearch, savedSearch, todaysPicks } from "@/lib/recommendation/today";
import { FortuneWheel } from "./FortuneWheel";
import { MoodStep } from "./MoodStep";
import { OccasionStep } from "./OccasionStep";
import { RecommendationResult } from "./RecommendationResult";
import { STEPS, type Step, useChoiceFlow } from "./useChoiceFlow";
import { type PickerEntry, TodayPicker } from "./TodayPicker";
import { WeatherBar } from "./WeatherBar";

const PROGRESS: Record<Step, { zh: string; en: string }> = {
  occasion: { zh: "場合", en: "OCCASION" },
  mood: { zh: "印象", en: "IMPRESSION" },
  result: { zh: "今日香氣", en: "TODAY'S SCENT" },
};

const ALTERNATIVES = 3;

/**
 * Today's Choice ritual: today's weather (read, shown under the title) →
 * occasion → impression → today's scent,
 * with the fortune wheel for undecided days. Picks come only from the member's
 * own cabinet (An, 2026-10-06); an empty cabinet gets a nudge to add scents.
 */
export function TodaysChoice() {
  const flow = useChoiceFlow();
  const { step, selection, weather } = flow;
  const reduce = useReducedMotion();
  const { items, usage, repo, ready } = useCollection();
  const candidates = items;
  const emptyCabinet = ready && items.length === 0;

  const selectionKey = `${weather?.city}|${selection.occasion}|${selection.moods.join(",")}`;
  const [featured, setFeatured] = useState<{ key: string; id: string }>();
  const [confirmed, setConfirmed] = useState<{ key: string; id: string; viaWheel: boolean }>();
  const [wheelOpen, setWheelOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

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

  // A scent chosen earlier today (the usage log follows the account): coming back to the
  // page shows that result again instead of asking (An, 2026-10-07).
  // 「重新開始」 sets earlier picks aside for the day. It lives on the account, so pressing
  // it on one device asks again on every device signed in to it (An, 2026-10-07).
  const [restart, setRestart] = useState<{ repo: unknown; at?: number }>();
  useEffect(
    () =>
      repo.subscribeRestart(
        (at) => setRestart({ repo, at }),
        (error) => {
          console.error("[restart]", error);
          setRestart({ repo });
        },
      ),
    [repo],
  );
  const restartKnown = restart?.repo === repo;
  const restartAt = restartKnown ? restart?.at : undefined;
  const picks = useMemo(
    () => todaysPicks(usage).filter((p) => !restartAt || p.timestamp > restartAt),
    [usage, restartAt],
  );
  const answersKey = `restored|${selection.occasion}|${selection.moods.join(",")}`;
  const { resume, restart: restartFlow } = flow;

  // Follow today's pick as it changes on any device: show it when one is made (here or
  // elsewhere), and go back to the questions when it is set aside by 重新開始.
  const shownPick = useRef<string>(undefined);
  const firstLook = useRef(true);
  const first = picks[0];
  useEffect(() => {
    if (!ready || !restartKnown) return;
    const initial = firstLook.current;
    firstLook.current = false;
    if (!first) {
      if (shownPick.current === undefined) return;
      shownPick.current = undefined;
      window.setTimeout(() => {
        setConfirmed(undefined);
        setFeatured(undefined);
        restartFlow();
      }, 0);
      return;
    }
    if (shownPick.current === first.id) return;
    shownPick.current = first.id;
    // On arrival, a link to a particular step is kept (back / forward through the ritual).
    if (initial && new URLSearchParams(window.location.search).has("step")) return;
    // The pick carries its own answers (it may come from another device, or from after a
    // restart); this device adds only the city it last used today.
    const answers = new URLSearchParams({ occasion: first.occasion, mood: first.mood.join(",") });
    const city = new URLSearchParams(savedSearch() ?? "").get("city");
    if (city) answers.set("city", city);
    const saved = answers.toString();
    // After this render, so the state change is not part of the effect itself.
    window.setTimeout(() => {
      setConfirmed(
        (current) =>
          (current?.id === first.fragranceId ? current : undefined) ?? {
            key: `restored|${answers.get("occasion")}|${answers.get("mood")}`,
            id: first.fragranceId,
            viaWheel: first.viaWheel,
          },
      );
      if (!initial && new URLSearchParams(window.location.search).get("step") === "result") return;
      resume(saved);
    }, 0);
  }, [ready, restartKnown, first, resume, restartFlow]);

  const confirmedHere =
    confirmed && (confirmed.key === selectionKey || confirmed.key === answersKey) ? confirmed : undefined;

  // Today's answers stay on this device for the day, so the result can come back with its city.
  useEffect(() => {
    if (step === "result" && confirmedHere) saveSearch(window.location.search);
  }, [step, confirmedHere, selection.place, selectionKey]);
  const featuredId =
    confirmedHere?.id ?? (featured?.key === selectionKey ? featured.id : ranked[0]?.fragrance.id);
  const top = ranked.find((r) => r.fragrance.id === featuredId) ?? ranked[0];

  // 「今天想噴哪一瓶？」: today's recommendations first, then the rest of the cabinet by wears.
  const picker = useMemo(() => {
    const wears = new Map<string, number>();
    for (const u of usage) wears.set(u.fragranceId, (wears.get(u.fragranceId) ?? 0) + 1);
    const entry = (f: PickerEntry["fragrance"]): PickerEntry => ({
      fragrance: f,
      wears: wears.get(f.id) ?? 0,
    });
    const recommended = ranked.slice(0, ALTERNATIVES + 1).map((r) => entry(r.fragrance));
    const shown = new Set(recommended.map((e) => e.fragrance.id));
    const others = items
      .filter((f) => !shown.has(f.id))
      .map(entry)
      .sort((a, b) => b.wears - a.wears || a.fragrance.name.localeCompare(b.fragrance.name));
    return { recommended, others };
  }, [ranked, items, usage]);

  const [saveError, setSaveError] = useState<string>();
  const confirm = async (fragranceId: string, viaWheel: boolean) => {
    if (!weather || !selection.occasion) return;
    setSaveError(undefined);
    setWheelOpen(false);
    setPickerOpen(false);
    try {
      await repo.logUsage({
        fragranceId,
        weather: weather.condition,
        temperature: weather.temperature,
        city: weather.place ?? weather.city,
        occasion: selection.occasion,
        mood: selection.moods,
        viaWheel,
      });
      // A second pick is layered on today's scent, which stays the one shown.
      setConfirmed(confirmedHere ?? { key: selectionKey, id: fragranceId, viaWheel });
    } catch (error) {
      console.error("[usage] log failed", error);
      setSaveError("紀錄沒有完成，請再試一次。");
    }
  };

  // Move focus and view to the new step after user navigation (not on first paint).
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLElement>(null);
  const previousStep = useRef(step);
  useEffect(() => {
    if (previousStep.current === step) return;
    previousStep.current = step;
    // A question opens at the progress line above it; the result at its own stage.
    (step === "result" ? stageRef : progressRef).current?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
    const id = window.setTimeout(() => {
      document
        .getElementById(step === "result" ? "todays-scent" : `step-${step}`)
        ?.focus({ preventScroll: true });
    }, 650);
    return () => window.clearTimeout(id);
  }, [step, reduce]);

  const stepIndex = STEPS.indexOf(step);
  const asking = step !== "result";

  return (
    <section
      ref={sectionRef}
      id="todays-choice"
      aria-labelledby="choice-title"
      className="page-x relative scroll-mt-20 pb-20 pt-6 md:pt-[calc(var(--nav-desktop-height)+3rem)] desk:scroll-mt-16 desk:pb-28"
    >
      <PetalScatter side="left" />

      {/* Two columns on desktop (An, 2026-10-06): the title and today's weather on the left,
          the progress line and the question being asked on the right; the result spans both. */}
      <div className="relative grid gap-10 desk:grid-cols-12 desk:gap-x-6 desk:gap-y-0">
        <header
          className={cn(
            "desk:col-span-5",
            asking && "desk:sticky desk:top-28 desk:row-span-2 desk:self-start",
          )}
        >
          <p className="label text-muted desk:text-[0.875rem]">TODAY&apos;S CHOICE</p>
          <h2
            id="choice-title"
            className="mt-5 font-serif-zh text-h1-zh text-ink desk:mt-8 desk:text-[clamp(2.75rem,3.4vw,4rem)] desk:leading-[1.3]"
          >
            兩個問題
            <br />
            找到今天的你
          </h2>
          <WeatherBar
            place={selection.place}
            weather={weather}
            status={flow.weatherStatus}
            locateFailed={flow.locateFailed}
            onLocate={flow.locate}
            onAutoLocate={flow.autoLocate}
            onChooseCity={flow.chooseCity}
          />
        </header>
        <nav
          ref={progressRef}
          aria-label="儀式進度"
          className="scroll-mt-24 desk:col-span-7 desk:col-start-6 desk:scroll-mt-28 desk:pt-1"
        >
          <ol className="grid grid-cols-3 gap-3 desk:gap-6">
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

        <div
          ref={stageRef}
          className={cn(
            "relative min-h-[40svh] scroll-mt-24 md:min-h-[70svh] desk:scroll-mt-28",
            asking ? "mt-4 desk:col-span-7 desk:col-start-6 desk:mt-16" : "mt-16 desk:col-span-12 desk:mt-24",
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, y: reduce ? 0 : 30 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: reduce ? 0.2 : 0.9, ease: ease.editorial },
              }}
              exit={{
                opacity: 0,
                y: reduce ? 0 : -16,
                transition: { duration: reduce ? 0.15 : 0.45, ease: ease.editorial },
              }}
            >
              {emptyCabinet && step !== "result" && <FirstVisit />}
              {!emptyCabinet && step === "occasion" && (
                <OccasionStep occasion={selection.occasion} onChoose={flow.chooseOccasion} />
              )}
              {!emptyCabinet && step === "mood" && (
                <MoodStep
                  moods={selection.moods}
                  onToggle={flow.toggleMood}
                  onReveal={() => flow.goTo("result")}
                />
              )}
              {step === "result" &&
                (emptyCabinet ? (
                  <div className="flex max-w-[44rem] flex-col items-start gap-6">
                    <p className="font-serif-zh text-h2 text-ink">你的香水櫃還是空的。</p>
                    <p className="text-muted">
                      今日選香只從你自己的收藏推薦。先把手邊的香水放進香水櫃，再回來找今天的香氣。
                    </p>
                    <ButtonLink href="/collection">前往香水櫃 · MY COLLECTION</ButtonLink>
                  </div>
                ) : top && weather && selection.occasion ? (
                  <RecommendationResult
                    featured={top}
                    explanation={explain(top, {
                      weather,
                      occasion: selection.occasion,
                      moods: selection.moods,
                    })}
                    alternatives={ranked.filter((r) => r !== top).slice(0, ALTERNATIVES)}
                    canSpin={ranked.length >= WHEEL_MIN}
                    source={`從你的 ${items.length} 款收藏中挑選`}
                    confirmed={
                      confirmedHere && {
                        viaWheel: confirmedHere.viaWheel,
                        count: usage.filter((u) => u.fragranceId === confirmedHere.id).length,
                        savedTo: repo.kind,
                        inCollection: items.some((i) => i.id === confirmedHere.id),
                        layered: [
                          ...new Set(
                            picks
                              .filter((p) => p.fragranceId !== confirmedHere.id)
                              .map((p) => items.find((i) => i.id === p.fragranceId)?.name)
                              .filter((n): n is string => !!n),
                          ),
                        ],
                      }
                    }
                    saveError={saveError}
                    onAddToCollection={() => void repo.add({ ...top.fragrance }, { id: top.fragrance.id })}
                    onFeature={(id) => {
                      setFeatured({ key: selectionKey, id });
                      stageRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
                    }}
                    onChoose={() => setPickerOpen(true)}
                    onOpenWheel={() => setWheelOpen(true)}
                    onEditMood={() => flow.goTo("mood")}
                    onRestart={() => {
                      const now = Date.now();
                      shownPick.current = undefined;
                      setRestart({ repo, at: now });
                      // Today's pick (and anything layered on it) no longer counts as worn.
                      void repo
                        .undoUsage(picks, usage)
                        .catch((error: unknown) => console.error("[restart] undo", error));
                      void repo
                        .markRestarted(now)
                        .catch((error: unknown) => console.error("[restart]", error));
                      setConfirmed(undefined);
                      setFeatured(undefined);
                      flow.restart();
                    }}
                  />
                ) : flow.weatherStatus === "error" || (flow.locateFailed && !selection.place) ? (
                  <p className="font-serif-zh text-h2 text-ink">
                    還不知道今天的天氣。
                    <span className="mt-2 block text-body text-muted">請在上方選擇離你最近的城市。</span>
                  </p>
                ) : (
                  <div className="flex flex-col gap-4" aria-live="polite">
                    <span className="skeleton block h-24 w-full max-w-[40rem]" />
                    <p className="label text-muted">正在調配今天的香氣…</p>
                  </div>
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {pickerOpen && (
          <TodayPicker
            recommended={picker.recommended}
            others={picker.others}
            onChoose={(id) => confirm(id, false)}
            onClose={() => setPickerOpen(false)}
          />
        )}
      </AnimatePresence>

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

/**
 * First visit with an empty cabinet (An, 2026-10-06): the ritual can only pick
 * from the visitor's own scents, so it starts by sending them to add some.
 */
function FirstVisit() {
  return (
    <div className="flex max-w-[40rem] flex-col items-start gap-6 border-l border-gold pl-6 desk:pl-8">
      <p className="label text-gold-text">FIRST, YOUR CABINET</p>
      <p className="font-serif-zh text-h2 text-ink">歡迎。先把你的香水放進香水櫃。</p>
      <p className="text-muted">
        今天的香氣只會從你自己的收藏裡挑選。把手邊的香水加進「我的香水櫃」，加好之後再回來，回答兩個問題，就能找到今天的那一瓶。
      </p>
      <ButtonLink href="/collection">前往我的香水櫃 · MY COLLECTION</ButtonLink>
    </div>
  );
}
