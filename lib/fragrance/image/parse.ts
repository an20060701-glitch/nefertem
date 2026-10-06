/** Pure helpers for reading a brand's sitemap and product page; no network here. */

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x2F;|&#47;/gi, "/");
}

export interface Sitemap {
  /** True for a sitemap index, whose <loc>s are further sitemaps. */
  isIndex: boolean;
  locs: string[];
}

export function parseSitemap(xml: string): Sitemap {
  const locs = [...xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?\s*([^<\]]+?)\s*(?:\]\]>)?\s*<\/loc>/gi)].map((m) =>
    decodeEntities(m[1]),
  );
  return { isIndex: /<sitemapindex[\s>]/i.test(xml), locs };
}

/** Words that describe the bottle rather than name the scent. */
const GENERIC = new Set([
  "eau",
  "de",
  "du",
  "parfum",
  "perfume",
  "toilette",
  "cologne",
  "edp",
  "edt",
  "edc",
  "extrait",
  "intense",
  "spray",
  "ml",
  "the",
  "a",
  "of",
  "and",
  "et",
]);

/** Things that share a scent's name but are not the perfume itself. */
const NOT_THE_BOTTLE = new Set([
  "set",
  "gift",
  "coffret",
  "discovery",
  "sample",
  "samples",
  "candle",
  "bougie",
  "body",
  "lotion",
  "cream",
  "soap",
  "hand",
  "shower",
  "gel",
  "wash",
  "refill",
  "deodorant",
  "oil",
  "travel",
  "mini",
  "miniature",
  "diffuser",
  "hair",
  "mist",
  "balm",
  "kit",
]);

export function words(text: string): string[] {
  return text
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

/** The words a product URL must contain to be this scent, e.g. "Santal 33" → santal, 33. */
export function nameWords(name: string): string[] {
  const all = words(name);
  const named = all.filter((w) => !GENERIC.has(w));
  return named.length ? named : all;
}

/**
 * The product page whose path names this scent, or undefined. Every name word must
 * appear in the path; pages for sets, candles and body care lose to the bottle itself,
 * and of the rest the path with the fewest extra words wins.
 */
export function bestProductUrl(urls: readonly string[], name: string): string | undefined {
  const wanted = nameWords(name);
  if (!wanted.length) return undefined;
  const joined = wanted.join("");
  let best: { url: string; score: number } | undefined;
  for (const url of urls) {
    let path: string;
    try {
      path = decodeURIComponent(new URL(url).pathname);
    } catch {
      continue;
    }
    const segments = path.split("/").filter(Boolean);
    const slug = words(segments[segments.length - 1] ?? "");
    const all = words(path);
    const hasAll = wanted.every((w) => all.includes(w)) || slug.join("").includes(joined);
    if (!hasAll) continue;
    const extras = slug.filter((w) => !wanted.includes(w) && !GENERIC.has(w) && !/^\d+$/.test(w));
    const offTopic = all.some((w) => NOT_THE_BOTTLE.has(w) && !wanted.includes(w));
    const score = extras.length + (offTopic ? 100 : 0) + (wanted.every((w) => slug.includes(w)) ? 0 : 10);
    if (!best || score < best.score) best = { url, score };
  }
  return best && best.score < 100 ? best.url : undefined;
}

function metaContent(html: string, key: string): string | undefined {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attr = (n: string) => tag.match(new RegExp(`\\b${n}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2];
    if ((attr("property") ?? attr("name"))?.toLowerCase() === key) {
      const content = attr("content");
      if (content) return decodeEntities(content.trim());
    }
  }
  return undefined;
}

function imageOf(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return imageOf(value[0]);
  if (value && typeof value === "object") {
    const v = value as Record<string, unknown>;
    return imageOf(v.url ?? v.contentUrl);
  }
  return undefined;
}

function productImage(node: unknown): string | undefined {
  if (Array.isArray(node)) {
    for (const n of node) {
      const found = productImage(n);
      if (found) return found;
    }
    return undefined;
  }
  if (!node || typeof node !== "object") return undefined;
  const n = node as Record<string, unknown>;
  const type = ([] as unknown[]).concat(n["@type"]);
  if (type.includes("Product")) {
    const image = imageOf(n.image);
    if (image) return image;
  }
  return productImage(n["@graph"]);
}

/**
 * The picture a brand's product page declares for itself: its schema.org Product
 * image first, then the Open Graph / Twitter share image. Returned as an absolute
 * https URL, or undefined.
 */
export function pageImage(html: string, pageUrl: string): string | undefined {
  const candidates: (string | undefined)[] = [];
  for (const m of html.matchAll(
    /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    try {
      candidates.push(productImage(JSON.parse(m[1].trim())));
    } catch {
      // Malformed structured data: fall through to the meta tags.
    }
  }
  candidates.push(
    metaContent(html, "og:image:secure_url"),
    metaContent(html, "og:image"),
    metaContent(html, "twitter:image"),
  );
  for (const c of candidates) {
    if (!c) continue;
    try {
      const url = new URL(c.startsWith("//") ? `https:${c}` : c, pageUrl);
      if (url.protocol === "http:") url.protocol = "https:";
      if (url.protocol === "https:" && !/logo|placeholder/i.test(url.pathname)) return url.toString();
    } catch {
      // Not a URL; try the next one.
    }
  }
  return undefined;
}
