import { MAX_QUERY_LENGTH } from "./types";

/** Trim, collapse spaces, drop control characters and cap the length of user input. */
export function cleanQueryPart(value: string | null | undefined): string {
  return (value ?? "")
    .replace(/\p{Cc}/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_QUERY_LENGTH);
}

/**
 * Comparison key: case, accents, spaces and punctuation don't matter, so
 * "Maison Francis Kurkdjian", "maison-francis kurkdjian" and "MAISON FRANCIS KURKDJIAN" agree,
 * as do "Baccarat Rouge 540" and "baccarat rouge540". CJK characters are kept as they are.
 */
export function fold(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, "");
}
