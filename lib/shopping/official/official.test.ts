import { describe, expect, it } from "vitest";
import { BRANDS } from "@/data/brands";
import { isOnDomain } from "./google-cse";
import { brandHomeLink } from "./mock";

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
});
