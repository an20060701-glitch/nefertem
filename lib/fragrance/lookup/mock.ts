import { DEMO_FRAGRANCES } from "@/data/fragrances";
import type { Fragrance } from "@/types";
import { fold } from "./normalize";
import type { FragranceDataProvider, FragranceLookupResult, FragranceQuery } from "./types";

/** Said plainly so nobody mistakes the demo catalogue for a brand's official data. */
export const DEMO_SOURCE = "Nefertem 示範目錄（整理自公開描述，未經品牌官方驗證）";

type Confidence = FragranceLookupResult["confidence"];

function score(f: Fragrance, brand: string, name: string): Confidence | null {
  const fb = fold(f.brand);
  const names = [f.name, f.nameZh].filter((n): n is string => !!n).map(fold);
  const brandMatch = brand.length > 0 && (fb === brand || fb.includes(brand) || brand.includes(fb));
  const nameExact = names.includes(name);
  const namePartial = name.length >= 3 && names.some((n) => n.includes(name) || name.includes(n));

  if (brandMatch && nameExact) return "high";
  if (brandMatch && namePartial) return "medium";
  if (nameExact) return "low"; // the right scent under a brand spelled differently
  return null;
}

const RANK: Record<Confidence, number> = { high: 3, medium: 2, low: 1 };

function toResult(f: Fragrance, confidence: Confidence): FragranceLookupResult {
  // Copy only the scent's data; ids, timestamps and the demo origin stay behind.
  const data: FragranceLookupResult["fragrance"] = {
    brand: f.brand,
    name: f.name,
    nameZh: f.nameZh,
    concentration: f.concentration,
    family: f.family,
    subFamilies: f.subFamilies,
    topNotes: f.topNotes,
    heartNotes: f.heartNotes,
    baseNotes: f.baseNotes,
    tags: f.tags,
    description: f.description,
  };
  return { fragrance: data, confidence, sources: [DEMO_SOURCE] };
}

/**
 * v1 provider (architecture §7.1): matches the demo catalogue in data/fragrances.ts.
 * Returns null when nothing matches, so the UI can offer manual entry instead.
 */
export const mockFragranceProvider: FragranceDataProvider = {
  name: "mock",
  async lookup({ brand, name }: FragranceQuery) {
    const b = fold(brand);
    const n = fold(name);
    if (!n) return null;
    let best: { f: Fragrance; c: Confidence } | null = null;
    for (const f of DEMO_FRAGRANCES) {
      const c = score(f, b, n);
      if (c && (!best || RANK[c] > RANK[best.c])) best = { f, c };
    }
    return best ? toResult(best.f, best.c) : null;
  },
};
