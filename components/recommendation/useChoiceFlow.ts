"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { isCityKey } from "@/lib/weather/cities";
import { isFeeling, isScene } from "@/lib/recommendation/scenes";
import type { CityKey, Feeling, Scene, WeatherSnapshot } from "@/types";

/**
 * Today's Choice state (architecture §6.1). The URL is the source of truth —
 * `?step=feeling&city=taipei&scene=work&feeling=calm` — so a reload
 * keeps the ritual and the browser's back button returns to the previous step.
 * Exact coordinates never go into the URL; "here" means "ask the browser again".
 */
/**
 * Where you are going and the feeling you want are asked; the weather is read, not asked
 * (An, 2026-10-06). The questions follow An's scene guide (2026-10-11).
 */
export const STEPS = ["scene", "feeling", "result"] as const;
export type Step = (typeof STEPS)[number];
export type Place = CityKey | "here";
const PERMISSION_WAIT_MS = 10_000;

export interface Selection {
  place?: Place;
  scene?: Scene;
  feeling?: Feeling;
}

const URL_EVENT = "choiceflow:url";

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
  const scene = params.get("scene");
  const feeling = params.get("feeling");
  const stepParam = params.get("step");
  const requested = (STEPS as readonly string[]).includes(stepParam ?? "") ? (stepParam as Step) : "scene";
  return {
    requested,
    selection: {
      place,
      scene: isScene(scene) ? scene : undefined,
      feeling: isFeeling(feeling) ? feeling : undefined,
    },
  };
}

/** The furthest step the selection allows, never past the one requested. */
function reachableStep(requested: Step, s: Selection): Step {
  const ready: Record<Step, boolean> = {
    scene: true,
    feeling: !!s.scene,
    result: !!s.scene && !!s.feeling,
  };
  let step: Step = "scene";
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
  set("step", step === "scene" ? undefined : step);
  set("city", s.place);
  set("scene", s.scene);
  set("feeling", s.feeling);
  // Answers from before the scene guide (2026-10-11) are dropped from old links.
  set("occasion", undefined);
  set("mood", undefined);
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
  /** A new place keeps the visitor on the step they are on. */
  const setPlace = useCallback(
    (place: Place | undefined) => {
      const { requested, selection: current } = parse(window.location.search);
      update({ place }, reachableStep(requested, current), "replace");
    },
    [update],
  );

  const locate = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLocateFailed(true);
      return;
    }
    setLocating(true);
    setLocateFailed(false);
    // The browser's own timeout only starts once permission is given; don't sit on
    // 「正在確認你的位置…」 while the prompt is ignored. A late answer still counts.
    const unanswered = window.setTimeout(() => {
      setLocating(false);
      setLocateFailed(true);
      // A remembered "here" that the browser never answers would wait forever: offer the cities.
      if (parse(window.location.search).selection.place === "here") setPlace(undefined);
    }, PERMISSION_WAIT_MS);
    navigator.geolocation.getCurrentPosition(
      ({ coords: c }) => {
        window.clearTimeout(unanswered);
        setLocating(false);
        setLocateFailed(false);
        setCoords({ lat: c.latitude, lon: c.longitude });
        if (parse(window.location.search).selection.place !== "here") setPlace("here");
      },
      () => {
        window.clearTimeout(unanswered);
        setLocating(false);
        setLocateFailed(true);
        if (parse(window.location.search).selection.place === "here") setPlace(undefined);
      },
      { timeout: 5000, maximumAge: 30 * 60 * 1000 },
    );
  }, [setPlace]);

  // Today's weather starts from where the visitor is (An, 2026-10-06): ask once,
  // the first time the ritual is opened with no place chosen yet.
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

  /**
   * Back to today's result with answers given earlier today (a saved query string).
   * Answers saved without a place (today's pick came from another device or site) keep
   * the place already found here, or look for one — the result needs today's weather.
   */
  const resume = useCallback(
    (saved: string) => {
      const answers = parse(saved).selection;
      const place = answers.place ?? parse(window.location.search).selection.place;
      writeUrl("result", { ...answers, place }, "replace");
      if (!place) locate();
    },
    [locate],
  );

  const restart = useCallback(() => update({ scene: undefined, feeling: undefined }, "scene"), [update]);

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
      setPlace(city);
    },
    chooseScene: (scene: Scene) => update({ scene }, "feeling"),
    chooseFeeling: (feeling: Feeling) => update({ feeling }, "result"),
    restart,
    resume,
  };
}
