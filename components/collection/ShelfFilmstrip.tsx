"use client";

import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FragranceVisual } from "@/components/fragrance/FragranceVisual";
import { GlassMetalButton } from "@/components/ui/liquid-metal/GlassMetalButton";
import { modalKeyDown, useModal } from "@/hooks/useModal";
import { ease } from "@/lib/motion";
import type { UserFragrance } from "@/types";
import type { Shelf } from "./CabinetShelves";

/**
 * One shelf's scents in a small window, as a moving filmstrip (An, 2026-10-08, after ThreeUI's
 * CharacterCarousel "filmstrip"; its motion is ported here, MIT, since the package's own
 * version only shows its fixed demo portraits). Cards fan out in depth round the one in
 * focus, step on their own when left alone, and turn with the glass arrow buttons at either
 * side, the wheel, the arrow keys, a swipe or a tap; the card in focus opens that scent's page.
 */
/** The strip turns 1.7 times as fast as the package's (An, 2026-10-08). */
const SPEED = 1.7;
/** Left alone this long after a touch, the strip starts drifting again (ms). */
const REST = 3600;
/** On opening it starts drifting almost at once (An: it sat still for 5–6 s). */
const OPENING_REST = 300;
/** After the mouse leaves the strip, it drifts again sooner (An, 2026-10-08). */
const LEAVE_REST = 1500;
/** How long each card rests in front while the strip steps on its own (ms). */
const HOLD = 500;
/** How long one card takes to turn to the front while stepping on its own (ms). */
const TURN = 1300 / SPEED;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Extra room between the front card and the cards beside it, in card steps (desktop). */
const GAP = 0.8;

/**
 * Each card gets its own perspective and the cards are stacked by z-index, not placed in one
 * shared 3D space: in a shared space Safari lets neighbouring tilted cards cut through each other.
 */
