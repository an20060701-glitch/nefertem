import { describe, expect, it } from "vitest";
import { DEMO_FRAGRANCES } from "@/data/fragrances";
import type { WeatherSnapshot } from "@/types";
import { recommend, type UsageEntry } from "./engine";
import { explain } from "./explain";
import { pickWeightedIndex, pickWheelIndex, wheelCandidates, wheelWeights } from "./wheel";

const NOW = new Date(2026, 9, 5, 9, 0).getTime();
const DAY = 86_400_000;

const weather = (over: Partial<WeatherSnapshot> = {}): WeatherSnapshot => ({
  city: "TAIPEI",
  temperature: 23,
  condition: "cloudy",
  humidity: 70,
  isRainy: false,
  isHot: false,
  isCold: false,
  source: "mock",
  ...over,
});

const hot = weather({ temperature: 32, condition: "clear", isHot: true });
const coldRain = weather({ temperature: 14, condition: "rain", isRainy: true, isCold: true });

const ids = (recs: { fragrance: { id: string } }[]) => recs.map((r) => r.fragrance.id);

describe("recommend", () => {
  it("ranks every candidate, deterministically", () => {
    const input = {
      weather: hot,
      occasion: "outdoor" as const,
      moods: ["fresh" as const],
      candidates: DEMO_FRAGRANCES,
      now: NOW,
    };
    const a = recommend(input);
    expect(a).toHaveLength(DEMO_FRAGRANCES.length);
    expect(ids(recommend(input))).toEqual(ids(a));
    for (let i = 1; i < a.length; i++) expect(a[i - 1].totalScore).toBeGreaterThanOrEqual(a[i].totalScore);
  });

  it("puts a fresh citrus or marine scent first on a hot day outdoors", () => {
    const [top] = recommend({
      weather: hot,
      occasion: "outdoor",
      moods: ["fresh"],
      candidates: DEMO_FRAGRANCES,
      now: NOW,
    });
    expect(["citrus", "fresh", "marine", "mineral"]).toContain(top.fragrance.family);
  });

  it("favours amber, woody or gourmand for a mysterious, warm rainy evening", () => {
    const top3 = recommend({
      weather: coldRain,
      occasion: "indoor",
      moods: ["mysterious", "warm"],
      candidates: DEMO_FRAGRANCES,
      now: NOW,
    }).slice(0, 3);
    for (const r of top3) expect(["amber", "woody", "gourmand"]).toContain(r.fragrance.family);
  });

  it("follows each mood's family rule", () => {
    const cases = [
      ["bold", ["marine", "mineral", "avantgarde"]],
      ["seductive", ["floral", "amber", "chypre", "gourmand"]],
      ["mature", ["fougere", "chypre", "woody"]],
    ] as const;
    for (const [mood, families] of cases) {
      const [top] = recommend({
        weather: weather(),
        occasion: "indoor",
        moods: [mood],
        candidates: DEMO_FRAGRANCES,
        now: NOW,
      });
      expect(families).toContain(top.fragrance.family);
    }
  });

  it("penalises a scent worn yesterday", () => {
    const base = {
      weather: hot,
      occasion: "outdoor" as const,
      moods: ["fresh" as const],
      candidates: DEMO_FRAGRANCES,
      now: NOW,
    };
    const [first] = recommend(base);
    const after = recommend({ ...base, usage: [{ fragranceId: first.fragrance.id, timestamp: NOW - DAY }] });
    const again = after.find((r) => r.fragrance.id === first.fragrance.id)!;
    expect(again.penalty).toBe(0.25);
    expect(again.daysSinceUsed).toBe(1);
  });

  it("promotes the most-worn scent when it fits today", () => {
    const favourite = "demo-armani-acqua-di-gio";
    const usage: UsageEntry[] = [5, 8, 12, 20].map((d) => ({
      fragranceId: favourite,
      timestamp: NOW - d * DAY,
    }));
    const ranked = recommend({
      weather: hot,
      occasion: "outdoor",
      moods: ["fresh"],
      candidates: DEMO_FRAGRANCES,
      usage,
      now: NOW,
    });
    expect(ranked[0].fragrance.id).toBe(favourite);
    expect(ranked[0].favourite).toBe(true);
  });

  it("moves the favourite to second place when it was worn yesterday", () => {
    const favourite = "demo-armani-acqua-di-gio";
    const usage: UsageEntry[] = [1, 8, 12, 20].map((d) => ({
      fragranceId: favourite,
      timestamp: NOW - d * DAY,
    }));
    const ranked = recommend({
      weather: hot,
      occasion: "outdoor",
      moods: ["fresh"],
      candidates: DEMO_FRAGRANCES,
      usage,
      now: NOW,
    });
    expect(ranked[1].fragrance.id).toBe(favourite);
    expect(ranked[0].fragrance.id).not.toBe(favourite);
  });

  it("does not promote a favourite that doesn't fit the day", () => {
    const favourite = "demo-margiela-by-the-fireplace";
    const usage: UsageEntry[] = [5, 8, 12, 20].map((d) => ({
      fragranceId: favourite,
      timestamp: NOW - d * DAY,
    }));
    const ranked = recommend({
      weather: hot,
      occasion: "outdoor",
      moods: ["fresh"],
      candidates: DEMO_FRAGRANCES,
      usage,
      now: NOW,
    });
    expect(ranked[0].fragrance.id).not.toBe(favourite);
    expect(ranked.find((r) => r.fragrance.id === favourite)!.favourite).toBe(false);
  });

  it("ignores usage older than 90 days for frequency", () => {
    const usage: UsageEntry[] = [{ fragranceId: "demo-chanel-no5", timestamp: NOW - 120 * DAY }];
    const ranked = recommend({
      weather: weather(),
      occasion: "indoor",
      moods: ["calm"],
      candidates: DEMO_FRAGRANCES,
      usage,
      now: NOW,
    });
    expect(ranked.find((r) => r.fragrance.id === "demo-chanel-no5")!.usageCount).toBe(0);
  });
});

