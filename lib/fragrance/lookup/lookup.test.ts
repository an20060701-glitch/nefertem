import { describe, expect, it } from "vitest";
import { DEMO_SOURCE, mockFragranceProvider } from "./mock";
import { cleanQueryPart, fold } from "./normalize";

const lookup = mockFragranceProvider.lookup;

describe("fold", () => {
  it("ignores case, accents, spaces and punctuation", () => {
    expect(fold("Baccarat Rouge 540")).toBe(fold("baccarat-rouge540"));
    expect(fold("Hermès")).toBe("hermes");
  });
});

describe("cleanQueryPart", () => {
  it("trims, collapses spaces, strips control characters and caps length", () => {
    expect(cleanQueryPart("  Le \u0000 Labo  ")).toBe("Le Labo");
    expect(cleanQueryPart("x".repeat(200))).toHaveLength(80);
    expect(cleanQueryPart(null)).toBe("");
  });
});

describe("mockFragranceProvider", () => {
  it("finds a catalogue scent with high confidence and says where the data is from", async () => {
    const r = await lookup({ brand: "creed", name: "AVENTUS" });
    expect(r?.confidence).toBe("high");
    expect(r?.fragrance.name).toBe("Aventus");
    expect(r?.fragrance.topNotes?.length).toBeGreaterThan(0);
    expect(r?.sources).toEqual([DEMO_SOURCE]);
  });

  it("never hands back the catalogue's id, timestamps or demo origin", async () => {
    const r = await lookup({ brand: "Creed", name: "Aventus" });
    expect(r?.fragrance).not.toHaveProperty("id");
    expect(r?.fragrance).not.toHaveProperty("createdAt");
    expect(r?.fragrance).not.toHaveProperty("origin");
  });

  it("is less sure about a partial name or a different brand spelling", async () => {
    expect((await lookup({ brand: "Creed", name: "Avent" }))?.confidence).toBe("medium");
    expect((await lookup({ brand: "Kreed", name: "Aventus" }))?.confidence).toBe("low");
  });

  it("returns null when nothing matches", async () => {
    expect(await lookup({ brand: "Unknown House", name: "Nothing Like It" })).toBeNull();
    expect(await lookup({ brand: "Creed", name: "" })).toBeNull();
  });
});
