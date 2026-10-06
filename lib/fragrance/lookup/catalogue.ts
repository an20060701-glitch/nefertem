import { CATALOGUE, CATALOGUE_SOURCE } from "@/data/catalogue";
import { DEMO_FRAGRANCES } from "@/data/fragrances";
import { HEAVEN_LAFA, HEAVEN_LAFA_SOURCE } from "@/data/heaven-lafa";
import { brandForName } from "@/lib/shopping/normalize";
import type { Fragrance } from "@/types";
import { DEMO_SOURCE } from "./mock";
import { fold } from "./normalize";
import type { FragranceDataProvider, FragranceLookupResult, FragranceQuery } from "./types";

type Confidence = FragranceLookupResult["confidence"];

const CONCENTRATION_WORDS: Record<NonNullable<Fragrance["concentration"]>, string[]> = {
  EDP: ["eau de parfum", "edp"],
  EDT: ["eau de toilette", "edt"],
  EDC: ["cologne", "eau de cologne", "edc"],
  Parfum: ["parfum"],
  Extrait: ["extrait", "extrait de parfum"],
};

/** When a name fits several bottles (Sauvage EDT / EDP / Parfum), the eau de parfum comes first. */
const CONCENTRATION_ORDER = ["EDP", "EDT", "Parfum", "Extrait", "EDC"];

/** Brand and its known spellings ("香奈兒", "Chanel") reduced to the brand list's key when we know it. */
function brandKey(name: string): string {
  return brandForName(name)?.key ?? fold(name);
}

function score(
  f: Fragrance,
  brand: string,
  name: string,
): { confidence: Confidence; exactBottle: boolean } | null {
  const fb = brandKey(f.brand);
  const brandMatch =
    brand.length > 0 && (fb === brand || fold(f.brand).includes(brand) || brand.includes(fold(f.brand)));
  const names = [f.name, f.nameZh].filter((n): n is string => !!n).map(fold);
  // "Sauvage Eau de Parfum" names one bottle among Sauvage's several.
  const bottles = f.concentration
    ? CONCENTRATION_WORDS[f.concentration].map((w) => fold(`${f.name} ${w}`))
    : [];
  const exactBottle = bottles.includes(name);
  const nameExact = exactBottle || names.includes(name);
  const namePartial = name.length >= 3 && names.some((n) => n.includes(name) || name.includes(n));

  if (brandMatch && nameExact) return { confidence: "high", exactBottle };
  if (brandMatch && namePartial) return { confidence: "medium", exactBottle };
  if (nameExact) return { confidence: "low", exactBottle }; // the right scent under a brand spelled differently
  return null;
}

const RANK: Record<Confidence, number> = { high: 3, medium: 2, low: 1 };

function toResult(f: Fragrance, confidence: Confidence, source: string): FragranceLookupResult {
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
  return { fragrance: data, confidence, sources: [source] };
}

/**
 * Smart lookup over An's brand product list (data/catalogue.ts, 146 perfumes from
 * Chanel, Dior, Jo Malone London, Diptyque, Byredo and Le Labo), then the demo
 * catalogue. Brand names match in any spelling the brand list knows (香奈兒 = Chanel).
 */
export const catalogueFragranceProvider: FragranceDataProvider = {
  name: "catalogue",
  async lookup({ brand, name }: FragranceQuery) {
    const b = brand.trim() ? brandKey(brand) : "";
    const n = fold(name);
    if (!n) return null;
    let best: { f: Fragrance; rank: number; exact: boolean; order: number; source: string } | null = null;
    const lists: [readonly Fragrance[], string][] = [
      [CATALOGUE, CATALOGUE_SOURCE],
      [HEAVEN_LAFA, HEAVEN_LAFA_SOURCE],
      [DEMO_FRAGRANCES, DEMO_SOURCE],
    ];
    for (const [list, source] of lists) {
      for (const f of list) {
        const s = score(f, b, n);
        if (!s) continue;
        const rank = RANK[s.confidence];
        const order = CONCENTRATION_ORDER.indexOf(f.concentration ?? "");
        const better =
          !best ||
          rank > best.rank ||
          (rank === best.rank && s.exactBottle && !best.exact) ||
          (rank === best.rank &&
            s.exactBottle === best.exact &&
            source === best.source &&
            order >= 0 &&
            (best.order < 0 || order < best.order));
        if (better) best = { f, rank, exact: s.exactBottle, order, source };
      }
    }
    if (!best) return null;
    const confidence = (Object.keys(RANK) as Confidence[]).find((c) => RANK[c] === best.rank)!;
    return toResult(best.f, confidence, best.source);
  },
};
