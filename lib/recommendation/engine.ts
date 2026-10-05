import { noteInfo } from "@/data/notes";
import type { Fragrance, FragranceFamily, Mood, Occasion, WeatherSnapshot } from "@/types";
import {
  COLD_LEAN,
  FAVOURITE_FIT_THRESHOLD,
  FAVOURITE_MIN_USES,
  type FamilyWeights,
  HOT_LEAN,
  type Lean,
  MOOD_FAMILIES,
  NOTE_LAYER_WEIGHT,
  OCCASION_LEAN,
  RAIN_LEAN,
  recentlyUsedPenalty,
  type ScoreKey,
  SUB_FAMILY_FACTOR,
  USAGE_WINDOW_DAYS,
  WEIGHTS,
} from "./rules";
import { tagToMood } from "@/lib/scent-tags";

export interface UsageEntry {
  fragranceId: string;
  timestamp: number;
}

export interface RecommendationInput {
  weather: WeatherSnapshot;
  occasion: Occasion;
  moods: Mood[];
  candidates: readonly Fragrance[];
  usage?: readonly UsageEntry[];
  now?: number;
}

export interface Recommendation {
  fragrance: Fragrance;
  totalScore: number;
  scores: Record<ScoreKey, number>;
  penalty: number;
  /** Wears in the last 90 days. */
  usageCount: number;
  /** Whole days since last worn, if ever. */
  daysSinceUsed?: number;
  /** Promoted as the user's most-worn scent that also fits today. */
  favourite: boolean;
}

const DAY = 86_400_000;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const round = (n: number) => Math.round(n * 1000) / 1000;

/** Affinity of a fragrance for a weighted family set, 0–1. Main family counts fully, sub-families less. */
export function familyAffinity(fragrance: Fragrance, weights: FamilyWeights): number {
  let best = weights[fragrance.family] ?? 0;
  for (const sub of fragrance.subFamilies ?? [])
    best = Math.max(best, (weights[sub] ?? 0) * SUB_FAMILY_FACTOR);
  return best;
}

function toWeights(families: FragranceFamily[]): FamilyWeights {
  return Object.fromEntries(families.map((f) => [f, 1]));
}

/** 0.5 is neutral; leaning families pull toward 1 or 0. */
function leanScore(fragrance: Fragrance, lean: Lean): number {
  return clamp01(
    0.5 +
      0.5 *
        (familyAffinity(fragrance, toWeights(lean.plus)) - familyAffinity(fragrance, toWeights(lean.minus))),
  );
}

/** Combined mood→family weights for one or two moods (averaged). */
export function moodWeights(moods: Mood[]): FamilyWeights {
  const merged: FamilyWeights = {};
  if (moods.length === 0) return merged;
  for (const mood of moods) {
    for (const [family, w] of Object.entries(MOOD_FAMILIES[mood]) as [FragranceFamily, number][]) {
      merged[family] = (merged[family] ?? 0) + w / moods.length;
    }
  }
  return merged;
}

export function moodScore(fragrance: Fragrance, moods: Mood[]): number {
  if (moods.length === 0) return 0.5;
  const each = moods.map((m) => familyAffinity(fragrance, MOOD_FAMILIES[m]));
  return each.reduce((a, b) => a + b, 0) / each.length;
}

export function weatherScore(fragrance: Fragrance, weather: WeatherSnapshot): number {
  return weather.isRainy ? leanScore(fragrance, RAIN_LEAN) : 0.5;
}

export function temperatureScore(fragrance: Fragrance, weather: WeatherSnapshot): number {
  if (weather.isHot) return leanScore(fragrance, HOT_LEAN);
  if (weather.isCold) return leanScore(fragrance, COLD_LEAN);
  return 0.5;
}

export function occasionScore(fragrance: Fragrance, occasion: Occasion): number {
  return leanScore(fragrance, OCCASION_LEAN[occasion]);
}

/** Note-level match: how many of the notes belong to today's mood families (heart ×1.2). */
export function noteFamilyScore(fragrance: Fragrance, moods: Mood[]): number {
  const weights = moodWeights(moods);
  let total = 0;
  let matched = 0;
  const layers: [readonly string[], number][] = [
    [fragrance.topNotes, NOTE_LAYER_WEIGHT.top],
    [fragrance.heartNotes, NOTE_LAYER_WEIGHT.heart],
    [fragrance.baseNotes, NOTE_LAYER_WEIGHT.base],
  ];
  for (const [notes, layerWeight] of layers) {
    for (const note of notes) {
      const family = noteInfo(note)?.family;
      total += layerWeight;
      if (family) matched += layerWeight * Math.min(1, weights[family] ?? 0);
    }
  }
  return total === 0 ? 0 : matched / total;
}

