import { describe, expect, it } from "vitest";
import { afterSignIn, loginHref, RITUAL_HOME, safeNext } from "./account";

describe("safeNext", () => {
  it("keeps same-site paths", () => {
    expect(safeNext("/collection/demo-1?x=1")).toBe("/collection/demo-1?x=1");
    expect(safeNext("/choice")).toBe("/choice");
  });

  it("refuses anything that could leave the site", () => {
    for (const value of [
      "//evil.example",
      "/\\evil.example",
      "https://evil.example",
      "evil",
      "/\tx",
      undefined,
      3,
    ])
      expect(safeNext(value)).toBe(RITUAL_HOME);
  });
});

describe("loginHref", () => {
  it("encodes where to return to", () => {
    expect(loginHref("/collection/a b")).toBe("/login?next=%2Fcollection%2Fa%20b");
  });
});

describe("afterSignIn", () => {
  const user = (created: string, last: string) => ({
    metadata: { creationTime: created, lastSignInTime: last },
  });
  const returning = user("Mon, 05 Oct 2026 10:00:00 GMT", "Wed, 07 Oct 2026 04:40:00 GMT");
  const brandNew = user("Wed, 07 Oct 2026 04:40:00 GMT", "Wed, 07 Oct 2026 04:40:01 GMT");

  it("sends a returning member to 香水選擇 instead of the cabinet", () => {
    expect(afterSignIn("/collection", returning)).toBe(RITUAL_HOME);
    expect(afterSignIn(RITUAL_HOME, returning)).toBe(RITUAL_HOME);
  });

  it("keeps a first sign-in where it was going, and other pages for everyone", () => {
    expect(afterSignIn("/collection", brandNew)).toBe("/collection");
    expect(afterSignIn("/shopping", returning)).toBe("/shopping");
    expect(afterSignIn("/collection", user("", ""))).toBe("/collection");
  });
});
