import type { FragranceFamily, Mood, Occasion } from "@/types";

/**
 * Tunable rules for the recommendation engine (architecture §6.3).
 * "Oriental" is folded into `amber` throughout the data.
 */
export type FamilyWeights = Partial<Record<FragranceFamily, number>>;

export const MOOD_FAMILIES: Record<Mood, FamilyWeights> = {
  mysterious: { amber: 1, woody: 0.5, leather: 0.5, musky: 0.5 },
  fresh: { citrus: 1, fresh: 1, marine: 0.5, fougere: 0.5 },
  warm: { woody: 1, gourmand: 1, amber: 0.5, spicy: 0.5 },
  calm: { woody: 1, fougere: 1, chypre: 1, musky: 0.5 },
  mature: { fougere: 1, chypre: 1, woody: 0.5, leather: 0.5 },
  seductive: { floral: 1, amber: 1, gourmand: 0.5, musky: 0.5 },
  bold: { marine: 1, mineral: 1, avantgarde: 1, leather: 0.5, spicy: 0.5 },
};

/** Families nudged up (+) or down (−) by a condition. */
export interface Lean {
  plus: FragranceFamily[];
  minus: FragranceFamily[];
}

export const RAIN_LEAN: Lean = { plus: ["woody", "amber", "musky", "chypre"], minus: ["marine", "citrus"] };
export const HOT_LEAN: Lean = {
  plus: ["citrus", "fresh", "marine"],
  minus: ["gourmand", "amber", "leather"],
};
export const COLD_LEAN: Lean = {
  plus: ["gourmand", "amber", "leather"],
  minus: ["citrus", "fresh", "marine"],
};

export const OCCASION_LEAN: Record<Occasion, Lean> = {
  indoor: { plus: ["musky", "floral", "woody"], minus: ["avantgarde", "leather"] },
  outdoor: { plus: ["citrus", "fresh", "marine"], minus: [] },
};

/** How much a secondary family counts compared with the main one. */
export const SUB_FAMILY_FACTOR = 0.6;

export const WEIGHTS = {
  mood: 0.35,
  weather: 0.1,
  temperature: 0.15,
  occasion: 0.1,
  family: 0.1,
  preference: 0.05,
  usageFrequency: 0.15,
} as const;

export type ScoreKey = keyof typeof WEIGHTS;

/** Penalty by whole days since the scent was last worn (0 = earlier today). */
export function recentlyUsedPenalty(daysAgo: number | undefined): number {
  if (daysAgo === undefined) return 0;
  if (daysAgo <= 1) return 0.25;
  if (daysAgo === 2) return 0.15;
  if (daysAgo === 3) return 0.08;
  return 0;
}

export const USAGE_WINDOW_DAYS = 90;
/** Note layers: the heart carries the character of a scent. */
export const NOTE_LAYER_WEIGHT = { top: 1, heart: 1.2, base: 1 } as const;
/** moodScore + temperatureScore a favourite must reach to be promoted. */
export const FAVOURITE_FIT_THRESHOLD = 1;
/** A favourite needs at least this many wears in the window. */
export const FAVOURITE_MIN_USES = 2;