export function preferenceScore(fragrance: Fragrance, moods: Mood[]): number {
  if (moods.length === 0) return 0;
  const tagged = new Set(fragrance.tags.map(tagToMood).filter(Boolean));
  return moods.filter((m) => tagged.has(m)).length / moods.length;
}

function startOfDay(t: number): number {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

interface UsageStats {
  count: number;
  lastUsedAt?: number;
}

function usageStats(usage: readonly UsageEntry[], now: number): Map<string, UsageStats> {
  const since = now - USAGE_WINDOW_DAYS * DAY;
  const stats = new Map<string, UsageStats>();
  for (const { fragranceId, timestamp } of usage) {
    if (timestamp > now) continue;
    const s = stats.get(fragranceId) ?? { count: 0 };
    if (timestamp >= since) s.count += 1;
    if (!s.lastUsedAt || timestamp > s.lastUsedAt) s.lastUsedAt = timestamp;
    stats.set(fragranceId, s);
  }
  return stats;
}

/**
 * Rank candidates for today. The first item is TODAY'S SCENT.
 * Deterministic for the same input — randomness belongs to the wheel only.
 */
export function recommend(input: RecommendationInput): Recommendation[] {
  const { weather, occasion, moods, candidates, usage = [], now = Date.now() } = input;
  const stats = usageStats(usage, now);
  const maxCount = Math.max(0, ...candidates.map((f) => stats.get(f.id)?.count ?? 0));
  const today = startOfDay(now);

  const ranked = candidates.map((fragrance): Recommendation => {
    const s = stats.get(fragrance.id);
    const usageCount = s?.count ?? 0;
    const daysSinceUsed =
      s?.lastUsedAt === undefined ? undefined : Math.round((today - startOfDay(s.lastUsedAt)) / DAY);
    const scores: Record<ScoreKey, number> = {
      mood: moodScore(fragrance, moods),
      weather: weatherScore(fragrance, weather),
      temperature: temperatureScore(fragrance, weather),
      occasion: occasionScore(fragrance, occasion),
      family: noteFamilyScore(fragrance, moods),
      preference: preferenceScore(fragrance, moods),
      usageFrequency: maxCount === 0 ? 0 : Math.log(1 + usageCount) / Math.log(1 + maxCount),
    };
    const penalty = recentlyUsedPenalty(daysSinceUsed);
    const weighted = (Object.keys(WEIGHTS) as ScoreKey[]).reduce((sum, k) => sum + WEIGHTS[k] * scores[k], 0);
    return {
      fragrance,
      totalScore: round(weighted - penalty),
      scores: Object.fromEntries(Object.entries(scores).map(([k, v]) => [k, round(v)])) as Record<
        ScoreKey,
        number
      >,
      penalty,
      usageCount,
      daysSinceUsed,
      favourite: false,
    };
  });

  ranked.sort(
    (a, b) =>
      b.totalScore - a.totalScore ||
      b.scores.mood - a.scores.mood ||
      a.fragrance.id.localeCompare(b.fragrance.id),
  );

  return promoteFavourite(ranked);
}

/**
 * An's rule: the most-worn scent of the last 90 days goes first when it fits
 * today — second if it was worn yesterday, so the ritual doesn't repeat daily.
 */
function promoteFavourite(ranked: Recommendation[]): Recommendation[] {
  const favourite = ranked.reduce<Recommendation | undefined>(
    (best, r) => (r.usageCount > (best?.usageCount ?? 0) ? r : best),
    undefined,
  );
  if (!favourite || favourite.usageCount < FAVOURITE_MIN_USES) return ranked;
  if (favourite.scores.mood + favourite.scores.temperature < FAVOURITE_FIT_THRESHOLD) return ranked;

  const rest = ranked.filter((r) => r !== favourite);
  const promoted = { ...favourite, favourite: true };
  const slot = favourite.daysSinceUsed !== undefined && favourite.daysSinceUsed <= 1 ? 1 : 0;
  rest.splice(Math.min(slot, rest.length), 0, promoted);
  return rest;
}
