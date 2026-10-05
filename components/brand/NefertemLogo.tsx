import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { LotusGlyph } from "./LotusGlyph";

interface NefertemLogoProps {
  /** Show the SCENT • RITUAL • MEMORY line under the wordmark. */
  withTagline?: boolean;
  withGlyph?: boolean;
  href?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "text-[1.0625rem]",
  md: "text-[1.375rem]",
  lg: "text-[2rem]",
} as const;

/** 香水人生 wordmark in Song-style serif, with the lotus as brand mark. */
export function NefertemLogo({
  withTagline = false,
  withGlyph = false,
  href = "/",
  className,
  size = "md",
}: NefertemLogoProps) {
  const mark = (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {withGlyph ? <LotusGlyph size="1.5em" className="text-lotus-deep" /> : null}
      <span className="flex flex-col leading-none">
        <span className={cn("font-serif-zh font-normal tracking-[0.32em]", SIZES[size])}>{BRAND.name}</span>
        {withTagline ? <span className="label mt-2 text-[0.5625rem] text-muted">{BRAND.tagline}</span> : null}
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
