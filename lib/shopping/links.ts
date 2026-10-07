/** Store search links (architecture §8.1). Every keyword is cleaned and encoded before it reaches a URL. */

export const MAX_KEYWORD_LENGTH = 80;

/** Trim, drop control characters, collapse whitespace and cap the length. */
export function cleanKeyword(input: string): string {
  return input
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_KEYWORD_LENGTH)
    .trim();
}

export type StoreKey = "shopee" | "momo" | "perfume1976";

export const STORES: Record<StoreKey, { name: string; zh: string; host: string }> = {
  shopee: { name: "SHOPEE", zh: "蝦皮購物", host: "shopee.tw" },
  momo: { name: "MOMO", zh: "momo 購物網", host: "momoshop.com.tw" },
  // Taiwan's first online perfume shop (An, 2026-10-06).
  perfume1976: { name: "1976", zh: "香水1976", host: "1976.com.tw" },
};

export function storeSearchUrl(store: StoreKey, keyword: string): string {
  const q = encodeURIComponent(cleanKeyword(keyword));
  switch (store) {
    case "shopee":
      return `https://shopee.tw/search?keyword=${q}`;
    case "momo":
      return `https://m.momoshop.com.tw/search.momo?searchKeyword=${q}`;
    case "perfume1976":
      return `https://www.1976.com.tw/search?keyword=${q}`;
  }
}

/** A plain web search, used when we do not know a brand's own website. */
export function webSearchUrl(keyword: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(cleanKeyword(keyword))}`;
}
