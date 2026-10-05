import Link from "next/link";
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
  sm: "text-[1.125rem]",
  md: "text-[1.5rem]",
  lg: "text-[2.25rem]",
} as const;

export function NefertemLogo({
  withTagline = false,
  withGlyph = false,
  href = "/",
  className,
  size = "md",
}: NefertemLogoProps) {
  const mark = (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {withGlyph ? <LotusGlyph size="1.4em" className="text-blue" /> : null}
      <span className="flex flex-col leading-none">
        <span className={cn("font-display font-normal tracking-[0.24em]", SIZES[size])}>NEFERTEM</span>
        {withTagline ? (
          <span className="label mt-2 text-[0.5625rem] text-muted">SCENT • RITUAL • MEMORY</span>
        ) : null}
      </span>
    </span>
  );

  if (!href) return mark;
  return (
    <Link href={href} aria-label="NEFERTEM 首頁">
      {mark}
    </Link>
  );
}
