import type { Recommendation } from "./engine";

export const WHEEL_SIZE = 6;
export const WHEEL_MIN = 2;

/** Candidates for 選擇障礙輪盤: today's top six. */
export function wheelCandidates(ranked: readonly Recommendation[]): Recommendation[] {
  return ranked.slice(0, WHEEL_SIZE);
}

/**
 * How strongly the wheel leans to each candidate (An, 2026-10-06: 選擇障礙 should
 * still follow the visitor's habits and the notes). The total score already weighs
 * usage frequency, note families and today's fit; squaring it favours the best
 * matches while every candidate keeps a chance.
 */
export function wheelWeights(candidates: readonly Recommendation[]): number[] {
  return candidates.map((r) => Math.max(r.totalScore, 0.05) ** 2);
}

/** Random index in proportion to `weights`, drawn with the Web Crypto API. */
export function pickWeightedIndex(
  weights: readonly number[],
  getRandomValues: (a: Uint32Array) => Uint32Array = (a) => crypto.getRandomValues(a),
): number {
  const total = weights.reduce((sum, w) => sum + Math.max(w, 0), 0);
  if (weights.length <= 1 || total <= 0) return 0;
  const STEPS = 1_000_000;
  let r = (pickWheelIndex(STEPS, getRandomValues) / STEPS) * total;
  for (let i = 0; i < weights.length; i++) {
    r -= Math.max(weights[i]!, 0);
    if (r < 0) return i;
  }
  return weights.length - 1;
}

/** Uniform random index in [0, n), from the Web Crypto API (no modulo bias). */
export function pickWheelIndex(
  n: number,
  getRandomValues: (a: Uint32Array) => Uint32Array = (a) => crypto.getRandomValues(a),
): number {
  if (n <= 1) return 0;
  const limit = Math.floor(0x1_0000_0000 / n) * n;
  const buf = new Uint32Array(1);
  do getRandomValues(buf);
  while (buf[0] >= limit);
  return buf[0] % n;
}
