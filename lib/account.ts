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

/** A sign-in within this long of the account's creation is its first one. */
const FIRST_SIGN_IN_MS = 60_000;

/**
 * Where a sign-in lands (An, 2026-10-07). A returning member goes to 香水選擇 rather
 * than back to the cabinet; a first sign-in keeps `next`, so a new member still adds
 * their scents first and is guided on to 香水選擇 from there. Other pages that asked
 * for sign-in (搜尋購物, one scent's page) are returned to as before.
 */
export function afterSignIn(
  next: string,
  user: { metadata: { creationTime?: string; lastSignInTime?: string } },
): string {
  const created = Date.parse(user.metadata.creationTime ?? "");
  const signedIn = Date.parse(user.metadata.lastSignInTime ?? "");
  const firstTime =
    !Number.isFinite(created) || !Number.isFinite(signedIn) || signedIn - created < FIRST_SIGN_IN_MS;
  return !firstTime && next === "/collection" ? RITUAL_HOME : next;
}
