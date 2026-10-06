import "server-only";

import { catalogueFragranceProvider } from "./catalogue";
import type { FragranceDataProvider, FragranceLookupResult, FragranceQuery } from "./types";

function configuredProvider(): FragranceDataProvider {
  // An's brand product list, then the demo catalogue (2026-10-07). FRAGRANCE_LOOKUP_PROVIDER
  // is where a licensed data source will be switched on later (architecture §7.1).
  return catalogueFragranceProvider;
}

/** Look a scent up on the server. Never throws: a failing provider reads as "not found". */
export async function lookupFragrance(query: FragranceQuery): Promise<FragranceLookupResult | null> {
  const provider = configuredProvider();
  try {
    return await provider.lookup(query);
  } catch (error) {
    console.error(`[lookup] ${provider.name} failed`, error);
    return null;
  }
}

export type { FragranceLookupResult, FragranceQuery } from "./types";
