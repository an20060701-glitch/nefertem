/** Where the ritual begins once the visitor is signed in. */
export const RITUAL_HOME = "/choice";

/** The sign-in page, returning to `next` afterwards. */
export function loginHref(next: string = RITUAL_HOME): string {
  return `/login?next=${encodeURIComponent(next)}`;
}

/**
 * Only same-site paths may be returned to after sign-in. Browsers read a
 * backslash as a slash, so "/\\evil.example" is as off-site as "//evil.example".
 */
export function safeNext(value: unknown): string {
  return typeof value === "string" && /^\/(?![/\\])/.test(value) && !/[\u0000-\u001f]/.test(value)
    ? value
    : RITUAL_HOME;
}