export function ShelfFilmstrip({
  shelf,
  bottles,
  onClose,
  onList,
}: {
  shelf: Shelf;
  bottles: readonly UserFragrance[];
  onClose: () => void;
  /** Shows the shelf as the plain list on the page instead. */
  onList: () => void;
}) {
  const reduce = useReducedMotion();
  const dialog = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLAnchorElement | null)[]>([]);
  const turn = useRef<(step: number) => void>(() => undefined);
  useModal(dialog);

  const count = bottles.length;

  useEffect(() => {
    const el = stage.current;
    if (!el || count === 0) return;
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The strip goes round: after the last card comes the first again (An, 2026-10-08). Two
    // cards just take turns, so they stop at either end.
    const wraps = count >= 3;
    // Open on the first card, never between two (An, 2026-10-08: two cards opened half over
    // each other), and step on in order from there.
    const start = 0;
    const s = {
      phase: start,
      target: start,
      base: Math.round(start),
      px: 0,
      py: 0,
      active: false,
      // Idle stepping: which way the strip moves and when the card in front arrived.
      dir: 1,
      heldAt: 0,
      // The turn to the next card while stepping on its own: from, to, start time.
      tween: undefined as { from: number; to: number; at: number } | undefined,
      // Count the wait as nearly over, so the drift begins right after the window opens.
      last: performance.now() - (REST - OPENING_REST),
    };
    const clamp = (v: number) => (wraps ? v : Math.min(count - 1, Math.max(0, v)));
    const delta = (i: number, phase: number) => {
      let d = i - phase;
      if (!wraps) return d;
      while (d > count / 2) d -= count;
      while (d < -count / 2) d += count;
      return d;
    };
    const nearest = () => ((Math.round(s.phase) % count) + count) % count;
    const settle = (base: number) => {
      s.base = clamp(base);
      s.target = s.base;
      s.tween = undefined;
      s.active = false;
      s.last = performance.now();
    };
    turn.current = (step) => settle(s.base + step);
    const focusOn = (i: number) => {
      let d = i - nearest();
      if (wraps) {
        if (d > count / 2) d -= count;
        if (d < -count / 2) d += count;
      }
      settle(Math.round(s.phase) + d);
    };

    // The strip holds still while the mouse is over it. Cards are picked with the arrow
    // buttons at either side (An, 2026-10-08), no longer by pointing at them.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      s.px = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      s.py = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
      s.active = true;
      s.last = performance.now();
      el.style.setProperty("--pointer-x", `${(s.px + 1) * 50}%`);
    };
    const onLeave = () => {
      s.active = false;
      s.last = performance.now() - (REST - LEAVE_REST);
      s.px = 0;
      s.py = 0;
      s.target = s.base;
      el.style.setProperty("--pointer-x", "50%");
    };
    let wheelAt = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = performance.now();
      if (now - wheelAt < 120) return; // one card per flick, not per wheel event
      wheelAt = now;
      const dir = Math.sign(Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX);
      if (dir) settle(s.base + dir);
    };
    // A swipe on a phone turns the strip by the cards it crossed.
    let swipe: { x: number; y: number } | undefined;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") swipe = { x: e.clientX, y: e.clientY };
    };
    const onUp = (e: PointerEvent) => {
      if (!swipe) return;
      const compact = el.clientWidth < 560;
      const d = compact ? swipe.y - e.clientY : swipe.x - e.clientX;
      swipe = undefined;
      if (Math.abs(d) > 30) settle(s.base + Math.round(d / (compact ? 90 : 110)) || Math.sign(d));
    };
    const clicks = cards.current.map((card, i) => {
      const onClick = (e: MouseEvent) => {
        // Only the card in focus opens its page; the others come to the front first.
        if (i !== nearest()) {
          e.preventDefault();
          focusOn(i);
        }
      };
      const onFocus = () => focusOn(i);
      card?.addEventListener("click", onClick);
      card?.addEventListener("focus", onFocus);
      return () => {
        card?.removeEventListener("click", onClick);
        card?.removeEventListener("focus", onFocus);
      };
    });

    let prev = performance.now();
    let frame = 0;
    const render = (time: number) => {
      const dt = Math.min(32, time - prev);
      prev = time;
      const k = calm ? 1 : 1 - Math.pow(0.001, (dt * SPEED) / 1000);
      if (!calm && !s.active && time - s.last > REST && count > 1) {
        // Left alone, the strip steps card by card: each one rests in front for HOLD, then the
        // next comes in, always in order (An, 2026-10-08). Two cards just take turns.
        if (Math.abs(s.target - s.phase) < 0.01) {
          if (!s.heldAt) s.heldAt = time;
          else if (time - s.heldAt >= HOLD) {
            if (!wraps && (s.target + s.dir > count - 1 || s.target + s.dir < 0)) s.dir = -s.dir;
            s.target = Math.round(s.target) + s.dir;
            s.base = s.target;
            s.heldAt = 0;
            s.tween = { from: s.phase, to: s.target, at: time };
          }
        } else s.heldAt = 0;
      }
      if (s.tween) {
        // A whole, even turn (eased in and out), so the cards are seen swinging round rather
        // than snapping across (An, 2026-10-08: 不要犧牲轉牌的動畫).
        const t = Math.min(1, (time - s.tween.at) / TURN);
        s.phase = s.tween.from + (s.tween.to - s.tween.from) * easeInOut(t);
        if (t >= 1) s.tween = undefined;
      } else s.phase += (s.target - s.phase) * k;
      const w = el.clientWidth;
      const h = el.clientHeight;
      const compact = w < 560;
      const across = Math.min(168, Math.max(112, w * 0.17));
      const down = Math.min(122, Math.max(88, h * 0.2));
      const front = nearest();
      cards.current.forEach((card, i) => {
        if (!card) return;
        const d = delta(i, s.phase);
        const dist = Math.abs(d);
        const focus = Math.exp(-dist * dist * 1.28);
        const side = Math.max(0, 1 - dist / 5);
        const dir = Math.sign(d);
        // On desktop the cards beside the front one stand apart from it (An, 2026-10-08), so the
        // pointer has room to land on a card's middle without catching its neighbour.
        const gap = compact ? 0 : Math.min(dist, 1) * dir * across * GAP;
        const x = compact ? d * 24 + Math.sin(d * 0.9) * 25 : d * across + gap;
        const y = compact ? d * down : dist * 8 + s.py * focus * 10;
        const z = focus * 145 - dist * 148;
        const scale = 0.54 + side * 0.15 + focus * 0.54;
        const rx = compact ? d * 2.1 : -s.py * focus * 3.5;
        // Cards swing round smoothly as they leave or reach the front, with no jump at the edge.
        const swing = Math.min(1, dist / 0.6);
        const ry = compact
          ? -d * 5
          : -dir * swing * swing * (3 - 2 * swing) * (14 + Math.min(dist, 3) * 5) + s.px * focus * 3;
        const rz = compact ? d * -1.4 : d * 0.7;
        card.style.setProperty("--focus", focus.toFixed(4));
        card.style.zIndex = String(Math.round(1000 - dist * 100));
        // Fade out where the strip joins round, so a card crossing from one end to the other
        // isn't seen jumping across.
        const seam = wraps ? Math.min(1, Math.max(0, (count / 2 - dist) / 0.5)) : 1;
        card.style.opacity = String(Math.max(0.13, side * 0.76 + focus * 0.24) * seam);
        card.style.filter = `blur(${(Math.max(0, dist - 1.5) * 0.38).toFixed(2)}px)`;
        card.style.transform = `translate(-50%, -50%) perspective(1450px) translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
        card.toggleAttribute("data-front", i === front);
      });
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(frame);
      clicks.forEach((off) => off());
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
    };
  }, [count]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (step) {
      e.preventDefault();
      turn.current(step);
      return;
    }
    modalKeyDown(e, dialog.current, onClose);
  };

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/35 p-4 outline-none backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: reduce ? 0.15 : 0.35 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      // The whole overlay is the dialog, so useModal leaves it out when it makes the page inert.
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-labelledby="filmstrip-title"
      tabIndex={-1}
      onKeyDown={onKeyDown}
    >
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.97 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: reduce ? 0.2 : 0.5, ease: ease.editorial },
        }}
        exit={{ opacity: 0, y: reduce ? 0 : 16, transition: { duration: 0.25, ease: ease.editorial } }}
        className="flex h-[min(82svh,640px)] w-full max-w-[60rem] flex-col overflow-hidden rounded-[28px] bg-surface shadow-[0_40px_90px_-40px_rgb(21_21_21/0.6)]"
      >
        <div className="flex items-center justify-between gap-4 px-6 pb-3 pt-5 sm:px-8">
          <h2 id="filmstrip-title" className="font-display text-h2 font-light" style={{ color: shelf.ink }}>
            {shelf.zh}
            <span className="label ml-3 align-middle text-faint lining-nums">{count}</span>
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onList}
              className="press-soft label px-2 py-2 text-muted hover:text-ink"
            >
              列表
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="關閉"
              className="press-soft flex size-10 items-center justify-center rounded-full text-lead text-muted hover:bg-black/5 hover:text-ink"
            >
              <span aria-hidden>×</span>
            </button>
          </div>
        </div>

        <div
          ref={stage}
          aria-label={`${shelf.zh}的香水，可用方向鍵、滾輪或滑動瀏覽`}
          className="relative isolate flex-1 touch-none overflow-hidden"
          style={
            {
              "--pointer-x": "50%",
              // The filmstrip's ruled paper, tinted with the shelf's colour.
              background: `linear-gradient(90deg, rgb(80 58 31 / 0.07) 1px, transparent 1px) 50% 0 / 25% 100%,
                repeating-linear-gradient(0deg, transparent 0, transparent 109px, rgb(72 52 30 / 0.1) 110px, transparent 111px),
                radial-gradient(circle at var(--pointer-x) 48%, rgb(255 252 242 / 0.85), transparent 36%),
                color-mix(in oklab, ${shelf.color} 18%, #efebe1)`,
            } as React.CSSProperties
          }
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[4]"
            style={{
              background: `linear-gradient(90deg, color-mix(in oklab, ${shelf.color} 30%, rgb(84 58 29 / 0.2)), transparent 14%, transparent 86%, color-mix(in oklab, ${shelf.color} 30%, rgb(84 58 29 / 0.2)))`,
            }}
          />
          <div className="absolute inset-0 z-[2]">
            {bottles.map((f, i) => (
              <Link
                key={f.id}
                ref={(el) => {
                  cards.current[i] = el;
                }}
                href={`/collection/${encodeURIComponent(f.id)}`}
                aria-label={`${f.brand} ${f.nameZh ?? f.name}`}
                className="group absolute left-1/2 top-1/2 aspect-[0.72] w-[clamp(150px,22%,220px)] overflow-hidden rounded-[6px] border border-[rgb(47_34_19/0.35)] bg-[#fbf8f1] p-[7px] outline-none [--focus:0] [box-shadow:0_calc(10px+var(--focus)*24px)_calc(18px+var(--focus)*36px)_rgb(57_38_19/calc(0.18+var(--focus)*0.24)),inset_0_0_0_1px_rgb(255_255_255/0.7)] [will-change:transform,opacity,filter] focus-visible:ring-4 focus-visible:ring-gold/40 max-[560px]:w-[clamp(140px,44%,180px)]"
                style={{ transform: "translate(-50%, -50%) scale(0.6)", opacity: 0 }}
              >
                <span
                  className="absolute inset-x-[7px] bottom-[25%] top-[7px] flex items-end justify-center overflow-hidden p-3"
                  style={{
                    background: `radial-gradient(circle at 50% 38%, #fffdf8, color-mix(in oklab, ${shelf.color} 26%, #f3efe6))`,
                  }}
                >
                  <FragranceVisual
                    fragrance={f}
                    className="max-h-full object-bottom [transform:scale(calc(1.02+(1-var(--focus))*0.05))] [filter:saturate(calc(0.7+var(--focus)*0.3))]"
                  />
                </span>
                <span className="absolute inset-x-[7px] bottom-[7px] grid h-[calc(25%-7px)] grid-cols-[auto_1fr] items-center gap-2.5 bg-ink px-3 text-left">
                  <span
                    className="grid size-7 place-items-center rounded-full border font-mono text-[0.625rem] lining-nums"
                    style={{
                      borderColor: shelf.color,
                      color: `color-mix(in oklab, ${shelf.color} 70%, white)`,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.8125rem] leading-tight text-inverse">
                      {f.nameZh ?? f.name}
                    </span>
                    <span className="label mt-1 block truncate text-[0.5625rem] text-gold-light">
                      {f.brand}
                    </span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
          {/* Arrows on computers and tablets; on phones the strip is swiped (An, 2026-10-08). */}
          {count > 1 ? (
            <>
              <GlassMetalButton
                shape="circle"
                onClick={() => turn.current(-1)}
                aria-label="上一瓶"
                className="!absolute left-6 top-1/2 z-[5] -translate-y-1/2 max-[600px]:hidden"
              >
                <ChevronLeft aria-hidden className="size-5" strokeWidth={1.5} />
              </GlassMetalButton>
              <GlassMetalButton
                shape="circle"
                onClick={() => turn.current(1)}
                aria-label="下一瓶"
                className="!absolute right-6 top-1/2 z-[5] -translate-y-1/2 max-[600px]:hidden"
              >
                <ChevronRight aria-hidden className="size-5" strokeWidth={1.5} />
              </GlassMetalButton>
            </>
          ) : null}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
