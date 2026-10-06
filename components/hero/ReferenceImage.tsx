import Image from "next/image";
import { LotusGlyph } from "@/components/brand/LotusGlyph";
import { cn } from "@/lib/cn";

export const REFERENCE_IMAGE_PATH = "/images/nefertem-key-visual.png";
/** Same artwork with its white paper made transparent, so it sits on any background. */
export const REFERENCE_IMAGE_ALPHA_PATH = "/images/nefertem-key-visual-alpha.webp";

interface ReferenceImageProps {
  available: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Use the transparent version (no white paper). */
  transparent?: boolean;
}

/**
 * The official Nefertem illustration when present in /public/images,
 * otherwise a clearly-labelled placeholder (never a substitute artwork).
 */
export function ReferenceImage({
  available,
  className,
  priority = false,
  sizes = "100vw",
  transparent = false,
}: ReferenceImageProps) {
  if (available) {
    return (
      <Image
        src={transparent ? REFERENCE_IMAGE_ALPHA_PATH : REFERENCE_IMAGE_PATH}
        alt="NEFERTEM Key Visual：頭戴藍色睡蓮的香氣之神，手持香水瓶與睡蓮，身旁是太陽神 Ra 的鷹與香水瓶"
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center gap-5 bg-surface-raised text-faint",
        className,
      )}
      role="img"
      aria-label="Nefertem 官方插畫占位框"
    >
      <span aria-hidden className="absolute inset-3 border border-line" />
      <LotusGlyph size={72} strokeWidth={0.9} className="text-blue-light" />
      <span className="label text-center text-[0.625rem] text-muted">
        NEFERTEM
        <br />
        KEY VISUAL
      </span>
      <span className="text-center text-[0.6875rem] tracking-[0.04em] text-faint">
        {REFERENCE_IMAGE_PATH}
      </span>
    </div>
  );
}
