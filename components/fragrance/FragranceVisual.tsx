"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { withSuppliedImage } from "@/lib/fragrance/supplied-image";
import type { Fragrance } from "@/types";
import { FragranceBottle } from "./FragranceBottle";

/**
 * The member's photo or the brand's official picture when there is one, otherwise the
 * line-drawn flacon — also when a linked picture no longer loads.
 */
export function FragranceVisual({
  fragrance: saved,
  className,
}: {
  fragrance: Fragrance;
  className?: string;
}) {
  const fragrance = withSuppliedImage(saved);
  const [failed, setFailed] = useState<string>();
  if (fragrance.imageUrl && failed !== fragrance.imageUrl) {
    return (
      // Member photos come from Firebase Storage with per-user URLs, official pictures from each brand's site;
      // next/image would need a remote pattern per host.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={fragrance.imageUrl}
        alt={`${fragrance.brand} ${fragrance.name}`}
        loading="lazy"
        onError={() => setFailed(fragrance.imageUrl)}
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
