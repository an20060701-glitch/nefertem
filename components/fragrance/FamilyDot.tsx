import { FAMILIES } from "@/lib/fragrance/families";
import { cn } from "@/lib/cn";
import type { FragranceFamily } from "@/types";

/** Watercolour swatch dot + family name ("● 木質 WOODY"). */
export function FamilyDot({
  family,
  showLabel = true,
  className,
}: {
  family: FragranceFamily;
  showLabel?: boolean;
  className?: string;
}) {
  const def = FAMILIES[family];
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span aria-hidden className="size-2 shrink-0 rounded-full" style={{ background: def.color }} />
      {showLabel && (
        <>
          <span className="font-serif-zh text-small text-ink">{def.zh}</span>
          <span className="label text-faint">{def.en}</span>
        </>
      )}
    </span>
  );
}
