import type { Recommendation } from "./engine";

export const WHEEL_SIZE = 6;
export const WHEEL_MIN = 2;

/** Candidates for 選擇障礙輪盤: today's top six. */
export function wheelCandidates(ranked: readonly Recommendation[]): Recommendation[] {
  return ranked.slice(0, WHEEL_SIZE);
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
