/**
 * Tunable rules for the recommendation engine (architecture §6.3). What each
 * place, feeling and weather leans toward lives in ./scenes (An's scene guide).
 */
/** How much a secondary family counts compared with the main one. */
export const SUB_FAMILY_FACTOR = 0.6;

export const WEIGHTS = {
  feeling: 0.3,
  scene: 0.2,
  weather: 0.2,
  notes: 0.1,
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
/** Weighted hits on the guide's notes that count as a full note match. */
export const NOTE_MATCH_FULL = 2;
/** How hard an avoided family pulls a scent down. */
export const AVOID_FACTOR = 0.5;
/** feeling + weather scores a favourite must reach to be promoted. */
export const FAVOURITE_FIT_THRESHOLD = 1;
/** A favourite needs at least this many wears in the window. */
export const FAVOURITE_MIN_USES = 2;
