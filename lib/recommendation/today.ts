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
