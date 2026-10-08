"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { CITIES, CITY_KEYS, cityLabel } from "@/lib/weather/cities";
import { CONDITION_LABELS } from "@/lib/weather/labels";
import type { CityKey, WeatherSnapshot } from "@/types";
import type { Place, WeatherStatus } from "./useChoiceFlow";

interface WeatherBarProps {
  place?: Place;
  weather?: WeatherSnapshot;
  status: WeatherStatus;
  locateFailed: boolean;
  onLocate: () => void;
  onAutoLocate: () => void;
  onChooseCity: (city: CityKey) => void;
}

/**
 * Today's weather, read rather than asked (An, 2026-10-06): located as the ritual
 * opens and set as one quiet line under 「找到今天的你」. 「更改位置」 stays for a
 * wrong fix; a refused or failed location opens the city list by itself.
 */
export function WeatherBar({
  place,
  weather,
  status,
  locateFailed,
  onLocate,
  onAutoLocate,
  onChooseCity,
}: WeatherBarProps) {
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    if (!place) onAutoLocate();
  }, [place, onAutoLocate]);

  const busy = status === "locating" || status === "loading";
  const failed = !busy && (status === "error" || (locateFailed && !place));
  const ready = status === "ready" && !!weather && !failed;
  const showPicker = changing || failed;

  return (
    <div aria-live="polite" className="mt-5 desk:mt-8">
      {(busy || (status === "idle" && !failed)) && (
        <p className="label text-muted">
          {status === "loading" ? "正在查詢當地今天的天氣…" : "正在確認你的位置…"}
        </p>
      )}

      {ready && (
        <div>
          <p className="font-serif-zh text-lead text-ink lining-nums max-md:text-[0.9375rem] max-md:leading-snug desk:text-[clamp(1.5rem,1.6vw,2rem)] desk:leading-snug">
            {weather.place ?? cityLabel(weather.city)} · {CONDITION_LABELS[weather.condition].zh} ·{" "}
            {Math.round(weather.temperature)}°C · 濕度 {Math.round(weather.humidity)}%
          </p>
          <p className="label mt-2 text-faint max-md:hidden desk:mt-3 desk:text-[0.8125rem]">
            {weather.city} · {Math.round(weather.temperature)}°C · {CONDITION_LABELS[weather.condition].en}
            {weather.source === "mock" && " · DEMO WEATHER"}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-small text-faint max-md:mt-2 max-md:gap-y-1.5 max-md:text-[0.6875rem] max-md:leading-snug desk:mt-4">
            <button
              type="button"
              aria-expanded={changing}
              onClick={() => setChanging((open) => !open)}
              className="gold-underline text-blue max-md:text-small desk:text-body"
            >
              {changing ? "收起" : "更改位置"}
            </button>
            {weather.source === "open-meteo" && (
              <span>
                天氣資料{" "}
                <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline">
                  Open-Meteo.com
                </a>
                {weather.place && place === "here" && (
                  <>
                    {" "}
                    · 地名 ©{" "}
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
              </span>
            )}
          </div>
        </div>
      )}

      {failed && (
        <p className="text-muted">
          {status === "error"
            ? "暫時無法取得天氣，請選擇離你最近的城市。"
            : "沒有取得你的位置，請選擇離你最近的城市。"}
        </p>
      )}

      {showPicker && !busy && (
        <div
          className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1"
          role="radiogroup"
          aria-label="選擇城市"
        >
          <button
            type="button"
            onClick={() => {
              setChanging(false);
              onLocate();
            }}
            className="gold-underline min-h-11 text-small text-blue desk:text-body"
          >
            重新定位
          </button>
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
                  "min-h-11 font-serif-zh transition-colors duration-500 desk:text-lead",
                  checked ? "text-blue" : "text-ink hover:text-blue",
                )}
              >
                {CITIES[key].zh}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
