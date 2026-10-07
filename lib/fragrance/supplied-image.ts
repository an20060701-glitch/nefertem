import { HEAVEN_LAFA } from "@/data/heaven-lafa";
import { brandForName, fold } from "@/lib/shopping/normalize";
import type { Fragrance } from "@/types";

/** The perfumes whose pictures the brand supplied (kept in public/images). */
const SUPPLIED = HEAVEN_LAFA.filter((f) => f.imageUrl && f.imageSource);

/**
 * A scent saved without a picture, shown with the one its brand supplied when it is one
 * of those perfumes ("永生法老魂" or "永生法老魂－慵懶偽體香"). Scents saved before the
 * pictures were added get them this way; a member photo or linked picture always wins.
 */
export function withSuppliedImage(f: Fragrance): Fragrance {
  if (f.imageUrl) return f;
  const brand = brandForName(f.brand)?.key;
  if (!brand) return f;
  const name = fold(f.name);
  const match = SUPPLIED.find(
    (s) => brandForName(s.brand)?.key === brand && name.length > 0 && name.startsWith(fold(s.name)),
  );
  return match ? { ...f, imageUrl: match.imageUrl, imageSource: match.imageSource } : f;
}
