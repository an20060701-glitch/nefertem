import { FAMILIES } from "@/lib/fragrance/families";
import { cn } from "@/lib/cn";
import type { FragranceFamily } from "@/types";

/**
 * Line-drawn flacon used when a scent has no photograph (design system §5):
 * ink outline like the illustration, a hairline of juice tinted by family,
 * and a lotus etched on the glass.
 */
export function FragranceBottle({
  family,
  label,
  className,
}: {
  family: FragranceFamily;
  label?: string;
  className?: string;
}) {
  const color = FAMILIES[family].color;
  return (
    <svg
      viewBox="0 0 160 240"
      className={cn("text-ink", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      >
        {/* cap */}
        <rect x="60" y="14" width="40" height="34" />
        <path d="M60 26 H100" opacity="0.4" />
        {/* collar */}
        <path d="M68 48 V60 H92 V48" />
        {/* body */}
        <path d="M30 76 Q30 62 44 62 H116 Q130 62 130 76 V214 Q130 226 118 226 H42 Q30 226 30 214 Z" />
        <path d="M38 82 V206" opacity="0.25" />
      </g>
      {/* juice */}
      <path d="M31 120 H129 V214 Q129 225 118 225 H42 Q31 225 31 214 Z" fill={color} opacity="0.14" />
      <path d="M31 120 H129" stroke={color} strokeWidth="1" opacity="0.8" />
      {/* etched lotus */}
      <g
        fill="none"
        stroke="var(--lotus-deep)"
        strokeWidth="0.9"
        opacity="0.75"
        transform="translate(56 140) scale(0.75)"
      >
        <path d="M32 12 C38.5 21 38.5 33 32 44 C25.5 33 25.5 21 32 12 Z" />
        <path d="M32 44 C35 33 41.5 26.5 50 24.5 C50.5 35 43 43 32 44 Z" />
        <path d="M32 44 C29 33 22.5 26.5 14 24.5 C13.5 35 21 43 32 44 Z" />
        <path d="M18 50.5 H46" />
      </g>
    </svg>
  );
}
