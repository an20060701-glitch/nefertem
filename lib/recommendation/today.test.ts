import { describe, expect, it } from "vitest";
import type { UsageLog } from "@/types";
import { dayKey, todaysPicks } from "./today";

const at = (id: string, time: Date): UsageLog => ({
  id,
  fragranceId: id,
  timestamp: time.getTime(),
  weather: "clear",
  temperature: 24,
  city: "TAIPEI",
  occasion: "indoor",
  mood: ["calm"],
  viaWheel: false,
});

describe("todaysPicks", () => {
  it("keeps only today's wears, oldest first", () => {
    const now = new Date(2026, 9, 7, 15).getTime();
    const usage = [
      at("layered", new Date(2026, 9, 7, 9, 30)),
      at("yesterday", new Date(2026, 9, 6, 23, 59)),
      at("first", new Date(2026, 9, 7, 8)),
    ];
    expect(todaysPicks(usage, now).map((u) => u.id)).toEqual(["first", "layered"]);
    expect(dayKey(now)).toBe("2026-10-07");
  });
});
