"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { CITIES, CITY_KEYS, cityLabel } from "@/lib/weather/cities";
import { CONDITION_LABELS } from "@/lib/weather/labels";
import type { CityKey, WeatherSnapshot } from "@/types";
import { StepHeading } from "./StepHeading";
import type { Place, WeatherStatus } from "./useChoiceFlow";
import { useState } from "react";

interface WeatherStepProps {
  place?: Place;
  weather?: WeatherSnapshot;
  status: WeatherStatus;
  locateFailed: boolean;
  onLocate: () => void;
  onChooseCity: (city: CityKey) => void;
  onContinue: () => void;
}

/** STEP 01 — today's weather, from the browser's location or a default city. */
export function WeatherStep({
  place,
  weather,
  status,
  locateFailed,
  onLocate,
  onChooseCity,
  onContinue,
}: WeatherStepProps) {
  const [changing, setChanging] = useState(false);
  const failed = locateFailed || status === "error";
  const showCities = !weather || changing || failed;

  return (
    <div className="flex flex-col gap-12 desk:gap-16">
      <StepHeading index={1} label="THE WEATHER" question="今天的天氣如何？" glyph="ra" id="step-weather" />

      <div aria-live="polite" className="empty:hidden">
        {(status === "locating" || status === "loading") && (
          <div className="flex flex-col gap-4">
            <span className="skeleton block h-14 w-full max-w-[34rem] desk:h-24" />
            <p className="label text-muted">
              {status === "locating" ? "正在確認你的位置…" : "正在感受今天的空氣…"}
            </p>
          </div>
        )}
        {failed && status !== "locating" && status !== "loading" && (
          <p className="font-serif-zh text-h2 text-ink">
            暫時無法取得天氣。
            <span className="mt-2 block text-body text-muted">請選擇離你最近的城市。</span>
          </p>
        )}
        {status === "ready" && weather && !failed && (
          <div>
            <p className="font-display text-display font-light text-ink lining-nums">
              {weather.city} <span className="text-gold">·</span> {Math.round(weather.temperature)}°C{" "}
              <span className="text-gold">·</span>{" "}
              <span className="italic">{CONDITION_LABELS[weather.condition].en}</span>
            </p>
            <p className="mt-4 font-serif-zh text-lead text-muted">
              {cityLabel(weather.city)} · {Math.round(weather.temperature)}°C ·{" "}
              {CONDITION_LABELS[weather.condition].zh} · 濕度 {Math.round(weather.humidity)}%
            </p>
            {weather.source === "mock" && <p className="label mt-3 text-faint">示範天氣 · DEMO WEATHER</p>}
          </div>
        )}
      </div>

      {status === "ready" && weather && !failed && (
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
          <Button onClick={onContinue}>繼續 · CONTINUE</Button>
          {!changing && (
            <Button variant="text" onClick={() => setChanging(true)}>
              換一個城市
            </Button>
          )}
        </div>
      )}

      {showCities && status !== "locating" && (
        <div className="flex flex-col gap-8">
          {!failed && (
            <Button variant="ghost" className="w-fit" onClick={onLocate}>
              使用目前位置 · USE MY LOCATION
            </Button>
          )}
          <div>
            <p className="label text-muted">
              {failed ? "預設城市 · DEFAULT CITIES" : "或選擇城市 · OR CHOOSE A CITY"}
            </p>
            <div
              role="radiogroup"
              aria-label="選擇城市"
              className="mt-4 flex flex-wrap gap-x-8 gap-y-2 desk:gap-x-12"
            >
              {CITY_KEYS.map((key) => {
                const checked = place === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={checked}
                    onClick={() => {
                      setChanging(false);
                      onChooseCity(key);
                    }}
                    className={cn(
                      "group flex min-h-11 items-baseline gap-3 py-2 transition-colors duration-500",
                      checked ? "text-blue" : "text-ink hover:text-blue",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "size-1.5 self-center rounded-full bg-gold transition-opacity duration-500",
                        checked ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="font-serif-zh text-h1-zh font-extralight">{CITIES[key].zh}</span>
                    <span className="label text-faint group-hover:text-blue">{CITIES[key].en}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
