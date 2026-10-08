import { describe, expect, it } from "vitest";
import { summarize, type Member } from "./summary";

const DAY = 86_400_000;
const now = Date.parse("2026-10-08T12:00:00Z");
const member = (over: Partial<Member>): Member => ({
  name: "m",
  email: null,
  provider: "google",
  createdAt: now - 100 * DAY,
  lastSeenAt: now - 100 * DAY,
  perfumes: 0,
  wears: 0,
  wears7d: 0,
  ...over,
});

describe("summarize", () => {
  it("counts a member who stays signed in as active, not only fresh sign-ins", () => {
    // Old account, last seen yesterday: the owner wants to know they are still using the site.
    const stats = summarize([member({ lastSeenAt: now - DAY }), member({})], now);
    expect(stats.totals.active7d).toBe(1);
    expect(stats.totals.new7d).toBe(0);
  });

  it("separates members who have built a cabinet from those who only signed up", () => {
    const stats = summarize([member({ perfumes: 3, wears: 5, wears7d: 2 }), member({ provider: "line" })], now);
    expect(stats.totals).toMatchObject({ members: 2, withPerfumes: 1, perfumes: 3, wears: 5, wears7d: 2, line: 1 });
  });

  it("buckets sign-ups by Taiwan date over the last 30 days", () => {
    // 2026-10-07 20:00 UTC is already 10-08 in Taipei.
    const stats = summarize([member({ createdAt: Date.parse("2026-10-07T20:00:00Z") })], now);
    expect(stats.signups).toHaveLength(30);
    expect(stats.signups.at(-1)).toEqual({ day: "2026-10-08", count: 1 });
    expect(stats.members[0].createdAt).not.toBeNull();
  });
});
