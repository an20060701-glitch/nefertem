import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { NefertemEmblem } from "./NefertemEmblem";

interface NefertemLogoProps {
  /** Show the "A Life in Scent" line under the wordmark. */
  withTagline?: boolean;
  /** Show the lotus emblem beside the wordmark. */
  withGlyph?: boolean;
  href?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "text-[1.375rem]",
  md: "text-[1.75rem]",
  lg: "text-[2.5rem]",
} as const;

/** Nefertem brand logo: the gilt lotus emblem with the wordmark set in Cormorant. */
export function NefertemLogo({
  withTagline = false,
  withGlyph = true,
  href = "/",
  className,
  size = "md",
}: NefertemLogoProps) {
  const mark = (
    <span className={cn("inline-flex items-center gap-[0.45em]", SIZES[size], className)}>
      {withGlyph ? <NefertemEmblem className="h-[1.8em] w-auto shrink-0" /> : null}
      <span className="flex flex-col leading-none">
        <span className="font-display font-normal tracking-[0.04em] text-ink">{BRAND.name}</span>
        {withTagline ? (
          <span className="mt-1.5 font-display text-[0.4em] italic tracking-[0.22em] text-gold-text">
            {BRAND.logoLine}
          </span>
        ) : null}
      </span>
    </span>
  );

  if (!href) return mark;
  return (
    <Link href={href} aria-label={`${BRAND.name} 首頁`}>
      {mark}
    </Link>
  );
}
