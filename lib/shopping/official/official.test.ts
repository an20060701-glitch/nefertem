import { describe, expect, it } from "vitest";
import { isOnDomain } from "./google-cse";
import { brandHomeLink } from "./mock";

describe("official links", () => {
  it("links listed brands to their home page and others to a search", () => {
    expect(brandHomeLink({ brandKey: "chanel" })).toEqual({
      url: "https://www.chanel.com/",
      label: "Chanel 官方網站",
      kind: "home",
    });
    expect(brandHomeLink({ brandKey: "creed" })?.kind).toBe("search");
    expect(brandHomeLink({ brandKey: "nope" })).toBeNull();
  });

  it("only accepts https results on the brand's own domain", () => {
    expect(isOnDomain("https://www.chanel.com/tw/fragrance/", "chanel.com")).toBe(true);
    expect(isOnDomain("https://chanel.com/", "chanel.com")).toBe(true);
    expect(isOnDomain("https://chanel.com.evil.example/", "chanel.com")).toBe(false);
    expect(isOnDomain("https://notchanel.com/", "chanel.com")).toBe(false);
    expect(isOnDomain("http://www.chanel.com/", "chanel.com")).toBe(false);
  });
});
