"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { isCityKey } from "@/lib/weather/cities";
import { MOODS } from "@/lib/fragrance/families";
import type { CityKey, Mood, Occasion, WeatherSnapshot } from "@/types";

/**
 * Today's Choice state (architecture §6.1). The URL is the source of truth —
 * `?step=mood&city=taipei&occasion=indoor&mood=mysterious,calm` — so a reload
 * keeps the ritual and the browser's back button returns to the previous step.
 * Exact coordinates never go into the URL; "here" means "ask the browser again".
 */
export const STEPS = ["weather", "occasion", "mood", "result"] as const;
export type Step = (typeof STEPS)[number];
export type Place = CityKey | "here";
export const MAX_MOODS = 2;

export interface Selection {
  place?: Place;
  occasion?: Occasion;
  moods: Mood[];
}

const URL_EVENT = "choiceflow:url";
const MOOD_KEYS = new Set<string>(MOODS.map((m) => m.key));

function subscribeUrl(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(URL_EVENT, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(URL_EVENT, callback);
  };
}

const getSearch = () => window.location.search;
const getServerSearch = () => "";

function parse(search: string): { requested: Step; selection: Selection } {
  const params = new URLSearchParams(search);
  const city = params.get("city");
  const place: Place | undefined = city === "here" ? "here" : isCityKey(city) ? city : undefined;
  const occasionParam = params.get("occasion");
  const occasion = occasionParam === "indoor" || occasionParam === "outdoor" ? occasionParam : undefined;
  const moods = [...new Set((params.get("mood") ?? "").split(","))]
    .filter((m): m is Mood => MOOD_KEYS.has(m))
    .slice(0, MAX_MOODS);
  const stepParam = params.get("step");
  const requested = (STEPS as readonly string[]).includes(stepParam ?? "") ? (stepParam as Step) : "weather";
  return { requested, selection: { place, occasion, moods } };
}

/** The furthest step the selection allows, never past the one requested. */
function reachableStep(requested: Step, s: Selection): Step {
  const ready: Record<Step, boolean> = {
    weather: true,
    occasion: !!s.place,
    mood: !!s.place && !!s.occasion,
    result: !!s.place && !!s.occasion && s.moods.length > 0,
  };
  let step: Step = "weather";
  for (const candidate of STEPS) {
    if (!ready[candidate]) break;
    step = candidate;
    if (candidate === requested) break;
  }
  return step;
}

function writeUrl(step: Step, s: Selection, mode: "push" | "replace") {
  const params = new URLSearchParams(window.location.search);
  const set = (key: string, value: string | undefined) =>
    value ? params.set(key, value) : params.delete(key);
  set("step", step === "weather" ? undefined : step);
  set("city", s.place);
  set("occasion", s.occasion);
  set("mood", s.moods.length ? s.moods.join(",") : undefined);
  const query = params.toString();
  const url = `${window.location.pathname}${query ? `?${query}` : ""}#todays-choice`;
  if (mode === "push") window.history.pushState(window.history.state, "", url);
  else window.history.replaceState(window.history.state, "", url);
  window.dispatchEvent(new Event(URL_EVENT));
}

export type WeatherStatus = "idle" | "locating" | "loading" | "ready" | "error";

interface Fetched {
  key: string;
  status: "ready" | "error";
  data?: WeatherSnapshot;
}

export function useChoiceFlow() {
  const search = useSyncExternalStore(subscribeUrl, getSearch, getServerSearch);
  const { requested, selection } = parse(search);
  const step = reachableStep(requested, selection);

  const [coords, setCoords] = useState<{ lat: number; lon: number }>();
  const [locating, setLocating] = useState(false);
  const [locateFailed, setLocateFailed] = useState(false);
  const [fetched, setFetched] = useState<Fetched>();

  const update = useCallback(
    (next: Partial<Selection>, nextStep: Step, mode: "push" | "replace" = "push") => {
      writeUrl(nextStep, { ...parse(window.location.search).selection, ...next }, mode);
    },
    [],
  );

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLocateFailed(true);
      return;
    }
    setLocating(true);
    setLocateFailed(false);
    navigator.geolocation.getCurrentPosition(
      ({ coords: c }) => {
        setLocating(false);
        setCoords({ lat: c.latitude, lon: c.longitude });
        if (parse(window.location.search).selection.place !== "here")
          update({ place: "here" }, "weather", "replace");
      },
      () => {
        setLocating(false);
        setLocateFailed(true);
        if (parse(window.location.search).selection.place === "here")
          update({ place: undefined }, "weather", "replace");
      },
      { timeout: 5000, maximumAge: 30 * 60 * 1000 },
    );
  }, [update]);

  // Today's weather starts from where the visitor is (An, 2026-10-06): ask once,
  // the first time the weather step is seen with no place chosen yet.
  const autoLocated = useRef(false);
  const autoLocate = useCallback(() => {
    if (autoLocated.current || parse(window.location.search).selection.place) return;
    autoLocated.current = true;
    locate();
  }, [locate]);

  // Restoring "here" after a reload: ask the browser again (it remembers the permission).
  const needsCoords = selection.place === "here" && !coords;
  useEffect(() => {
    if (!needsCoords) return;
    const id = window.setTimeout(locate, 0);
    return () => window.clearTimeout(id);
  }, [needsCoords, locate]);

  const fetchKey =
    selection.place === "here"
      ? coords && `lat=${coords.lat.toFixed(2)}&lon=${coords.lon.toFixed(2)}`
      : selection.place && `city=${selection.place}`;

  useEffect(() => {
    if (!fetchKey) return;
    const controller = new AbortController();
    fetch(`/api/weather?${fetchKey}`, { signal: controller.signal })
      .then((res) =>
        res.ok ? (res.json() as Promise<WeatherSnapshot>) : Promise.reject(new Error(String(res.status))),
      )
      .then((data) => setFetched({ key: fetchKey, status: "ready", data }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setFetched({ key: fetchKey, status: "error" });
        if (!(error instanceof DOMException)) console.error("[weather]", error);
      });
    return () => controller.abort();
  }, [fetchKey]);

  let weatherStatus: WeatherStatus = "idle";
  if (locating || needsCoords) weatherStatus = "locating";
  else if (fetchKey) weatherStatus = fetched?.key === fetchKey ? fetched.status : "loading";
  const weather = weatherStatus === "ready" ? fetched?.data : undefined;

  return {
    step,
    selection,
    weather,
    weatherStatus,
    locateFailed,
    locate,
    autoLocate,
    goTo: (next: Step) => update({}, next),
    chooseCity: (city: CityKey) => {
      setLocateFailed(false);
      update({ place: city }, "weather", "replace");
    },
    chooseOccasion: (occasion: Occasion) => update({ occasion }, "mood"),
    toggleMood: (mood: Mood) => {
      const current = selection.moods;
      const moods = current.includes(mood)
        ? current.filter((m) => m !== mood)
        : current.length < MAX_MOODS
          ? [...current, mood]
          : current;
      update({ moods }, "mood", "replace");
    },
    restart: () => update({ occasion: undefined, moods: [] }, "weather"),
  };
}
