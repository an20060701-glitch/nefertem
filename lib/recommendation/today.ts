import type { UsageLog } from "@/types";

/**
 * Today's choice, kept (An, 2026-10-07): once a scent is chosen for today, coming
 * back to 香水選擇 shows that result instead of asking again. The picks come from
 * the usage log, so they follow the member's account; the ritual's own answers
 * (city, occasion, impression) are remembered on this device for the day.
 */
const STORAGE_KEY = "nefertem:todays-choice";

/** Local calendar day, e.g. "2026-10-07". */
export function dayKey(time: number): string {
  const d = new Date(time);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Today's wears, oldest first: the first is today's scent, the rest are layered on it. */
export function todaysPicks(usage: readonly UsageLog[], now = Date.now()): UsageLog[] {
  const today = dayKey(now);
  return usage.filter((u) => dayKey(u.timestamp) === today).sort((a, b) => a.timestamp - b.timestamp);
}

/** The ritual's query string saved for today, if any. */
export function savedSearch(now = Date.now()): string | undefined {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as {
      day?: string;
      search?: string;
    } | null;
    return saved?.day === dayKey(now) && typeof saved.search === "string" ? saved.search : undefined;
  } catch {
    return undefined;
  }
}

export function saveSearch(search: string, now = Date.now()) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ day: dayKey(now), search }));
  } catch {
    // Private mode or blocked storage: the answers come back from the usage log instead.
  }
}

const RESTART_KEY = "nefertem:choice-restarted";

/**
 * 「重新開始」 (An, 2026-10-07): today's result is set aside, and stays set aside after
 * signing out or reopening the page. Only scents chosen after the restart come back.
 * This is a guest's record; a member's lives on the account (see CollectionRepo).
 */
const restartListeners = new Set<() => void>();

/** Follows this device's restart record, from this tab and others. */
export function subscribeRestarted(listener: () => void): () => void {
  restartListeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === RESTART_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    restartListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function markRestarted(now = Date.now()) {
  try {
    window.localStorage.setItem(RESTART_KEY, JSON.stringify({ day: dayKey(now), at: now }));
    restartListeners.forEach((l) => l());
  } catch {
    // Blocked storage: the restart holds for this visit only.
  }
}

/** When today's ritual was last restarted on this device, if it was. */
export function restartedAt(now = Date.now()): number | undefined {
  try {
    const saved = JSON.parse(window.localStorage.getItem(RESTART_KEY) ?? "null") as {
      day?: string;
      at?: number;
    } | null;
    return saved?.day === dayKey(now) && typeof saved.at === "number" ? saved.at : undefined;
  } catch {
    return undefined;
  }
}
