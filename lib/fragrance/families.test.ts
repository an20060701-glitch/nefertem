import { describe, expect, it } from "vitest";
import { FAMILIES, MOODS } from "./families";

describe("fragrance families", () => {
  it("keys match their record keys", () => {
    for (const [key, family] of Object.entries(FAMILIES)) {
      expect(family.key).toBe(key);
    }
  });

  it("every family has a distinct swatch", () => {
    const colors = Object.values(FAMILIES).map((f) => f.color.toLowerCase());
    expect(new Set(colors).size).toBe(colors.length);
  });

  it("offers the seven impressions from the brief", () => {
    expect(MOODS.map((m) => m.zh)).toEqual(["神秘", "清新", "溫暖", "平靜", "成熟", "誘人", "侵略性"]);
  });
});
