import "server-only";

import { createGoogleCseProvider } from "./google-cse";
import { brandHomeLink, mockOfficialProvider } from "./mock";
import type { OfficialLink, OfficialQuery, OfficialSearchProvider } from "./types";

function configuredProvider(): OfficialSearchProvider {
  const key = process.env.GOOGLE_CSE_KEY;
  const cx = process.env.GOOGLE_CSE_ID;
  return key && cx ? createGoogleCseProvider(key, cx) : mockOfficialProvider;
}

/** The best official link we can give. Never throws: falls back to the brand's home page. */
export async function findOfficial(query: OfficialQuery): Promise<OfficialLink | null> {
  const provider = configuredProvider();
  try {
    return (await provider.find(query)) ?? brandHomeLink(query);
  } catch (error) {
    console.error(`[official] ${provider.name} failed, using brand home`, error);
    return brandHomeLink(query);
  }
}

export type { OfficialLink } from "./types";
