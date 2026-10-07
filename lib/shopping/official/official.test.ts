import { describe, expect, it } from "vitest";
import { BRANDS } from "@/data/brands";
import { isOnDomain } from "./google-cse";
import { CATALOGUE } from "@/data/catalogue";
import { OFFICIAL_PAGES, OFFICIAL_PICTURES } from "@/data/official-pages";
import { BRAND_LISTS } from "@/data/brand-lists";
import { CALVIN_KLEIN } from "@/data/calvin-klein";
import { TAMBURINS } from "@/data/tamburins";
import { brandHomeLink, productPageLink } from "./mock";

describe("official links", () => {
  it("links listed brands to their site, else their domain, and others to a search", () => {
    expect(brandHomeLink({ brandKey: "chanel" })).toEqual({
      url: "https://www.chanel.com/tw/",
      label: "Chanel 官方網站",
      kind: "home",
    });
    expect(brandHomeLink({ brandKey: "parfums-de-marly" })?.url).toBe("https://www.parfums-de-marly.com/");
    expect(brandHomeLink({ brandKey: "hetras" })?.kind).toBe("search");
    expect(brandHomeLink({ brandKey: "nope" })).toBeNull();
  });

  it("only lists https sites on the brand's own domain", () => {
    for (const b of BRANDS) {
      if (!b.site) continue;
      expect(b.site.startsWith("https://"), b.key).toBe(true);
      if (b.domain && !["ysl", "jo-malone"].includes(b.key))
        expect(isOnDomain(b.site, b.domain), b.key).toBe(true);
    }
  });

  it("only accepts https results on the brand's own domain", () => {
    expect(isOnDomain("https://www.chanel.com/tw/fragrance/", "chanel.com")).toBe(true);
    expect(isOnDomain("https://chanel.com/", "chanel.com")).toBe(true);
    expect(isOnDomain("https://chanel.com.evil.example/", "chanel.com")).toBe(false);
    expect(isOnDomain("https://notchanel.com/", "chanel.com")).toBe(false);
    expect(isOnDomain("http://www.chanel.com/", "chanel.com")).toBe(false);
  });

  it("opens the perfume's own page on its brand's site when we know it", () => {
    expect(productPageLink({ brandKey: "dior", name: "Sauvage", id: "cat-dior-sauvage-edt" })).toEqual({
      url: "https://www.dior.com/en_us/beauty/products/sauvage-eau-de-toilette-Y0685240.html",
      label: "Dior 官網商品頁",
      kind: "page",
    });
    // A bottle from the member's own collection: found by brand, name and concentration.
    expect(productPageLink({ brandKey: "dior", name: "sauvage", id: "x1", concentration: "EDP" })?.url).toBe(
      OFFICIAL_PAGES["cat-dior-sauvage-edp"],
    );
    expect(productPageLink({ brandKey: "chanel", name: "N°5", concentration: "EDP" })?.url).toBe(
      OFFICIAL_PAGES["cat-chanel-n-5-edp"],
    );
    expect(productPageLink({ brandKey: "dior", name: "Unknown" })).toBeNull();
  });

  it("lists only known perfumes, each on an https page", () => {
    const ids = new Set([...CATALOGUE, ...TAMBURINS, ...CALVIN_KLEIN, ...BRAND_LISTS].map((f) => f.id));
    for (const [id, url] of Object.entries(OFFICIAL_PAGES)) {
      expect(ids.has(id), id).toBe(true);
      expect(url.startsWith("https://"), id).toBe(true);
    }
    for (const [id, url] of Object.entries(OFFICIAL_PICTURES)) {
      expect(OFFICIAL_PAGES[id], id).toBeDefined();
      expect(url.startsWith("https://"), id).toBe(true);
    }
  });
});
