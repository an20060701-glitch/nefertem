import { describe, expect, it } from "vitest";
import type { Fragrance } from "@/types";
import { withSuppliedImage } from "./supplied-image";

const saved = (brand: string, name: string, imageUrl?: string): Fragrance =>
  ({
    id: "x",
    brand,
    name,
    imageUrl,
    family: "woody",
    origin: "lookup",
    topNotes: [],
    heartNotes: [],
    baseNotes: [],
    tags: [],
    createdAt: 0,
  }) as Fragrance;

describe("withSuppliedImage", () => {
  it("gives a saved HEAVEN LAFA scent its supplied picture, in any brand spelling", () => {
    expect(withSuppliedImage(saved("HEAVEN LAFA", "永生法老魂")).imageUrl).toBe(
      "/images/heaven-lafa/immortal-soul.webp",
    );
    const long = withSuppliedImage(saved("天堂費洛香", "永生法老魂－慵懶偽體香"));
    expect(long.imageUrl).toBe("/images/heaven-lafa/immortal-soul.webp");
    expect(long.imageSource).toBe("https://www.heavenlafa.tw/Shop");
  });

  it("keeps the member's own picture and leaves other scents alone", () => {
    expect(withSuppliedImage(saved("LAFA", "永生法老魂", "https://x/me.jpg")).imageUrl).toBe(
      "https://x/me.jpg",
    );
    expect(withSuppliedImage(saved("Dior", "Sauvage")).imageUrl).toBeUndefined();
  });
});
