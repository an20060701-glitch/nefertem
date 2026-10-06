import { BRANDS, type BrandInfo, FRAGRANCE_ALIASES } from "@/data/brands";
import { FAMILY_GUIDES, type FamilyGuide } from "@/data/family-guide";
import type { Fragrance } from "@/types";
import { cleanKeyword } from "./links";

/** Lower-case, strip accents, punctuation and spaces so "Terre d’Hermès" matches "terre dhermes". */
export function fold(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[\s\p{P}\p{S}]/gu, "");
}

export interface SearchMatch {
  /** What the stores are searched for. */
  keyword: string;
  brand?: BrandInfo;
  fragrance?: Fragrance;
  family?: FamilyGuide;
}

function brandNames(b: BrandInfo): string[] {
  return [b.name, b.zh, ...(b.aliases ?? [])].filter((n): n is string => Boolean(n));
}

/** The longest brand name found inside the folded query. */
function findBrandIn(q: string): { brand: BrandInfo; length: number } | undefined {
  let best: { brand: BrandInfo; length: number } | undefined;
  for (const brand of BRANDS) {
    for (const n of brandNames(brand)) {
      const f = fold(n);
      // Two-letter abbreviations (LV, TF) only count when they are the whole query.
      if (f.length < 3 && f !== q) continue;
      if (f && q.includes(f) && f.length > (best?.length ?? 0)) best = { brand, length: f.length };
    }
  }
  return best;
}

/** "柑橘調／清新調" → 柑橘調, 柑橘, 柑橘調香水, 清新調…, plus the English words. */
function familyNames(g: FamilyGuide): string[] {
  const zh = g.zh.split(/[／與]/).flatMap((part) => {
    const stem = part.replace(/調$/, "");
    return [part, stem, `${part}香水`, `${stem}香水`];
  });
  const en = g.en.replace(/NOTES/g, "").split(/[·&]/);
  return [...zh, ...en, g.zh, g.en].map(fold).filter(Boolean);
}

/** Store keyword for a family: its first Chinese name, e.g. 柑橘調香水. */
export function familySearchKeyword(g: FamilyGuide): string {
  return `${g.zh.split(/[／與]/)[0]}香水`;
}

export function brandForName(name: string): BrandInfo | undefined {
  const f = fold(name);
  return BRANDS.find((b) => brandNames(b).some((n) => fold(n) === f));
}

/**
 * Read a free-text search ("阿文圖斯", "chanel no5", "木質調") against the brand list,
 * the given fragrances and the family guide. Known scents are searched by their
 * standard name; anything else is searched exactly as typed.
 */
export function matchSearch(input: string, catalogue: readonly Fragrance[]): SearchMatch | null {
  const keyword = cleanKeyword(input);
  const q = fold(keyword);
  if (!q) return null;

  const brandHit = findBrandIn(q);

  let best: { fragrance: Fragrance; score: number } | undefined;
  for (const f of catalogue) {
    const names = [f.name, f.nameZh, ...(FRAGRANCE_ALIASES[f.id] ?? [])]
      .map((n) => (n ? fold(n) : ""))
      .filter((n) => n.length >= 2);
    const nameLen = Math.max(0, ...names.filter((n) => q.includes(n)).map((n) => n.length));
    if (!nameLen) continue;
    const fb = brandForName(f.brand);
    const sameBrand = brandHit && fb?.key === brandHit.brand.key;
    // A different brand named in the query rules this scent out.
    if (brandHit && !sameBrand) continue;
    // Short names ("N°5", "大地") need their brand, or must be the whole query.
    if (nameLen < 4 && !sameBrand && nameLen !== q.length) continue;
    const score = nameLen + (sameBrand ? brandHit.length : 0);
    if (score > (best?.score ?? 0)) best = { fragrance: f, score };
  }

  if (best) {
    const f = best.fragrance;
    return { keyword: `${f.brand} ${f.name}`, fragrance: f, brand: brandForName(f.brand) };
  }

  const family = FAMILY_GUIDES.find((g) => familyNames(g).includes(q));
  if (family) return { keyword: familySearchKeyword(family), family };

  return { keyword, brand: brandHit?.brand };
}
