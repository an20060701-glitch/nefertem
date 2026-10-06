import type { Fragrance } from "@/types";

/** Longest brand or name we accept; anything longer is not a perfume name. */
export const MAX_QUERY_LENGTH = 80;

export interface FragranceQuery {
  brand: string;
  name: string;
}

/** What a provider found: fields to prefill, how sure it is, and where the data came from. */
export interface FragranceLookupResult {
  fragrance: Partial<Omit<Fragrance, "id" | "createdAt" | "origin">>;
  confidence: "high" | "medium" | "low";
  /** Human-readable sources, shown to the user before they save (architecture §7.1). */
  sources: string[];
}

/**
 * Smart lookup providers live behind this interface and run only on the server
 * (Route Handler), never in the browser. A future provider — a licensed fragrance
 * API, a brand's own structured data — must state its source honestly and respect
 * robots.txt, terms of service and rate limits; no scraping from the frontend.
 */
export interface FragranceDataProvider {
  name: string;
  lookup(query: FragranceQuery): Promise<FragranceLookupResult | null>;
}
