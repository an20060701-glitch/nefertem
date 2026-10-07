import { describe, expect, it } from "vitest";
import type { UsageLog } from "@/types";
import { usageAfterUndo } from "./undo";

const log = (id: string, fragranceId: string, timestamp: number) =>
  ({ id, fragranceId, timestamp }) as UsageLog;

describe("usageAfterUndo", () => {
  it("counts the wears taken back per scent and finds each one's latest remaining wear", () => {
    const usage = [log("a", "x", 1), log("b", "x", 5), log("c", "y", 6), log("d", "x", 9)];
    const after = usageAfterUndo([usage[3], usage[2]], usage);
    expect(after.get("x")).toEqual({ count: 1, lastUsedAt: 5 });
    expect(after.get("y")).toEqual({ count: 1 });
  });
});
