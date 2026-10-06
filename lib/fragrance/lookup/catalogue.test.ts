import { describe, expect, it } from "vitest";
import { BRANDS } from "@/data/brands";
import { CATALOGUE, CATALOGUE_SOURCE } from "@/data/catalogue";
import { HEAVEN_LAFA, HEAVEN_LAFA_SOURCE } from "@/data/heaven-lafa";
import { noteInfo } from "@/data/notes";
import { brandHomeLink } from "@/lib/shopping/official/mock";
import { catalogueFragranceProvider } from "./catalogue";
import { DEMO_SOURCE } from "./mock";

const lookup = catalogueFragranceProvider.lookup;

describe("brand product catalogue", () => {
  it("holds perfumes only, each with a known brand, unique id and dictionary notes", () => {
    expect(CATALOGUE.length).toBeGreaterThan(100);
    const ids = new Set<string>();
    for (const f of CATALOGUE) {
      expect(ids.has(f.id), f.id).toBe(false);
      ids.add(f.id);
      expect(
        BRANDS.some((b) => b.name === f.brand),
        f.brand,
      ).toBe(true);
      expect(/body|hand|incense|pomade|discovery|solid/i.test(f.name), f.name).toBe(false);
      for (const n of [...f.topNotes, ...f.heartNotes, ...f.baseNotes])
        expect(noteInfo(n), `${f.name}: ${n}`).toBeDefined();
    }
  });

  it("reads the family from the accord's head noun", () => {
    const bleu = CATALOGUE.find((f) => f.name === "Bleu de Chanel" && f.concentration === "EDP")!;
    expect(bleu.description).toBe("木質芳香調");
    expect(bleu.family).toBe("fougere");
    const n5 = CATALOGUE.find((f) => f.name === "N°5" && f.concentration === "EDP")!;
    expect(n5.family).toBe("floral");
  });
});

describe("catalogue lookup", () => {
  it("finds a product by its brand in Chinese and says the data is An's list", async () => {
    const r = await lookup({ brand: "香奈兒", name: "Bleu de Chanel" });
    expect(r?.confidence).toBe("high");
    expect(r?.fragrance.brand).toBe("Chanel");
    expect(r?.sources).toEqual([CATALOGUE_SOURCE]);
  });

  it("picks the named bottle, and the eau de parfum when none is named", async () => {
    expect((await lookup({ brand: "Dior", name: "Sauvage Eau de Toilette" }))?.fragrance.concentration).toBe(
      "EDT",
    );
    expect((await lookup({ brand: "Dior", name: "Sauvage" }))?.fragrance.concentration).toBe("EDP");
  });

  it("still falls back to the demo catalogue", async () => {
    const r = await lookup({ brand: "Creed", name: "Aventus" });
    expect(r?.sources).toEqual([DEMO_SOURCE]);
  });

  it("links a brand without a Taiwan site to its fragrance page", () => {
    expect(brandHomeLink({ brandKey: "le-labo" })?.url).toBe(
      "https://www.lelabofragrances.com/eau-de-parfum.html",
    );
    expect(brandHomeLink({ brandKey: "byredo" })?.url).toBe("https://www.byredo.com/tw/zh-tw/");
    expect(brandHomeLink({ brandKey: "chanel" })?.url).toBe("https://www.chanel.com/tw/");
  });
});

describe("HEAVEN LAFA", () => {
  it("is found by its Chinese brand and product names, notes from the dictionary", async () => {
    const r = await lookup({ brand: "天堂費洛香", name: "神獸阿努比－俐落好感香" });
    expect(r?.confidence).toBe("high");
    expect(r?.fragrance.name).toBe("神獸阿努比");
    expect(r?.sources).toEqual([HEAVEN_LAFA_SOURCE]);
    expect((await lookup({ brand: "LAFA", name: "生命馥之鑰" }))?.fragrance.baseNotes).toContain("myrrh");
    for (const f of HEAVEN_LAFA)
      for (const n of [...f.topNotes, ...f.heartNotes, ...f.baseNotes])
        expect(noteInfo(n), `${f.name}: ${n}`).toBeDefined();
  });

  it("links to the brand's Taiwan site", () => {
    expect(brandHomeLink({ brandKey: "heaven-lafa" })?.url).toBe("https://www.heavenlafa.tw/");
  });
});
