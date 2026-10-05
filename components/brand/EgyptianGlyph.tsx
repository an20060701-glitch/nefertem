import { cn } from "@/lib/cn";

/*
 * Hand-drawn sacred marks from the key visual's margins — ankh, the eye of
 * Horus, a lotus stalk and the Ra disc — rendered as fine gilt ink lines.
 * Used sparingly as editorial ornaments, never as borders or patterns.
 */
const GLYPHS = {
  ankh: (
    <>
      <path d="M12 3.2c-2.4 0-3.9 2-3.9 4.1 0 2.4 1.9 4.2 3.9 5.2 2-1 3.9-2.8 3.9-5.2 0-2.1-1.5-4.1-3.9-4.1z" />
      <path d="M5.2 12.6h13.6M12 12.5v8.5" />
    </>
  ),
  eye: (
    <>
      <path d="M3 11.2c2.6-3 5.6-4.4 9-4.4s6.4 1.4 9 4.4c-2.6 2.8-5.6 4.2-9 4.2s-6.4-1.4-9-4.2z" />
      <circle cx="12" cy="11.1" r="2.3" />
      <path d="M3.5 6.2c2.8-1.5 5.6-2.1 8.5-2.1s5.7.6 8.5 2.1" />
      <path d="M10.4 15.3l-1.2 4.4M13.6 15.2c.9 1.6 2.4 2.6 4.6 2.8 1 .1 1.6-.6 1.4-1.4" />
    </>
  ),
  stalk: (
    <>
      <path d="M12 21V10.5" />
      <path d="M12 10.5c-1.8-1.5-2.4-3.7-1.6-6.2 1.6.9 2.5 2.4 2.7 4.3M12 10.5c1.8-1.5 2.4-3.7 1.6-6.2" />
      <path d="M12 10.3c-2.2.1-4.2-.9-5.6-2.9M12 10.3c2.2.1 4.2-.9 5.6-2.9" />
      <path d="M12 17c-1.6-1.6-3.6-2.1-5.2-1.6M12 17c1.6-1.6 3.6-2.1 5.2-1.6" />
    </>
  ),
  ra: (
    <>
      <circle cx="12" cy="11" r="4.6" />
      <path d="M5.8 15.2c1.4 1.9 3.6 3 6.2 3s4.8-1.1 6.2-3M4.6 6.3l-1.6-1M19.4 6.3l1.6-1M12 3.2V1.6M7.4 4.3l-.9-1.4M16.6 4.3l.9-1.4" />
    </>
  ),
} as const;

export type GlyphName = keyof typeof GLYPHS;

interface EgyptianGlyphProps {
  name: GlyphName;
  size?: number | string;
  className?: string;
  strokeWidth?: number;
}

export function EgyptianGlyph({ name, size = 24, className, strokeWidth = 1 }: EgyptianGlyphProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("text-gilt", className)}
    >
      {GLYPHS[name]}
    </svg>
  );
}
