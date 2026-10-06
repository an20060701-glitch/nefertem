import "server-only";
import { randomBytes } from "node:crypto";
import { createCustomToken, parseServiceAccount } from "./token";

/**
 * LINE Login handled by our own server (An, 2026-10-06). On iPhone, LINE's
 * auto login hands off to the LINE app, which reopens the site in a new tab;
 * Firebase's popup/redirect keeps its state in the old tab's sessionStorage
 * and fails. Here the state lives in an httpOnly cookie, so any tab can finish.
 * The channel secret and the service account key stay on the server.
 */
export const LINE_COOKIE = "nefertem_line";
const AUTHORIZE = "https://access.line.me/oauth2/v2.1/authorize";
const TOKEN = "https://api.line.me/oauth2/v2.1/token";
const VERIFY = "https://api.line.me/oauth2/v2.1/verify";

export function lineConfig() {
  const channelId = process.env.LINE_CHANNEL_ID;
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  const account = parseServiceAccount(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  return channelId && channelSecret && account ? { channelId, channelSecret, account } : null;
}

export const callbackUrl = (origin: string) => `${origin}/api/auth/line/callback`;

export interface PendingLogin {
  state: string;
  nonce: string;
  next: string;
}

export function newPendingLogin(next: string): PendingLogin {
  return { state: randomBytes(16).toString("hex"), nonce: randomBytes(16).toString("hex"), next };
}

export function authorizeUrl(channelId: string, origin: string, pending: PendingLogin): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: channelId,
    redirect_uri: callbackUrl(origin),
    state: pending.state,
    scope: "openid profile",
    nonce: pending.nonce,
  });
  return `${AUTHORIZE}?${params}`;
}

export interface LineIdentity {
  /** LINE user ID, stable per provider. */
  sub: string;
  name?: string;
}

/** Trades the code for an ID token and has LINE verify it (signature, audience, expiry, nonce). */
export async function identify(
  config: NonNullable<ReturnType<typeof lineConfig>>,
  origin: string,
  code: string,
  nonce: string,
): Promise<LineIdentity> {
  const tokenRes = await fetch(TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: callbackUrl(origin),
      client_id: config.channelId,
      client_secret: config.channelSecret,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!tokenRes.ok) throw new Error(`LINE token ${tokenRes.status}`);
  const { id_token: idToken } = (await tokenRes.json()) as { id_token?: string };
  if (!idToken) throw new Error("LINE token: no id_token");

  const verifyRes = await fetch(VERIFY, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ id_token: idToken, client_id: config.channelId, nonce }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!verifyRes.ok) throw new Error(`LINE verify ${verifyRes.status}`);
  const claims = (await verifyRes.json()) as { sub?: string; name?: string };
  if (!claims.sub) throw new Error("LINE verify: no sub");
  return { sub: claims.sub, name: claims.name };
}

/** One Firebase account per LINE user. */
export function firebaseTokenFor(config: NonNullable<ReturnType<typeof lineConfig>>, sub: string): string {
  return createCustomToken(config.account, `line:${sub}`);
}
