"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { NAV_ITEMS, isActive } from "@/lib/navigation";

/**
 * The three sections as a clear-glass dock (An, 2026-10-08, after ThreeUI's AnimatedTopDock
 * "glass"): a frosted rail whose items swell and sink a little as the pointer comes near, on
 * a spring. Tuned with An's values: proximity 44, heightGrowth 20, drop 11. ThreeUI's own
 * component can't be used as is: its items, wordmark and dark particle scene are a fixed demo.
 */
const DOCK = { proximity: 44, heightGrowth: 20, drop: 11, spring: 0.19, damping: 0.7 };

export function GlassDock({ pathname }: { pathname: string }) {
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    const host = nav.current;
    if (!host) return;
    const calm = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const items = Array.from(host.querySelectorAll<HTMLElement>("[data-dock-item]")).map((el) => ({
      el,
      value: 0,
      velocity: 0,
      target: 0,
    }));
    let frame = 0;

    const apply = () => {
      for (const it of items) {
        const v = Math.min(Math.max(it.value, 0), 1.08);
        it.el.style.setProperty("--dock-grow", `${(DOCK.heightGrowth * v).toFixed(2)}px`);
        it.el.style.transform = `translateY(${(DOCK.drop * v).toFixed(2)}px)`;
        it.el.dataset.near = it.target > 0.08 ? "true" : "false";
      }
    };
    const tick = () => {
      let moving = false;
      for (const it of items) {
        it.velocity = (it.velocity + (it.target - it.value) * DOCK.spring) * DOCK.damping;
        it.value += it.velocity;
        if (Math.abs(it.target - it.value) < 1e-3 && Math.abs(it.velocity) < 1e-3) {
          it.value = it.target;
          it.velocity = 0;
        } else moving = true;
      }
      apply();
      frame = moving ? requestAnimationFrame(tick) : 0;
    };
    const run = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const live = () => fine.matches && !calm.matches;

    // Nearness along the dock, eased (smoothstep), like ThreeUI's controller.
    const onMove = (e: PointerEvent) => {
      if (!live()) return;
      for (const it of items) {
        const r = it.el.getBoundingClientRect();
        const edge = Math.max(0, Math.abs(e.clientX - (r.left + r.width / 2)) - r.width / 2);
        const x = Math.min(Math.max(1 - edge / DOCK.proximity, 0), 1);
        it.target = x * x * (3 - 2 * x);
      }
      run();
    };
    const rest = () => {
      for (const it of items) it.target = 0;
      run();
    };
    const onFocus = (e: FocusEvent) => {
      if (!live()) return;
      const i = items.findIndex((it) => it.el === (e.target as HTMLElement).closest("[data-dock-item]"));
      items.forEach((it, j) => (it.target = j === i ? 1 : Math.abs(j - i) === 1 ? 0.24 : 0));
      run();
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", rest);
    host.addEventListener("focusin", onFocus);
    host.addEventListener("focusout", rest);
    return () => {
      cancelAnimationFrame(frame);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", rest);
      host.removeEventListener("focusin", onFocus);
      host.removeEventListener("focusout", rest);
    };
  }, []);

  return (
    <nav
      ref={nav}
      aria-label="主要導覽"
      // Frosted glass rail: bright top edge, faint inner line, soft lift off the page.
      className="relative flex h-[3.25rem] items-start gap-1.5 rounded-full border border-white/70 bg-white/30 p-1.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.9),inset_0_-1px_0_rgb(24_59_104/0.06),0_18px_40px_-22px_rgb(24_59_104/0.45)] backdrop-blur-xl backdrop-saturate-[1.9] before:pointer-events-none before:absolute before:inset-0 before:rounded-full before:bg-[linear-gradient(168deg,rgb(255_255_255/0.5),transparent_30%_76%,rgb(255_255_255/0.3))]"
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item, pathname);
        return (
          <Link
            key={item.key}
            href={item.href}
            data-dock-item
            aria-current={active ? "page" : undefined}
            className={cn(
              "label relative inline-flex h-[calc(2.5rem+var(--dock-grow,0px))] items-center rounded-full border px-5 outline-none transition-[color,background-color,border-color,box-shadow] duration-200 will-change-transform",
              active
                ? "border-white/90 bg-[linear-gradient(180deg,#fff,#eef0f7)] text-blue shadow-[0_10px_24px_-14px_rgb(24_59_104/0.55),inset_0_-1px_0_rgb(0_0_0/0.06)]"
                : "border-transparent text-ink/70 hover:text-ink data-[near=true]:border-white/60 data-[near=true]:bg-white/40 data-[near=true]:text-ink data-[near=true]:shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_8px_18px_-12px_rgb(24_59_104/0.4)] focus-visible:border-white/60 focus-visible:bg-white/40",
            )}
          >
            {item.labelEnShort}
            <span className="sr-only">（{item.labelZh}）</span>
          </Link>
        );
      })}
    </nav>
  );
}
