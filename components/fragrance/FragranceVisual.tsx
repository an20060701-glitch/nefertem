import { cn } from "@/lib/cn";
import type { Fragrance } from "@/types";
import { FragranceBottle } from "./FragranceBottle";

/** The member's own photo when there is one, otherwise the line-drawn flacon. */
export function FragranceVisual({ fragrance, className }: { fragrance: Fragrance; className?: string }) {
  if (fragrance.imageUrl) {
    return (
      // Member photos come from Firebase Storage with per-user URLs; next/image would need a remote pattern per bucket.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={fragrance.imageUrl}
        alt={`${fragrance.brand} ${fragrance.name}`}
        loading="lazy"
        className={cn("h-full w-full object-contain", className)}
      />
    );
  }
  return (
    <FragranceBottle
      family={fragrance.family}
      label={`${fragrance.brand} ${fragrance.name} 的瓶身線稿`}
      className={cn("h-full", className)}
    />
  );
}
