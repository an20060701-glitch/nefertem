export interface OfficialQuery {
  brandKey: string;
  /** Perfume name, when the search named one. */
  name?: string;
}

export interface OfficialLink {
  url: string;
  label: string;
  /** "page": a page on the brand's own site; "home": its home page; "search": a web search for it. */
  kind: "page" | "home" | "search";
}

export interface OfficialSearchProvider {
  readonly name: string;
  find(query: OfficialQuery): Promise<OfficialLink | null>;
}
