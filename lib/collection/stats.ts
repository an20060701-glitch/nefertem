import type { UsageLog } from "@/types";

/** Most-worn scent since the start of this month (architecture §7: 本月使用最多). */
export function mostUsedThisMonth(
  logs: readonly UsageLog[],
  now = Date.now(),
): { id: string; count: number } | undefined {
  const start = new Date(now);
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const counts = new Map<string, number>();
  for (const log of logs) {
    if (log.timestamp >= start.getTime() && log.timestamp <= now) {
      counts.set(log.fragranceId, (counts.get(log.fragranceId) ?? 0) + 1);
    }
  }
  let best: { id: string; count: number } | undefined;
  for (const [id, count] of counts) if (!best || count > best.count) best = { id, count };
  return best;
}

/** The latest wear, if any. */
export function lastUsed(logs: readonly UsageLog[]): UsageLog | undefined {
  return logs.reduce<UsageLog | undefined>(
    (latest, l) => (!latest || l.timestamp > latest.timestamp ? l : latest),
    undefined,
  );
}

/**
 * The cabinet's order (An, 2026-10-07): most worn first; scents worn equally often,
 * and those not worn yet, keep the order they were added in, newest first.
 */
export function byMostWorn<T extends { usageCount: number; addedAt: number }>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => b.usageCount - a.usageCount || b.addedAt - a.addedAt);
}
