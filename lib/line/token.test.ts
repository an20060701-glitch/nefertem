import { generateKeyPairSync, createVerify } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createCustomToken, parseServiceAccount } from "./token";

const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const pem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();

describe("Firebase custom token", () => {
  it("reads the service account JSON as downloaded, escaped newlines included", () => {
    const raw = JSON.stringify({
      client_email: "sa@x.iam.gserviceaccount.com",
      private_key: pem.replace(/\n/g, "\\n"),
    });
    expect(parseServiceAccount(raw)).toEqual({
      clientEmail: "sa@x.iam.gserviceaccount.com",
      privateKey: pem,
    });
    expect(parseServiceAccount("not json")).toBeNull();
    expect(parseServiceAccount(JSON.stringify({ client_email: "a" }))).toBeNull();
    expect(parseServiceAccount(undefined)).toBeNull();
  });

  it("is an RS256 JWT for the uid, signed by the service account, valid for an hour", () => {
    const token = createCustomToken({ clientEmail: "sa@x", privateKey: pem }, "line:U123", 1_700_000_000_000);
    const [header, payload, signature] = token.split(".");
    expect(JSON.parse(Buffer.from(header, "base64url").toString())).toEqual({ alg: "RS256", typ: "JWT" });
    const claims = JSON.parse(Buffer.from(payload, "base64url").toString());
    expect(claims).toMatchObject({
      iss: "sa@x",
      sub: "sa@x",
      uid: "line:U123",
      iat: 1_700_000_000,
      exp: 1_700_003_600,
    });
    expect(claims.aud).toBe(
      "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
    );
    const verifier = createVerify("RSA-SHA256");
    verifier.update(`${header}.${payload}`);
    expect(verifier.verify(publicKey, Buffer.from(signature, "base64url"))).toBe(true);
  });
});
