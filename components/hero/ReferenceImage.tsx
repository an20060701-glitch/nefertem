import Image from "next/image";
import { LotusGlyph } from "@/components/brand/LotusGlyph";
import { cn } from "@/lib/cn";

export const REFERENCE_IMAGE_PATH = "/images/nefertem-reference.png";

interface ReferenceImageProps {
  available: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
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
}: ReferenceImageProps) {
  if (available) {
    return (
      <Image
        src={REFERENCE_IMAGE_PATH}
        alt="Nefertem 官方插畫：藍色睡蓮、香水瓶與香氣煙霧"
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
      <span aria-hidden className="absolute inset-3 rounded-t-full border border-line" />
      <LotusGlyph size={72} strokeWidth={0.9} className="text-blue-light" />
      <span className="label text-center text-[0.625rem] text-muted">
        NEFERTEM
        <br />
        REFERENCE IMAGE
      </span>
      <span className="text-center text-[0.6875rem] tracking-[0.04em] text-faint">
        {REFERENCE_IMAGE_PATH}
      </span>
    </div>
  );
}
