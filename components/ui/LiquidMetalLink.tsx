"use client";

import { LiquidMetalButton } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";
import { useRouter } from "next/navigation";

/**
 * ThreeUI's liquid-metal pill (An, 2026-10-08) used as a link. The button draws itself inside
 * a sandboxed iframe on its own black stage, so the frame is cut to the pill's shape: only the
 * dark pill with its moving metal rim shows on the ivory page. The label is set in the
 * iframe's own font (Inter), so keep it Latin and at most 24 characters.
 */
const PILL_HEIGHT = 52; // the iframe's control height, px
const CIRCLE = 56; // the circle variant's size in a small frame (its clamp floor), px
const SHADOW = "shadow-[0_12px_28px_-14px_rgb(0_0_0/0.6)]";

/**
 * The iframe lays its stage out from the top left, and the stage keeps a dark margin of
 * 900/516 of the control's height round the button for its glow. So the frame is made the
 * stage's full size and pulled back by that margin inside a window the button's own size.
 */
function Window({ width, height, children }: { width: number; height: number; children: React.ReactNode }) {
  const pad = (900 * height) / 516;
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full ${SHADOW} [&>.liquid-metal-button]:!absolute`}
      style={
        {
          width,
          height,
          "--lm-pad": `${-pad}px`,
          "--lm-w": `${Math.ceil(width + 2 * pad)}px`,
          "--lm-h": `${Math.ceil(height + 2 * pad)}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}

const FRAME = "!left-[var(--lm-pad)] !top-[var(--lm-pad)] !h-[var(--lm-h)] !w-[var(--lm-w)]";

export function LiquidMetalLink({ href, label }: { href: string; label: string }) {
  const router = useRouter();
  const text = label.slice(0, 24);
  // The package's own sizing: width in its reference units, where 516 units = the pill's height.
  const units = Math.min(3000, Math.max(1407, 820 + text.length * 94));
  return (
    <Window width={(units * PILL_HEIGHT) / 516} height={PILL_HEIGHT}>
      <LiquidMetalButton variant="pill" text={text} className={FRAME} onClick={() => router.push(href)} />
    </Window>
  );
}

/** The round liquid-metal ＋ button (An, 2026-10-08), with a caption that does the same. */
export function LiquidMetalAdd({
  label,
  caption,
  onClick,
}: {
  label: string;
  caption: string;
  onClick: () => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <Window width={CIRCLE} height={CIRCLE}>
        <LiquidMetalButton variant="circle" text={label} className={FRAME} onClick={onClick} />
      </Window>
      <button type="button" onClick={onClick} tabIndex={-1} className="press-soft label text-ink">
        {caption}
      </button>
    </div>
  );
}
