import { findBrand } from "@/data/brands";
import { cleanKeyword } from "../links";
import type { OfficialSearchProvider } from "./types";

interface CseResponse {
  items?: { link?: string; title?: string }[];
}

/** True when `url` is https on the brand's domain or one of its subdomains. */
export function isOnDomain(url: string, domain: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && (u.hostname === domain || u.hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

/**
 * Google Programmable Search: `site:<brand domain> <perfume>`, first result.
 * Runs only on the server (the key never reaches the browser); results are
 * cached for a day, and anything off the brand's own domain is discarded.
 */
export function createGoogleCseProvider(key: string, cx: string): OfficialSearchProvider {
  return {
    name: "google-cse",
    async find({ brandKey, name }) {
      const brand = findBrand(brandKey);
      if (!brand?.domain || !name) return null;
      const q = `site:${brand.domain} ${cleanKeyword(name)}`;
      const url =
        `https://customsearch.googleapis.com/customsearch/v1?num=1` +
        `&key=${encodeURIComponent(key)}&cx=${encodeURIComponent(cx)}&q=${encodeURIComponent(q)}`;
      const res = await fetch(url, { next: { revalidate: 86_400 }, signal: AbortSignal.timeout(4000) });
      if (!res.ok) throw new Error(`CSE ${res.status}`);
      const link = ((await res.json()) as CseResponse).items?.[0]?.link;
      if (!link || !isOnDomain(link, brand.domain)) return null;
      return { url: link, label: `${brand.name} 官網上的 ${cleanKeyword(name)}`, kind: "page" };
    },
  };
}
