import { describe, expect, it } from "vitest";
import { DEMO_FRAGRANCES } from "@/data/fragrances";
import { noteInfo } from "@/data/notes";
import type { WeatherSnapshot } from "@/types";
import { recommend, type UsageEntry } from "./engine";
import { explain } from "./explain";
import { FEELINGS, SCENES, WEATHER_BUCKETS, weatherBucket } from "./scenes";
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

const sunnyFresh = { scene: "sunny" as const, feeling: "fresh" as const };

describe("scene guide", () => {
  it("only names notes the note dictionary knows, so every guide note can match", () => {
    const leanings = [...SCENES, ...Object.values(WEATHER_BUCKETS)];
    for (const { notes } of leanings) for (const n of notes) expect(noteInfo(n), n).toBeDefined();
  });

  it("asks the guide's six places and five feelings", () => {
    expect(SCENES.map((s) => s.zh)).toEqual([
      "陽光戶外",
      "辦公與工作",
      "約會時刻",
      "藝術與展覽",
      "居家獨處",
      "夜晚聚會",
    ]);
    expect(FEELINGS.map((f) => f.zh)).toEqual([
      "平靜、沉穩",
      "清新、充滿活力",
      "優雅、知性",
      "神秘、個性鮮明",
      "溫柔、浪漫",
    ]);
  });

  it("reads today's weather into the guide's four kinds, rain first", () => {
    expect(weatherBucket(hot)).toBe("hot");
    expect(weatherBucket(weather())).toBe("warm");
    expect(weatherBucket(weather({ temperature: 15, isCold: true }))).toBe("cool");
    expect(weatherBucket(coldRain)).toBe("rainy");
    expect(weatherBucket(weather({ temperature: 30, isHot: true, isRainy: true }))).toBe("rainy");
  });
});

describe("recommend", () => {
  it("ranks every candidate, deterministically", () => {
    const input = { weather: hot, ...sunnyFresh, candidates: DEMO_FRAGRANCES, now: NOW };
    const a = recommend(input);
    expect(a).toHaveLength(DEMO_FRAGRANCES.length);
    expect(ids(recommend(input))).toEqual(ids(a));
    for (let i = 1; i < a.length; i++) expect(a[i - 1].totalScore).toBeGreaterThanOrEqual(a[i].totalScore);
  });

  it("puts a fresh citrus or marine scent first on a hot day outdoors", () => {
    const [top] = recommend({ weather: hot, ...sunnyFresh, candidates: DEMO_FRAGRANCES, now: NOW });
    expect(["citrus", "fresh", "marine", "mineral"]).toContain(top.fragrance.family);
  });

  it("goes deep and dark for a mysterious night out in the cold rain", () => {
    const top3 = recommend({
      weather: coldRain,
      scene: "night",
      feeling: "mysterious",
      candidates: DEMO_FRAGRANCES,
      now: NOW,
    }).slice(0, 3);
    for (const r of top3)
      expect(["amber", "woody", "leather", "spicy", "gourmand"]).toContain(r.fragrance.family);
  });

  it("keeps sweet and leathery scents out of the office (guide §02: low projection)", () => {
    const top3 = recommend({
      weather: weather(),
      scene: "work",
      feeling: "calm",
      candidates: DEMO_FRAGRANCES,
      now: NOW,
    }).slice(0, 3);
    for (const r of top3) expect(["gourmand", "leather"]).not.toContain(r.fragrance.family);
  });

  it("answers a romantic date with florals and musks (guide §07)", () => {
    const [top] = recommend({
      weather: weather(),
      scene: "date",
      feeling: "romantic",
      candidates: DEMO_FRAGRANCES,
      now: NOW,
    });
    expect(["floral", "musky", "chypre", "amber"]).toContain(top.fragrance.family);
  });

  it("lets the place change the answer for the same feeling", () => {
    const at = (scene: "sunny" | "night") =>
      recommend({ weather: weather(), scene, feeling: "calm", candidates: DEMO_FRAGRANCES, now: NOW })[0];
    expect(at("sunny").fragrance.id).not.toBe(at("night").fragrance.id);
  });

  it("penalises a scent worn yesterday", () => {
    const base = { weather: hot, ...sunnyFresh, candidates: DEMO_FRAGRANCES, now: NOW };
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
    const ranked = recommend({ weather: hot, ...sunnyFresh, candidates: DEMO_FRAGRANCES, usage, now: NOW });
    expect(ranked[0].fragrance.id).toBe(favourite);
    expect(ranked[0].favourite).toBe(true);
  });

  it("moves the favourite to second place when it was worn yesterday", () => {
    const favourite = "demo-armani-acqua-di-gio";
    const usage: UsageEntry[] = [1, 8, 12, 20].map((d) => ({
      fragranceId: favourite,
      timestamp: NOW - d * DAY,
    }));
    const ranked = recommend({ weather: hot, ...sunnyFresh, candidates: DEMO_FRAGRANCES, usage, now: NOW });
    expect(ranked[1].fragrance.id).toBe(favourite);
    expect(ranked[0].fragrance.id).not.toBe(favourite);
  });

  it("does not promote a favourite that doesn't fit the day", () => {
    const favourite = "demo-margiela-by-the-fireplace";
    const usage: UsageEntry[] = [5, 8, 12, 20].map((d) => ({
      fragranceId: favourite,
      timestamp: NOW - d * DAY,
    }));
    const ranked = recommend({ weather: hot, ...sunnyFresh, candidates: DEMO_FRAGRANCES, usage, now: NOW });
    expect(ranked[0].fragrance.id).not.toBe(favourite);
    expect(ranked.find((r) => r.fragrance.id === favourite)!.favourite).toBe(false);
  });

  it("ignores usage older than 90 days for frequency", () => {
    const usage: UsageEntry[] = [{ fragranceId: "demo-chanel-no5", timestamp: NOW - 120 * DAY }];
    const ranked = recommend({
      weather: weather(),
      scene: "home",
      feeling: "calm",
      candidates: DEMO_FRAGRANCES,
      usage,
      now: NOW,
    });
    expect(ranked.find((r) => r.fragrance.id === "demo-chanel-no5")!.usageCount).toBe(0);
  });
});

