import { describe, expect, it } from "vitest";
import { NOTES } from "@/data/notes";
import { DEMO_FRAGRANCES } from "@/data/fragrances";
import { deriveMoods, deriveTags, NOTE_TAGS, tagToMood } from "./scent-tags";

describe("scent tags", () => {
  it("covers every note in the dictionary", () => {
    for (const key of Object.keys(NOTES)) expect(NOTE_TAGS[key], key).toBeDefined();
  });

  it("weights heart notes above top notes", () => {
    const tags = deriveTags({ topNotes: ["bergamot"], heartNotes: ["oud"], baseNotes: [] });
    expect(tags[0].weight).toBe(1.2);
    expect(tags.find((t) => t.tag === "清新")!.weight).toBe(0.8);
  });

  it("maps Chinese mood words and keys to moods", () => {
    expect(tagToMood("神秘")).toBe("mysterious");
    expect(tagToMood("calm")).toBe("calm");
    expect(tagToMood("優雅")).toBeUndefined();
  });

  it("derives moods for an oud scent", () => {
    const oudWood = DEMO_FRAGRANCES.find((f) => f.id === "demo-tom-ford-oud-wood")!;
    expect(deriveMoods(oudWood)).toEqual(["warm", "mature"]);
  });
});

describe("demo catalogue", () => {
  it("only uses notes from the dictionary, and is marked demo", () => {
    for (const f of DEMO_FRAGRANCES) {
      expect(f.origin).toBe("demo");
      for (const n of [...f.topNotes, ...f.heartNotes, ...f.baseNotes])
        expect(NOTES, `${f.id}: ${n}`).toHaveProperty(n);
    }
  });

  it("has unique ids and 12–20 entries", () => {
    expect(new Set(DEMO_FRAGRANCES.map((f) => f.id)).size).toBe(DEMO_FRAGRANCES.length);
    expect(DEMO_FRAGRANCES.length).toBeGreaterThanOrEqual(12);
    expect(DEMO_FRAGRANCES.length).toBeLessThanOrEqual(20);
  });
});
