import { describe, expect, it } from "vitest";
import { loginHref, RITUAL_HOME, safeNext } from "./account";

describe("safeNext", () => {
  it("keeps same-site paths", () => {
    expect(safeNext("/collection/demo-1?x=1")).toBe("/collection/demo-1?x=1");
    expect(safeNext("/choice")).toBe("/choice");
  });

  it("refuses anything that could leave the site", () => {
    for (const value of ["//evil.example", "/\\evil.example", "https://evil.example", "evil", "/\tx", undefined, 3])
      expect(safeNext(value)).toBe(RITUAL_HOME);
  });
});

describe("loginHref", () => {
  it("encodes where to return to", () => {
    expect(loginHref("/collection/a b")).toBe("/login?next=%2Fcollection%2Fa%20b");
  });
});
