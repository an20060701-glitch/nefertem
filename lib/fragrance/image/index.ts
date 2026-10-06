import "server-only";

import type { BrandInfo } from "@/data/brands";
import { brandForName } from "@/lib/shopping/normalize";
import { bestProductUrl, pageImage, parseSitemap } from "./parse";
import { parseRobots, type RobotsRules } from "./robots";
import type { OfficialImage } from "./types";

/**
 * Official product pictures (An, 2026-10-06): smart lookup shows the bottle from the
 * brand's own site instead of asking the member for a photo.
 *
 * Runs only on the server, once per lookup, and politely: robots.txt is read first and
 * obeyed, only the brand's own hosts are fetched, at most a few sitemaps and one product
 * page per scent, every request has a timeout and a size cap, and results are kept for a
 * day. The picture is the one the page itself declares for sharing (schema.org Product
 * image or og:image); it is linked, not copied, and always shown with its source page.
 */
const AGENT = "NefertemBot";
const USER_AGENT = `${AGENT}/1.0 (+https://github.com/an20060701-glitch/nefertem)`;
const DAY_MS = 86_400_000;
const TIMEOUT_MS = 5000;
const MAX_SITEMAPS = 4;
const SITEMAP_BYTES = 8_000_000;
const PAGE_BYTES = 2_000_000;

const cache = new Map<string, { at: number; value: unknown }>();

async function remember<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < DAY_MS) return hit.value as T;
  const value = await load();
  if (cache.size >= 500) cache.delete(cache.keys().next().value as string);
  cache.set(key, { at: Date.now(), value });
  return value;
}

/** The hosts that belong to the brand: its domain, its subdomains and its linked site's host. */
function brandHosts(brand: BrandInfo): string[] {
  const hosts = new Set<string>();
  if (brand.domain) hosts.add(brand.domain);
  if (brand.site) {
    try {
      hosts.add(new URL(brand.site).hostname.replace(/^www\./, ""));
    } catch {
      // A malformed site link only loses that host.
    }
  }
  return [...hosts];
}

function onBrand(url: string, hosts: readonly string[]): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && hosts.some((h) => u.hostname === h || u.hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
}

function origins(brand: BrandInfo): string[] {
  const list = new Set<string>();
  if (brand.site) {
    try {
      list.add(new URL(brand.site).origin);
    } catch {
      // Ignore a malformed site link.
    }
  }
  if (brand.domain) list.add(`https://www.${brand.domain}`);
  return [...list];
}

/** GET with our user agent, a timeout and a size cap; gzip sitemaps are unpacked. */
async function getText(url: string, maxBytes: number, hosts: readonly string[]): Promise<string | undefined> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/xml,text/xml,text/plain;q=0.9,*/*;q=0.5",
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  // A server error says nothing about permission: callers treat it as "stay away".
  if (res.status >= 500) {
    await res.body?.cancel();
    throw new Error(`${url} ${res.status}`);
  }
  // A redirect off the brand's own site ends the trail.
  if (!res.ok || !res.body || !onBrand(res.url || url, hosts)) {
    await res.body?.cancel();
    return undefined;
  }
  const declared = Number(res.headers.get("content-length"));
  if (declared > maxBytes) {
    await res.body.cancel();
    return undefined;
  }
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel();
      return undefined;
    }
    chunks.push(value);
  }
  let bytes = new Uint8Array(size);
  let offset = 0;
  for (const c of chunks) {
    bytes.set(c, offset);
    offset += c.byteLength;
  }
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) {
    const unpacked = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
    bytes = new Uint8Array(await new Response(unpacked).arrayBuffer());
    if (bytes.byteLength > maxBytes * 8) return undefined;
  }
  return new TextDecoder().decode(bytes);
}

function robotsFor(origin: string, hosts: readonly string[]): Promise<RobotsRules | null> {
  return remember(`robots:${origin}`, async () => {
    try {
      const text = await getText(`${origin}/robots.txt`, 500_000, hosts);
      return parseRobots(text ?? "", AGENT);
    } catch {
      // Unreachable robots.txt (timeout, 5xx): stay away from the site this time.
      return null;
    }
  });
}

async function allowed(url: string, hosts: readonly string[]): Promise<boolean> {
  if (!onBrand(url, hosts)) return false;
  const u = new URL(url);
  const robots = await robotsFor(u.origin, hosts);
  return !!robots?.allows(u.pathname + u.search);
}

/** Product page URLs listed in the brand's sitemaps at `origin`, fetched at most once a day. */
function productUrls(origin: string, hosts: readonly string[]): Promise<string[]> {
  return remember(`sitemap:${origin}`, async () => {
    const robots = await robotsFor(origin, hosts);
    if (!robots) return [];
    const queue = robots.sitemaps.filter((s) => onBrand(s, hosts));
    if (!queue.length) queue.push(`${origin}/sitemap.xml`);
    // Product sitemaps first; they are where the bottles are.
    const byProduct = (a: string, b: string) => Number(/product/i.test(b)) - Number(/product/i.test(a));
    queue.sort(byProduct);

    const pages: string[] = [];
    let fetched = 0;
    while (queue.length && fetched < MAX_SITEMAPS) {
      const next = queue.shift()!;
      if (!(await allowed(next, hosts))) continue;
      fetched += 1;
      const xml = await getText(next, SITEMAP_BYTES, hosts).catch(() => undefined);
      if (!xml) continue;
      const map = parseSitemap(xml);
      if (map.isIndex) {
        queue.push(...map.locs.filter((l) => onBrand(l, hosts)));
        queue.sort(byProduct);
      } else {
        pages.push(...map.locs.filter((l) => onBrand(l, hosts)));
      }
    }
    return pages;
  });
}

async function findOnBrandSite(brand: BrandInfo, name: string): Promise<OfficialImage | null> {
  const hosts = brandHosts(brand);
  for (const origin of origins(brand)) {
    const pageUrl = bestProductUrl(await productUrls(origin, hosts), name);
    if (!pageUrl || !(await allowed(pageUrl, hosts))) continue;
    const html = await getText(pageUrl, PAGE_BYTES, hosts).catch(() => undefined);
    const imageUrl = html ? pageImage(html, pageUrl) : undefined;
    if (imageUrl) return { imageUrl, pageUrl, brand: brand.name };
  }
  return null;
}

/** The official picture for a scent, or null. Never throws. */
export async function findOfficialImage(query: {
  brand: string;
  name: string;
}): Promise<OfficialImage | null> {
  const brand = brandForName(query.brand);
  if (!brand || !origins(brand).length) return null;
  try {
    return await remember(`image:${brand.key}:${query.name.toLowerCase()}`, () =>
      findOnBrandSite(brand, query.name),
    );
  } catch (error) {
    console.error(`[official-image] ${brand.key} failed`, error);
    return null;
  }
}

export type { OfficialImage } from "./types";
