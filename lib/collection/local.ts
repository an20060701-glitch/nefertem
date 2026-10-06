import { getLocalUsage, logLocalUsage, subscribeLocalUsage } from "@/lib/usage/local";
import type { UserFragrance } from "@/types";
import type { CollectionRepo, FragranceDraft } from "./types";

/**
 * Guest collection kept in this browser. Photos are not stored here:
 * they would bloat localStorage, and members get Storage instead.
 */
const KEY = "xiangshui:collection:v1";
const listeners = new Set<(items: UserFragrance[]) => void>();
let cache: UserFragrance[] | undefined;

function read(): UserFragrance[] {
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? "[]");
    cache = Array.isArray(parsed) ? (parsed as UserFragrance[]).filter((f) => typeof f?.id === "string") : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(items: UserFragrance[]) {
  cache = items;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // Private mode or full storage: keep changes for this visit only.
  }
  listeners.forEach((l) => l(items));
}

const byNewest = (items: UserFragrance[]) => [...items].sort((a, b) => b.addedAt - a.addedAt);

export const deviceRepo: CollectionRepo = {
  kind: "device",
  supportsImages: false,

  subscribe(onItems) {
    const emit = (items: UserFragrance[]) => onItems(byNewest(items));
    listeners.add(emit);
    emit(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY) return;
      cache = undefined;
      emit(read());
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(emit);
      window.removeEventListener("storage", onStorage);
    };
  },

  subscribeUsage(onLogs) {
    onLogs(getLocalUsage());
    return subscribeLocalUsage(() => onLogs(getLocalUsage()));
  },

  async add(draft: FragranceDraft, options) {
    const now = Date.now();
    const id = options?.id ?? crypto.randomUUID();
    const existing = read().find((f) => f.id === id);
    if (existing) return existing;
    const item: UserFragrance = {
      ...draft,
      id,
      origin: draft.origin ?? "manual",
      // No uploads on this device; an official picture is only a link, so it stays.
      imageUrl: draft.imageSource ? draft.imageUrl : undefined,
      createdAt: now,
      addedAt: now,
      usageCount: getLocalUsage().filter((u) => u.fragranceId === id).length,
      lastUsedAt: undefined,
    };
    write([...read(), item]);
    return item;
  },

  async update(id, patch) {
    write(read().map((f) => (f.id === id ? { ...f, ...patch, id } : f)));
  },

  async remove(id) {
    // Usage logs stay, matched by fragranceId (architecture §7).
    write(read().filter((f) => f.id !== id));
  },

  async logUsage(entry) {
    const log = logLocalUsage(entry);
    const items = read();
    if (items.some((f) => f.id === entry.fragranceId)) {
      write(
        items.map((f) =>
          f.id === entry.fragranceId ? { ...f, usageCount: f.usageCount + 1, lastUsedAt: log.timestamp } : f,
        ),
      );
    }
    return log;
  },
};
