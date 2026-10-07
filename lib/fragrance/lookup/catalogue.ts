import { CATALOGUE, CATALOGUE_SOURCE } from "@/data/catalogue";
import { DEMO_FRAGRANCES } from "@/data/fragrances";
import { HEAVEN_LAFA, HEAVEN_LAFA_SOURCE } from "@/data/heaven-lafa";
import { TAMBURINS, TAMBURINS_SOURCE } from "@/data/tamburins";
import { BRAND_LISTS, BRAND_LISTS_SOURCE } from "@/data/brand-lists";
import { CALVIN_KLEIN, CALVIN_KLEIN_SOURCE } from "@/data/calvin-klein";
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

/** The lists searched, in order, each with the source line shown to the member. */
const LISTS: readonly (readonly [readonly Fragrance[], string])[] = [
  [CATALOGUE, CATALOGUE_SOURCE],
  [HEAVEN_LAFA, HEAVEN_LAFA_SOURCE],
  [TAMBURINS, TAMBURINS_SOURCE],
  [CALVIN_KLEIN, CALVIN_KLEIN_SOURCE],
  [BRAND_LISTS, BRAND_LISTS_SOURCE],
  [DEMO_FRAGRANCES, DEMO_SOURCE],
];

/**
 * The bottle a brand + name most likely means, with how sure we are and which list it
 * came from. Brand names match in any spelling the brand list knows (香奈兒 = Chanel).
 */
export function findCatalogueBottle({
  brand,
  name,
}: FragranceQuery): { fragrance: Fragrance; confidence: Confidence; source: string } | null {
  const b = brand.trim() ? brandKey(brand) : "";
  const n = fold(name);
  if (!n) return null;
  let best: { f: Fragrance; rank: number; exact: boolean; order: number; source: string } | null = null;
  for (const [list, source] of LISTS) {
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
  return { fragrance: best.f, confidence, source: best.source };
}

/**
 * Smart lookup over An's brand product lists (data/catalogue.ts and the per-brand
 * files), then the demo catalogue.
 */
export const catalogueFragranceProvider: FragranceDataProvider = {
  name: "catalogue",
  async lookup(query: FragranceQuery) {
    const found = findCatalogueBottle(query);
    return found ? toResult(found.fragrance, found.confidence, found.source) : null;
  },
};

const CONCENTRATION_LABEL: Record<NonNullable<Fragrance["concentration"]>, string> = {
  EDP: "Eau de Parfum",
  EDT: "Eau de Toilette",
  EDC: "Eau de Cologne",
  Parfum: "Parfum",
  Extrait: "Extrait de Parfum",
};

export interface NameSuggestion {
  /** What goes in the name field: the name, plus the concentration when the brand has several bottles of it. */
  value: string;
  name: string;
  nameZh?: string;
  concentration?: Fragrance["concentration"];
}

/**
 * The database's perfumes for a brand (in any spelling the brand list knows), for the
 * name field to offer as the member types: everything at first, then the names that
 * contain what was typed, names that start with it first.
 */
export function nameSuggestions(brand: string, typed: string): NameSuggestion[] {
  const b = brand.trim() ? brandKey(brand) : "";
  if (!b) return [];
  const all = [
    ...CATALOGUE,
    ...HEAVEN_LAFA,
    ...TAMBURINS,
    ...CALVIN_KLEIN,
    ...BRAND_LISTS,
    ...DEMO_FRAGRANCES,
  ].filter((f) => {
    const fb = brandKey(f.brand);
    return fb === b || (b.length >= 3 && fold(f.brand).includes(b));
  });
  const bottles = new Map<string, number>();
  for (const f of all) bottles.set(fold(f.name), (bottles.get(fold(f.name)) ?? 0) + 1);

  const seen = new Set<string>();
  const out: { s: NameSuggestion; at: number }[] = [];
  const q = fold(typed);
  for (const f of all) {
    const several = (bottles.get(fold(f.name)) ?? 0) > 1 && f.concentration;
    const value = several ? `${f.name} ${CONCENTRATION_LABEL[f.concentration!]}` : f.name;
    if (seen.has(fold(value))) continue;
    const at = q
      ? Math.min(
          ...[value, f.nameZh]
            .filter((n): n is string => !!n)
            .map((n) => fold(n).indexOf(q))
            .map((i) => (i < 0 ? Infinity : i)),
        )
      : 0;
    if (at === Infinity) continue;
    seen.add(fold(value));
    out.push({ s: { value, name: f.name, nameZh: f.nameZh, concentration: f.concentration }, at });
  }
  return out
    .sort((x, y) =>
      (x.at === 0) === (y.at === 0) ? x.s.value.localeCompare(y.s.value) : x.at === 0 ? -1 : 1,
    )
    .map((x) => x.s);
}
