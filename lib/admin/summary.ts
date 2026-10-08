export interface Member {
  name: string;
  email: string | null;
  provider: "google" | "line" | "other";
  createdAt: number | null;
  lastSeenAt: number | null;
  /** Perfumes in the member's cabinet. */
  perfumes: number;
  /** Wears logged through Today's Choice, all time and in the last 7 days. */
  wears: number;
  wears7d: number;
}

export interface SiteStats {
  generatedAt: number;
  totals: {
    members: number;
    new7d: number;
    new30d: number;
    active7d: number;
    active30d: number;
    withPerfumes: number;
    perfumes: number;
    wears: number;
    wears7d: number;
    google: number;
    line: number;
  };
  /** Sign-ups per day for the last 30 days, oldest first (Taiwan time). */
  signups: { day: string; count: number }[];
  /** Newest member first. */
  members: Member[];
}

const DAY = 86_400_000;
const TAIPEI = 8 * 3_600_000;
const dayOf = (ms: number) => new Date(ms + TAIPEI).toISOString().slice(0, 10);

export function summarize(members: Member[], now: number): SiteStats {
  const within = (ms: number | null, days: number) => ms !== null && ms >= now - days * DAY;
  const sum = (pick: (m: Member) => number) => members.reduce((n, m) => n + pick(m), 0);

  const signups = Array.from({ length: 30 }, (_, i) => ({ day: dayOf(now - (29 - i) * DAY), count: 0 }));
  const index = new Map(signups.map((s, i) => [s.day, i]));
  for (const m of members) {
    const i = m.createdAt === null ? undefined : index.get(dayOf(m.createdAt));
    if (i !== undefined) signups[i].count += 1;
  }

  return {
    generatedAt: now,
    totals: {
      members: members.length,
      new7d: members.filter((m) => within(m.createdAt, 7)).length,
      new30d: members.filter((m) => within(m.createdAt, 30)).length,
      active7d: members.filter((m) => within(m.lastSeenAt, 7)).length,
      active30d: members.filter((m) => within(m.lastSeenAt, 30)).length,
      withPerfumes: members.filter((m) => m.perfumes > 0).length,
      perfumes: sum((m) => m.perfumes),
      wears: sum((m) => m.wears),
      wears7d: sum((m) => m.wears7d),
      google: members.filter((m) => m.provider === "google").length,
      line: members.filter((m) => m.provider === "line").length,
    },
    signups,
    members: [...members].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)),
  };
}
