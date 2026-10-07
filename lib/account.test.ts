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
  it("sends a member with scents to 香水選擇, from the cabinet or the ritual", () => {
    expect(afterSignIn("/collection", true)).toBe(RITUAL_HOME);
    expect(afterSignIn(RITUAL_HOME, true)).toBe(RITUAL_HOME);
  });

  it("sends a new member (empty cabinet) to the cabinet first, and other pages back as they were", () => {
    expect(afterSignIn(RITUAL_HOME, false)).toBe("/collection");
    expect(afterSignIn("/collection", false)).toBe("/collection");
    expect(afterSignIn("/shopping", true)).toBe("/shopping");
    expect(afterSignIn("/shopping", false)).toBe("/shopping");
  });
});
