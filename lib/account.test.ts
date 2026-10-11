import { describe, expect, it } from "vitest";
import { afterOpening, afterSignIn, loginHref, RITUAL_HOME, safeNext } from "./account";

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

describe("afterOpening", () => {
  it("opens every section on 香水選擇 for a member with scents, whatever page was reloaded", () => {
    for (const path of ["/", "/collection", "/collection/demo-1", "/shopping"])
      expect(afterOpening(path, true)).toBe(RITUAL_HOME);
    expect(afterOpening(RITUAL_HOME, true)).toBeUndefined();
  });

  it("opens on the cabinet while it is empty, so a new member adds scents first", () => {
    for (const path of ["/", RITUAL_HOME, "/shopping"]) expect(afterOpening(path, false)).toBe("/collection");
    expect(afterOpening("/collection", false)).toBeUndefined();
  });

  it("leaves sign-in and other pages alone", () => {
    for (const path of ["/login", "/login/line", "/admin", "/choicex"])
      expect(afterOpening(path, true)).toBeUndefined();
  });
});
