import { findBrand } from "@/data/brands";
import { CATALOGUE } from "@/data/catalogue";
import { OFFICIAL_PAGES } from "@/data/official-pages";
import { TAMBURINS } from "@/data/tamburins";
import { fold } from "@/lib/fragrance/lookup/normalize";
import { brandForName } from "../normalize";
import { webSearchUrl } from "../links";
import type { OfficialLink, OfficialQuery, OfficialSearchProvider } from "./types";

/** Brand home page from data/brands.ts (its listed site, else its domain); a web search when we list neither. */
export function brandHomeLink({ brandKey }: OfficialQuery): OfficialLink | null {
  const brand = findBrand(brandKey);
  if (!brand) return null;
  // A Taiwan site from An's brand list stays first; otherwise the brand's fragrance page beats its home page.
  const taiwan = !!brand.site && /\.tw\b|\/tw\b|zh-tw/i.test(brand.site);
  if (brand.fragrancePage && !taiwan)
    return { url: brand.fragrancePage, label: `${brand.name} 官方香水頁面`, kind: "home" };
  const home = brand.site ?? (brand.domain && `https://www.${brand.domain}/`);
  if (home) return { url: home, label: `${brand.name} 官方網站`, kind: "home" };
  return {
    url: webSearchUrl(`${brand.name} official site`),
    label: `搜尋 ${brand.name} 官方網站`,
    kind: "search",
  };
}

/**
 * The perfume's own page on the brand's site (data/official-pages.ts): by the matched
 * bottle's id, else by brand + name (a bottle from the member's own collection), the
 * same concentration first.
 */
export function productPageLink({ brandKey, name, id, concentration }: OfficialQuery): OfficialLink | null {
  const brand = findBrand(brandKey);
  if (!brand) return null;
  let url = id ? OFFICIAL_PAGES[id] : undefined;
  if (!url && name) {
    const same = [...CATALOGUE, ...TAMBURINS].filter(
      (f) => OFFICIAL_PAGES[f.id] && brandForName(f.brand)?.key === brand.key && fold(f.name) === fold(name),
    );
    url = OFFICIAL_PAGES[(same.find((f) => f.concentration === concentration) ?? same[0])?.id ?? ""];
  }
  return url ? { url, label: `${brand.name} 官網商品頁`, kind: "page" } : null;
}

export const mockOfficialProvider: OfficialSearchProvider = {
  name: "mock",
  find: async (query) => brandHomeLink(query),
};
