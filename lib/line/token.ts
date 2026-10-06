import { createSign } from "node:crypto";

/** Firebase custom tokens (https://firebase.google.com/docs/auth/admin/create-custom-tokens#create_custom_tokens_using_a_third-party_jwt_library). */
const AUDIENCE = "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit";
const LIFETIME_S = 3600;

export interface ServiceAccount {
  clientEmail: string;
  privateKey: string;
}

/** Reads FIREBASE_SERVICE_ACCOUNT_KEY: the service account JSON from the Firebase console, as is. */
export function parseServiceAccount(raw: string | undefined): ServiceAccount | null {
  if (!raw) return null;
  try {
    const json = JSON.parse(raw) as { client_email?: unknown; private_key?: unknown };
    if (typeof json.client_email !== "string" || typeof json.private_key !== "string") return null;
    return { clientEmail: json.client_email, privateKey: json.private_key.replace(/\\n/g, "\n") };
  } catch {
    return null;
  }
}

const b64url = (input: string | Buffer) => Buffer.from(input).toString("base64url");

/** An RS256 JWT that signInWithCustomToken accepts for `uid`, valid for an hour. */
export function createCustomToken(account: ServiceAccount, uid: string, now = Date.now()): string {
  const iat = Math.floor(now / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64url(
    JSON.stringify({
      iss: account.clientEmail,
      sub: account.clientEmail,
      aud: AUDIENCE,
      iat,
      exp: iat + LIFETIME_S,
      uid,
    }),
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${payload}`);
  return `${header}.${payload}.${signer.sign(account.privateKey).toString("base64url")}`;
}
