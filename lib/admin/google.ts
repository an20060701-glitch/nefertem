import "server-only";
import { createSign } from "node:crypto";
import type { ServiceAccount } from "@/lib/line/token";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/cloud-platform";

const b64url = (input: string | Buffer) => Buffer.from(input).toString("base64url");

let cached: { token: string; expires: number } | null = null;

/** An OAuth access token for the service account (JWT bearer grant), reused until a minute before it expires. */
export async function accessToken(account: ServiceAccount): Promise<string> {
  if (cached && cached.expires > Date.now() + 60_000) return cached.token;
  const iat = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64url(
    JSON.stringify({ iss: account.clientEmail, scope: SCOPE, aud: TOKEN_URL, iat, exp: iat + 3600 }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${payload}`);
  const assertion = `${header}.${payload}.${signer.sign(account.privateKey).toString("base64url")}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Google token ${res.status}`);
  const { access_token: token, expires_in: ttl } = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token, expires: Date.now() + ttl * 1000 };
  return token;
}
