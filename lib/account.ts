/** Where the ritual begins once the visitor is signed in. */
export const RITUAL_HOME = "/choice";

/** The sign-in page, returning to `next` afterwards. */
export function loginHref(next: string = RITUAL_HOME): string {
  return `/login?next=${encodeURIComponent(next)}`;
}

/** Only same-site paths may be returned to after sign-in (no "//evil.example"). */
export function safeNext(value: unknown): string {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : RITUAL_HOME;
}
