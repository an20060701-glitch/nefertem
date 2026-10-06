import { describe, expect, it } from "vitest";
import { DEMO_FRAGRANCES } from "@/data/fragrances";
import { matchSearch } from "./normalize";

const m = (q: string) => matchSearch(q, DEMO_FRAGRANCES);

describe("matchSearch", () => {
  it("maps Chinese trade names to the standard name", () => {
    expect(m("阿文圖斯")?.keyword).toBe("Creed Aventus");
    expect(m("香奈兒 蔚藍")?.keyword).toBe("Chanel Bleu de Chanel");
    expect(m("祖瑪瓏英國梨")?.fragrance?.id).toBe("demo-jo-malone-english-pear-freesia");
  });

  it("ignores case, accents and punctuation", () => {
    expect(m("terre d'hermes")?.fragrance?.id).toBe("demo-hermes-terre-d-hermes");
    expect(m("CHANEL no5")?.fragrance?.id).toBe("demo-chanel-no5");
    expect(m("acqua di gio")?.fragrance?.id).toBe("demo-armani-acqua-di-gio");
  });

  it("needs the brand for short names and rejects a different brand", () => {
    expect(m("Dior N°5")?.fragrance).toBeUndefined();
    expect(m("Dior N°5")?.brand?.key).toBe("dior");
    expect(m("N°5")?.fragrance?.id).toBe("demo-chanel-no5");
  });

  it("recognises a brand alone and keeps the typed words", () => {
    const r = m("Chanel Chance");
    expect(r?.fragrance).toBeUndefined();
    expect(r?.brand?.key).toBe("chanel");
    expect(r?.keyword).toBe("Chanel Chance");
    expect(m("YSL")?.brand?.key).toBe("ysl");
  });

  it("knows the brands from An's list by English or Chinese name", () => {
    expect(matchSearch("朵昂思", DEMO_FRAGRANCES)?.brand?.key).toBe("durance");
    expect(matchSearch("Initio Side Effect", DEMO_FRAGRANCES)?.brand?.key).toBe("initio-parfums-prives");
    expect(matchSearch("范思哲", DEMO_FRAGRANCES)?.brand?.key).toBe("versace");
    // "ck" (Calvin Klein) inside another word is not a brand.
    expect(matchSearch("Rock Musk", DEMO_FRAGRANCES)?.brand).toBeUndefined();
  });

  it("recognises fragrance families", () => {
    expect(m("木質調")?.family?.key).toBe("woody");
    expect(m("清新")?.keyword).toBe("柑橘調香水");
    expect(m("西普調")?.family?.key).toBe("fougere-chypre");
  });

  it("falls back to the typed text", () => {
    expect(m("  某個小眾香  ")).toEqual({ keyword: "某個小眾香", brand: undefined });
    expect(m("   ")).toBeNull();
  });
});
