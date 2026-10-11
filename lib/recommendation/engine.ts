import type { Feeling, Fragrance, Scene, WeatherSnapshot } from "@/types";
import {
  AVOID_FACTOR,
  FAVOURITE_FIT_THRESHOLD,
  FAVOURITE_MIN_USES,
  NOTE_LAYER_WEIGHT,
  NOTE_MATCH_FULL,
  recentlyUsedPenalty,
  type ScoreKey,
  SUB_FAMILY_FACTOR,
  USAGE_WINDOW_DAYS,
  WEIGHTS,
} from "./rules";
import {
  type FamilyWeights,
  feelingInfo,
  type Leaning,
  sceneInfo,
  WEATHER_BUCKETS,
  weatherBucket,
} from "./scenes";
import { tagToMood } from "@/lib/scent-tags";

export interface UsageEntry {
  fragranceId: string;
  timestamp: number;
}

export interface RecommendationInput {
  weather: WeatherSnapshot;
  scene: Scene;
  feeling: Feeling;
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

/** Fit for a place or the weather, 0–1: its families, less any it avoids. */
export function leaningScore(fragrance: Fragrance, leaning: Leaning): number {
  const avoid = familyAffinity(fragrance, Object.fromEntries(leaning.avoid.map((f) => [f, 1])));
  if (Object.keys(leaning.families).length === 0) return 0.5 * (1 - avoid);
  return clamp01(familyAffinity(fragrance, leaning.families) - AVOID_FACTOR * avoid);
}

export function feelingScore(fragrance: Fragrance, feeling: Feeling): number {
  return familyAffinity(fragrance, feelingInfo(feeling).families);
}

export function sceneScore(fragrance: Fragrance, scene: Scene): number {
  return leaningScore(fragrance, sceneInfo(scene));
}

export function weatherScore(fragrance: Fragrance, weather: WeatherSnapshot): number {
  return leaningScore(fragrance, WEATHER_BUCKETS[weatherBucket(weather)]);
}

function guideNoteSet(scene: Scene, weather: WeatherSnapshot): Set<string> {
  return new Set([...sceneInfo(scene).notes, ...WEATHER_BUCKETS[weatherBucket(weather)].notes]);
}

/** The scent's notes that the guide names for this place or weather, heart first. */
export function guideNotes(fragrance: Fragrance, scene: Scene, weather: WeatherSnapshot): string[] {
  const wanted = guideNoteSet(scene, weather);
  return [...new Set([...fragrance.heartNotes, ...fragrance.topNotes, ...fragrance.baseNotes])].filter((n) =>
    wanted.has(n),
  );
}

/** Note-level match against the guide's 適合的氣味; two hits (heart ×1.2) count fully. */
export function noteScore(fragrance: Fragrance, scene: Scene, weather: WeatherSnapshot): number {
  const wanted = guideNoteSet(scene, weather);
  const layers: [readonly string[], number][] = [
    [fragrance.topNotes, NOTE_LAYER_WEIGHT.top],
    [fragrance.heartNotes, NOTE_LAYER_WEIGHT.heart],
    [fragrance.baseNotes, NOTE_LAYER_WEIGHT.base],
  ];
  let hits = 0;
  for (const [notes, layerWeight] of layers) for (const n of notes) if (wanted.has(n)) hits += layerWeight;
  return Math.min(1, hits / NOTE_MATCH_FULL);
}

/** The member's own tags (神秘、清新…) agreeing with today's feeling. */
export function preferenceScore(fragrance: Fragrance, feeling: Feeling): number {
  const moods = feelingInfo(feeling).moods;
  return fragrance.tags.some((t) => {
    const m = tagToMood(t);
    return !!m && moods.includes(m);
  })
    ? 1
    : 0;
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
  const { weather, scene, feeling, candidates, usage = [], now = Date.now() } = input;
  const stats = usageStats(usage, now);
  const maxCount = Math.max(0, ...candidates.map((f) => stats.get(f.id)?.count ?? 0));
  const today = startOfDay(now);

  const ranked = candidates.map((fragrance): Recommendation => {
    const s = stats.get(fragrance.id);
    const usageCount = s?.count ?? 0;
    const daysSinceUsed =
      s?.lastUsedAt === undefined ? undefined : Math.round((today - startOfDay(s.lastUsedAt)) / DAY);
    const scores: Record<ScoreKey, number> = {
      feeling: feelingScore(fragrance, feeling),
      scene: sceneScore(fragrance, scene),
      weather: weatherScore(fragrance, weather),
      notes: noteScore(fragrance, scene, weather),
      preference: preferenceScore(fragrance, feeling),
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
      b.scores.feeling - a.scores.feeling ||
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
  if (favourite.scores.feeling + favourite.scores.weather < FAVOURITE_FIT_THRESHOLD) return ranked;

  const rest = ranked.filter((r) => r !== favourite);
  const promoted = { ...favourite, favourite: true };
  const slot = favourite.daysSinceUsed !== undefined && favourite.daysSinceUsed <= 1 ? 1 : 0;
  rest.splice(Math.min(slot, rest.length), 0, promoted);
  return rest;
}
