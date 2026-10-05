import { describe, expect, it } from "vitest";
import { cleanKeyword, MAX_KEYWORD_LENGTH, storeSearchUrl, webSearchUrl } from "./links";

describe("store links", () => {
  it("encodes Chinese, spaces and reserved characters", () => {
    expect(storeSearchUrl("shopee", "Creed 阿文圖斯")).toBe(
      "https://shopee.tw/search?keyword=Creed%20%E9%98%BF%E6%96%87%E5%9C%96%E6%96%AF",
    );
    expect(storeSearchUrl("momo", "Jo Malone & Co?x=1#y")).toBe(
      "https://m.momoshop.com.tw/search.momo?searchKeyword=Jo%20Malone%20%26%20Co%3Fx%3D1%23y",
    );
  });

  it("cannot be steered to another host", () => {
    for (const evil of ["https://evil.example", "//evil.example", "a/../../b", "javascript:alert(1)"]) {
      expect(new URL(storeSearchUrl("shopee", evil)).host).toBe("shopee.tw");
      expect(new URL(storeSearchUrl("momo", evil)).host).toBe("m.momoshop.com.tw");
      expect(new URL(webSearchUrl(evil)).host).toBe("www.google.com");
    }
  });

  it("cleans control characters, whitespace and length", () => {
    expect(cleanKeyword("  Dior\n\tSauvage\u0000 ")).toBe("Dior Sauvage");
    expect(cleanKeyword("a".repeat(200))).toHaveLength(MAX_KEYWORD_LENGTH);
  });
});
