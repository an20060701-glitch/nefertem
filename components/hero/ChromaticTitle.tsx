"use client";

import { useEffect, useRef } from "react";

/**
 * The cover's wordmark assembling itself (An, 2026-10-08, after ThreeUI's TextAnimationCollection
 * "threeui-intro", light mode): each letter flies in from a scattered spot, slightly enlarged,
 * with its red, green and blue split apart and blurred, and settles sharp. Motion ported (MIT)
 * from the package's chromatic wordmark; its own component only spells "ThreeUI".
 * Plays once as the page opens, again when the pointer comes back to the title. Also spells
 * the name on the loading ritual (An, 2026-10-08).
 */
const ASSEMBLE = 1.5; // seconds for the slowest letter to land

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** A fixed scatter per letter, so it lands the same way every time (the package's seeded rng). */
function scatter(count: number): [number, number, number][] {
  let a = 7719 >>> 0;
  const r = () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: count }, () => [r() * 2 - 1, r() * 2 - 1, r()]);
}

export function ChromaticTitle({
  text,
  delay,
  className,
  id,
  as: Tag = "h1",
  assemble = ASSEMBLE,
  replayOnHover = true,
}: {
  text: string;
  /** Seconds before the letters start, to follow the page's own entrance. */
  delay: number;
  className?: string;
  id?: string;
  as?: "h1" | "p";
  /** Seconds for the slowest letter to land. */
  assemble?: number;
  replayOnHover?: boolean;
}) {
  const title = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);
  const letters = [...text];

  useEffect(() => {
    const el = title.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const spans = Array.from(el.querySelectorAll<HTMLElement>("[data-letter]"));
    const jit = scatter(spans.length);
    // Sizes in the package are for 678px-wide type; scale them to this title.
    const unit = () => el.getBoundingClientRect().height / 100;
    let frame = 0;
    let started = 0;
    let running = false;

    const paint = (p: number) => {
      const u = unit();
      spans.forEach((span, i) => {
        const [jx, jy, late] = jit[i];
        const a = easeOut(clamp(p * 1.5 - late * 0.5, 0, 1));
        const sep = (1 - a) * 11 * u;
        span.style.transform = `translate(${(jx * 62 * u * (1 - a)).toFixed(1)}px, ${(jy * 34 * u * (1 - a)).toFixed(1)}px) scale(${(1.24 + (1 - 1.24) * a).toFixed(3)})`;
        span.style.opacity = String(Math.min(1, a * 1.6));
        span.style.textShadow =
          sep > 0.4
            ? `${(-sep).toFixed(1)}px 0 rgb(255 64 72 / 0.85), ${sep.toFixed(1)}px 0 rgb(64 255 190 / 0.8), 0 ${(sep * 0.55).toFixed(1)}px rgb(96 124 255 / 0.8)`
            : "";
        span.style.filter = sep > 0.7 ? `blur(${(sep * 0.3).toFixed(2)}px)` : "";
      });
    };
    const tick = (now: number) => {
      const p = clamp((now - started) / 1000 / assemble, 0, 1);
      paint(p);
      if (p < 1) frame = requestAnimationFrame(tick);
      else running = false;
    };
    const play = (after = 0) => {
      if (running) return;
      running = true;
      paint(0);
      started = performance.now() + after * 1000;
      frame = requestAnimationFrame(tick);
    };
    const replay = (e: PointerEvent) => e.pointerType === "mouse" && play();

    play(delay);
    if (replayOnHover) el.addEventListener("pointerenter", replay);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointerenter", replay);
    };
  }, [delay, assemble, replayOnHover]);

  return (
    <Tag ref={title} id={id} aria-label={text} className={className}>
      {letters.map((ch, i) => (
        <span
          key={i}
          data-letter
          aria-hidden
          className="inline-block will-change-[transform,opacity,filter] motion-safe:opacity-0"
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </Tag>
  );
}