describe("explain", () => {
  it("names the city, weather and moods", () => {
    const ctx = { weather: coldRain, occasion: "indoor" as const, moods: ["mysterious" as const] };
    const [top] = recommend({ ...ctx, candidates: DEMO_FRAGRANCES, now: NOW });
    const { lead, details } = explain(top, ctx);
    expect(lead).toContain("台北");
    expect(lead).toContain("潮濕的雨天");
    expect(lead).toContain("「神秘」");
    expect(lead).toContain(top.fragrance.name);
    expect(details.length).toBeLessThanOrEqual(2);
  });

  it("mentions a favourite", () => {
    const favourite = "demo-armani-acqua-di-gio";
    const usage: UsageEntry[] = [5, 8, 12].map((d) => ({ fragranceId: favourite, timestamp: NOW - d * DAY }));
    const ctx = { weather: hot, occasion: "outdoor" as const, moods: ["fresh" as const] };
    const [top] = recommend({ ...ctx, candidates: DEMO_FRAGRANCES, usage, now: NOW });
    expect(explain(top, ctx).details).toContain("這也是你最近最常使用的香氣。");
  });
});

it("does not call a scent worn once a favourite", () => {
  const ctx = { weather: hot, occasion: "outdoor" as const, moods: ["fresh" as const] };
  const [first] = recommend({ ...ctx, candidates: DEMO_FRAGRANCES, now: NOW });
  const usage: UsageEntry[] = [{ fragranceId: first.fragrance.id, timestamp: NOW - 5 * DAY }];
  const again = recommend({ ...ctx, candidates: DEMO_FRAGRANCES, usage, now: NOW }).find(
    (r) => r.fragrance.id === first.fragrance.id,
  )!;
  expect(explain(again, ctx).details).not.toContain("這也是你最近最常使用的香氣。");
});

describe("wheel", () => {
  it("offers the top six", () => {
    const ranked = recommend({
      weather: hot,
      occasion: "outdoor",
      moods: ["fresh"],
      candidates: DEMO_FRAGRANCES,
      now: NOW,
    });
    expect(ids(wheelCandidates(ranked))).toEqual(ids(ranked.slice(0, 6)));
  });

  it("leans toward the better match but keeps every candidate in play", () => {
    const ranked = recommend({
      weather: hot,
      occasion: "outdoor",
      moods: ["fresh"],
      candidates: DEMO_FRAGRANCES,
      now: NOW,
    });
    const weights = wheelWeights(wheelCandidates(ranked));
    for (let i = 1; i < weights.length; i++) expect(weights[i - 1]).toBeGreaterThanOrEqual(weights[i]!);
    expect(Math.min(...weights)).toBeGreaterThan(0);
    // A draw at the very start lands on the first; one at the very end on the last.
    expect(pickWeightedIndex(weights, (a) => ((a[0] = 0), a))).toBe(0);
    expect(pickWeightedIndex([1, 3], (a) => ((a[0] = 4_293_999_999), a))).toBe(1);
    expect(pickWeightedIndex([5])).toBe(0);
  });

  it("picks uniformly without modulo bias", () => {
    const seq = [0xffff_ffff, 7];
    const rnd = (a: Uint32Array) => ((a[0] = seq.shift()!), a);
    expect(pickWheelIndex(6, rnd)).toBe(1); // first draw is rejected as biased
    expect(pickWheelIndex(1)).toBe(0);
    for (let i = 0; i < 50; i++) {
      const n = pickWheelIndex(6);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(6);
    }
  });
});
