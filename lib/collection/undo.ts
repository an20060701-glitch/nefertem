import type { UsageLog } from "@/types";

/** Per scent: how many wears to take back, and its latest remaining wear (if any). */
export function usageAfterUndo(
  logs: readonly UsageLog[],
  usage: readonly UsageLog[],
): Map<string, { count: number; lastUsedAt?: number }> {
  const gone = new Set(logs.map((l) => l.id));
  const out = new Map<string, { count: number; lastUsedAt?: number }>();
  for (const l of logs) {
    const e = out.get(l.fragranceId) ?? { count: 0 };
    e.count += 1;
    out.set(l.fragranceId, e);
  }
  for (const u of usage) {
    const e = out.get(u.fragranceId);
    if (!e || gone.has(u.id)) continue;
    if (e.lastUsedAt === undefined || u.timestamp > e.lastUsedAt) e.lastUsedAt = u.timestamp;
  }
  return out;
}
