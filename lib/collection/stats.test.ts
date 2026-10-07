import { describe, expect, it } from "vitest";
import type { UsageLog } from "@/types";
import { byMostWorn, lastUsed, mostUsedThisMonth } from "./stats";

const NOW = new Date(2026, 9, 20, 12).getTime();
const log = (fragranceId: string, date: Date): UsageLog => ({
  id: `${fragranceId}-${date.getTime()}`,
  fragranceId,
  timestamp: date.getTime(),
  weather: "clear",
  temperature: 24,
  city: "TAIPEI",
  occasion: "indoor",
  mood: ["calm"],
  viaWheel: false,
});

describe("collection stats", () => {
  const logs = [
    log("a", new Date(2026, 8, 28)), // last month
    log("a", new Date(2026, 8, 29)),
    log("a", new Date(2026, 8, 30)),
    log("b", new Date(2026, 9, 2)),
    log("b", new Date(2026, 9, 9)),
    log("c", new Date(2026, 9, 18)),
  ];

  it("counts only this month for 本月使用最多", () => {
    expect(mostUsedThisMonth(logs, NOW)).toEqual({ id: "b", count: 2 });
    expect(mostUsedThisMonth([], NOW)).toBeUndefined();
  });

  it("finds the latest wear", () => {
    expect(lastUsed(logs)?.fragranceId).toBe("c");
    expect(lastUsed([])).toBeUndefined();
  });
});

describe("byMostWorn", () => {
  it("puts the most worn first, then newest added among equals", () => {
    const items = [
      { id: "old-unworn", usageCount: 0, addedAt: 1 },
      { id: "new-unworn", usageCount: 0, addedAt: 3 },
      { id: "worn-twice", usageCount: 2, addedAt: 2 },
      { id: "worn-once", usageCount: 1, addedAt: 4 },
    ];
    expect(byMostWorn(items).map((f) => f.id)).toEqual([
      "worn-twice",
      "worn-once",
      "new-unworn",
      "old-unworn",
    ]);
  });
});
