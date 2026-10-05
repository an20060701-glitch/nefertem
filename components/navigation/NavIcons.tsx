import { Compass } from "lucide-react";
import type { NavKey } from "@/lib/navigation";
import { LotusGlyph } from "@/components/brand/LotusGlyph";

/** Slender perfume bottle: cap, neck, shoulders, body. */
function BottleIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M10 2.75h4v3h-4z" />
      <path d="M10.75 5.75v2.5M13.25 5.75v2.5" />
      <path d="M8 8.25h8a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5H8a1.5 1.5 0 0 1-1.5-1.5v-10A1.5 1.5 0 0 1 8 8.25z" />
      <path d="M9.5 14h5" />
    </svg>
  );
}

export function NavIcon({ name, size = 24 }: { name: NavKey; size?: number }) {
  switch (name) {
    case "choice":
      return <LotusGlyph size={size} strokeWidth={1.25} />;
    case "collection":
      return <BottleIcon size={size} />;
    case "shopping":
      return <Compass size={size} strokeWidth={1.25} aria-hidden />;
  }
}
