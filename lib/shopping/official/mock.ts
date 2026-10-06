import { findBrand } from "@/data/brands";
import { webSearchUrl } from "../links";
import type { OfficialLink, OfficialQuery, OfficialSearchProvider } from "./types";

/** Brand home page from data/brands.ts; a web search when we do not list the brand's domain. */
export function brandHomeLink({ brandKey }: OfficialQuery): OfficialLink | null {
  const brand = findBrand(brandKey);
  if (!brand) return null;
  if (brand.domain)
    return { url: `https://www.${brand.domain}/`, label: `${brand.name} 官方網站`, kind: "home" };
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
