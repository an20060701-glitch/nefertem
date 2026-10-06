import "server-only";

import { mockFragranceProvider } from "./mock";
import type { FragranceDataProvider, FragranceLookupResult, FragranceQuery } from "./types";

function configuredProvider(): FragranceDataProvider {
  // Only the mock provider exists in v1; FRAGRANCE_LOOKUP_PROVIDER is where a licensed
  // data source will be switched on later (architecture §7.1).
  return mockFragranceProvider;
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
