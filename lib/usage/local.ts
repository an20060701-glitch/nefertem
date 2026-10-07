import type { UsageLog } from "@/types";

/**
 * Guest usage log kept on this device until sign-in arrives (Phase 3 moves it
 * to users/{uid}/usageLogs in Firestore). Only what the engine needs is stored:
 * no location beyond the city name, no personal data.
 */
const KEY = "xiangshui:usage:v1";
const LIMIT = 365;
const listeners = new Set<() => void>();
const EMPTY: UsageLog[] = [];
let cache: UsageLog[] | undefined;

function read(): UsageLog[] {
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed) ? parsed.filter(isUsageLog) : [];
  } catch {
    cache = [];
  }
  return cache;
}

function isUsageLog(value: unknown): value is UsageLog {
  const v = value as UsageLog;
  return typeof v?.fragranceId === "string" && typeof v.timestamp === "number";
}

export function getLocalUsage(): UsageLog[] {
  return typeof window === "undefined" ? EMPTY : read();
}

export function getServerUsage(): UsageLog[] {
  return EMPTY;
}

export function subscribeLocalUsage(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = undefined;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Take wears back (重新開始). */
export function removeLocalUsage(ids: ReadonlySet<string>) {
  cache = read().filter((u) => !ids.has(u.id));
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // Private mode or full storage: the change holds for this visit only.
  }
  listeners.forEach((l) => l());
}

/** Record that a scent was chosen today. Returns the saved log. */
export function logLocalUsage(entry: Omit<UsageLog, "id" | "timestamp">): UsageLog {
  const log: UsageLog = { ...entry, id: crypto.randomUUID(), timestamp: Date.now() };
  cache = [...read(), log].slice(-LIMIT);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // Private mode or full storage: keep the choice for this visit only.
  }
  listeners.forEach((l) => l());
  return log;
}
