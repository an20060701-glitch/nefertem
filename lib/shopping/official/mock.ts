import { findBrand } from "@/data/brands";
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

export const mockOfficialProvider: OfficialSearchProvider = {
  name: "mock",
  find: async (query) => brandHomeLink(query),
};
