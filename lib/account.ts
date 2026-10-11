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

/**
 * Where a sign-in lands (An, 2026-10-07). A member who already has scents goes to
 * 香水選擇, even when it was the cabinet that asked for sign-in; a new member (an empty
 * cabinet) goes to 我的香水櫃 first, to add their scents. Other pages that asked for
 * sign-in (搜尋購物, one scent's page) are returned to as before. Read from the cabinet,
 * not the account's sign-in times, which phones do not always report in step.
 */
export function afterSignIn(next: string, hasScents: boolean): string {
  if (next !== "/collection" && next !== RITUAL_HOME) return next;
  return hasScents ? RITUAL_HOME : "/collection";
}

/** The cover and the three sections: the pages a member can open the site on. */
const OPENING_PAGES = /^\/(?:$|choice(?:\/|$)|collection(?:\/|$)|shopping(?:\/|$))/;

/**
 * Where a signed-in member lands when the site is opened, reloaded or a closed tab is
 * reopened (An, 2026-10-11): always 香水選擇, or 我的香水櫃 while the cabinet is empty.
 * Undefined when they are already there, or on a page outside the sections (sign-in, admin).
 */
export function afterOpening(pathname: string, hasScents: boolean): string | undefined {
  if (!OPENING_PAGES.test(pathname)) return undefined;
  const target = afterSignIn(RITUAL_HOME, hasScents);
  return pathname === target ? undefined : target;
}
