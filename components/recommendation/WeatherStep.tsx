"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { CITIES, CITY_KEYS, cityLabel } from "@/lib/weather/cities";
import { CONDITION_LABELS } from "@/lib/weather/labels";
import type { CityKey, WeatherSnapshot } from "@/types";
import { StepHeading } from "./StepHeading";
import type { Place, WeatherStatus } from "./useChoiceFlow";

interface WeatherStepProps {
  place?: Place;
  weather?: WeatherSnapshot;
  status: WeatherStatus;
  locateFailed: boolean;
  onLocate: () => void;
  onAutoLocate: () => void;
  onChooseCity: (city: CityKey) => void;
  onContinue: () => void;
}

/**
 * STEP 01 — today's weather where the visitor is. The site locates them as soon
 * as this step comes into view and fetches the local forecast; 「更改位置」 lets
 * them pick a city (or locate again) when the place is wrong.
 */
export function WeatherStep({
  place,
  weather,
  status,
  locateFailed,
  onLocate,
  onAutoLocate,
  onChooseCity,
  onContinue,
}: WeatherStepProps) {
  const [changing, setChanging] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Ask for the location when the step is actually on screen, not on page load.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || place) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        onAutoLocate();
      },
      { threshold: 0.3 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [place, onAutoLocate]);

  const busy = status === "locating" || status === "loading";
  const failed = !busy && (status === "error" || (locateFailed && !place));
  const ready = status === "ready" && !!weather && !failed;
  const showPicker = changing || failed;
  const placeZh = weather ? (weather.place ?? cityLabel(weather.city)) : "";

  return (
    <div ref={rootRef} className="flex flex-col gap-12 desk:gap-16">
      <StepHeading index={1} label="THE WEATHER" question="今天的天氣如何？" glyph="ra" id="step-weather" />

      <div aria-live="polite" className="empty:hidden">
        {(busy || (status === "idle" && !failed)) && (
          <div className="flex flex-col gap-4">
            <span className="skeleton block h-14 w-full max-w-[34rem] desk:h-24" />
            <p className="label text-muted">
              {status === "loading" ? "正在查詢當地今天的天氣…" : "正在確認你的位置…"}
            </p>
          </div>
        )}
        {failed && (
          <p className="font-serif-zh text-h2 text-ink">
            {status === "error" ? "暫時無法取得天氣。" : "沒有取得你的位置。"}
            <span className="mt-2 block text-body text-muted">
              {status === "error"
                ? "請選擇離你最近的城市。"
                : "請選擇離你最近的城市，或允許網站使用位置後重新定位。"}
            </span>
          </p>
        )}
        {ready && (
          <div>
            <p className="label text-muted">{place === "here" ? "你的位置 · YOUR LOCATION" : "選擇的城市 · CITY"}</p>
            <p className="mt-4 font-display text-display font-light text-ink lining-nums">
              {weather.city} <span className="text-gold">·</span> {Math.round(weather.temperature)}°C{" "}
              <span className="text-gold">·</span>{" "}
              <span className="italic">{CONDITION_LABELS[weather.condition].en}</span>
            </p>
            <p className="mt-4 font-serif-zh text-lead text-muted">
              {placeZh} · {Math.round(weather.temperature)}°C · {CONDITION_LABELS[weather.condition].zh} · 濕度{" "}
              {Math.round(weather.humidity)}%
            </p>
            {weather.source === "mock" && <p className="label mt-3 text-faint">示範天氣 · DEMO WEATHER</p>}
            {weather.source === "open-meteo" && (
              <p className="mt-3 text-small text-faint">
                天氣資料{" "}
                <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline">
                  Open-Meteo.com
                </a>
                {weather.place && place === "here" && (
                  <>
                    {" "}· 地名 ©{" "}
                    <a
                      href="https://www.openstreetmap.org/copyright"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      OpenStreetMap contributors
                    </a>
                  </>
                )}
              </p>
            )}
          </div>
        )}
      </div>

      {ready && (
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
          <Button onClick={onContinue}>繼續 · CONTINUE</Button>
          <Button variant="text" aria-expanded={changing} onClick={() => setChanging((open) => !open)}>
            {changing ? "收起" : "更改位置 · CHANGE LOCATION"}
          </Button>
        </div>
      )}

      {showPicker && !busy && (
        <div className="flex flex-col gap-8">
          <Button
            variant="ghost"
            className="w-fit"
            onClick={() => {
              setChanging(false);
              onLocate();
            }}
          >
            重新定位 · USE MY LOCATION
          </Button>
          <div>
            <p className="label text-muted">或選擇城市 · OR CHOOSE A CITY</p>
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