describe("explain", () => {
  it("names the city, the weather, the place and the feeling", () => {
    const ctx = { weather: coldRain, scene: "art" as const, feeling: "mysterious" as const };
    const [top] = recommend({ ...ctx, candidates: DEMO_FRAGRANCES, now: NOW });
    const { lead, details, tip } = explain(top, ctx);
    expect(lead).toContain("台北");
    expect(lead).toContain("陰雨、潮濕");
    expect(lead).toContain("藝術與展覽");
    expect(lead).toContain("「神秘、個性鮮明」");
    expect(lead).toContain(top.fragrance.name);
    expect(details.length).toBeLessThanOrEqual(2);
    expect(tip).toBe("展覽多在室內，記得控制擴散度。");
  });

  it("points at the guide's notes the scent carries", () => {
    const ctx = { weather: weather(), scene: "work" as const, feeling: "calm" as const };
    const santal = DEMO_FRAGRANCES.find((f) => f.id === "demo-le-labo-santal-33")!;
    const [rec] = recommend({ ...ctx, candidates: [santal], now: NOW });
    expect(explain(rec, ctx).details.join("")).toMatch(/正是辦公與工作時合適的香材/);
  });

  it("mentions a favourite", () => {
    const favourite = "demo-armani-acqua-di-gio";
    const usage: UsageEntry[] = [5, 8, 12].map((d) => ({ fragranceId: favourite, timestamp: NOW - d * DAY }));
    const ctx = { weather: hot, ...sunnyFresh };
    const [top] = recommend({ ...ctx, candidates: DEMO_FRAGRANCES, usage, now: NOW });
    expect(explain(top, ctx).details).toContain("這也是你最近最常使用的香氣。");
  });
});

it("does not call a scent worn once a favourite", () => {
  const ctx = { weather: hot, ...sunnyFresh };
  const [first] = recommend({ ...ctx, candidates: DEMO_FRAGRANCES, now: NOW });
  const usage: UsageEntry[] = [{ fragranceId: first.fragrance.id, timestamp: NOW - 5 * DAY }];
  const again = recommend({ ...ctx, candidates: DEMO_FRAGRANCES, usage, now: NOW }).find(
    (r) => r.fragrance.id === first.fragrance.id,
  )!;
  expect(explain(again, ctx).details).not.toContain("這也是你最近最常使用的香氣。");
});

describe("wheel", () => {
  it("offers the top six", () => {
    const ranked = recommend({ weather: hot, ...sunnyFresh, candidates: DEMO_FRAGRANCES, now: NOW });
    expect(ids(wheelCandidates(ranked))).toEqual(ids(ranked.slice(0, 6)));
  });

  it("leans toward the better match but keeps every candidate in play", () => {
    const ranked = recommend({ weather: hot, ...sunnyFresh, candidates: DEMO_FRAGRANCES, now: NOW });
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
