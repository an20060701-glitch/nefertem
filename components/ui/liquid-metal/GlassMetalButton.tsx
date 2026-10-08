"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { LIQUID_METAL_HTML } from "./liquid-metal.html";

/**
 * A clear-glass button with ThreeUI's moving liquid-metal rim (An, 2026-10-08: 「我想要透明玻璃
 * 的感覺」). The shader page runs in a sandboxed iframe with its black stage, plate and label
 * taken away, so only the light on the rim is drawn, over a frosted-glass pill set by the page.
 * The label and the click target are ordinary page elements (site fonts, Chinese, keyboard);
 * the pointer is forwarded to the shader so the metal still follows the cursor and ripples.
 */

const GLASS_CSS = `
  html,body{background:transparent!important}
  .plate{background:transparent!important;box-shadow:none!important}
  .btn{pointer-events:none}
  .btn .lbl,.btn .ico{visibility:hidden}
</style>`;

// Runs inside the shader's own scope, so it can steer its pointer, hover and press state.
const BRIDGE = `window.__seek   = v => { clock = v; drawn = null; };
window.addEventListener('message', ev => {
  if(ev.source !== parent) return;
  const c = ev.data && ev.data.glassMetal;
  if(!c) return;
  if(c.size){
    stage.style.setProperty('--h', c.size.h + 'px');
    stage.style.setProperty('--bw', c.size.w + 'px');
    needResize = true; drawn = null;
  }
  if(typeof c.x === 'number'){
    ptr.x = c.x; ptr.y = c.y;
    if(c.enter){ ptrS.x = c.x; ptrS.y = c.y; ptrSpeed = 0; }
  }
  if(typeof c.over === 'boolean'){ on.over = c.over; sync(); }
  if(typeof c.focus === 'boolean'){ on.focus = c.focus; sync(); }
  if(typeof c.press === 'boolean'){ on.press = c.press; sync(); if(c.press) addRipple(ptr.x, ptr.y); }
});
parent.postMessage({ glassMetal: 'ready' }, '*');`;

const PAGE = LIQUID_METAL_HTML.replace(/<link[^>]*>\n?/g, "") // no Google Fonts: the label is ours
  .replace("</style>", GLASS_CSS)
  .replace("window.__seek   = v => { clock = v; drawn = null; };", BRIDGE);

/** The stage keeps a margin of 900/516 of the button's height round it for the glow. */
const MARGIN = 900 / 516;

type Common = {
  children: React.ReactNode;
  /** "circle" makes a round button as wide as it is tall. */
  shape?: "pill" | "circle";
  className?: string;
  "aria-label"?: string;
};

type Props = Common & ({ href: string; onClick?: never } | { onClick: () => void; href?: never });

export function GlassMetalButton({ children, shape = "pill", className, href, onClick, ...aria }: Props) {
  const box = useRef<HTMLSpanElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [size, setSize] = useState<{ w: number; h: number }>();
  const [inView, setInView] = useState(false);

  // Follow the button's size, and only run the shader while it is on screen.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.offsetWidth, h: el.offsetHeight }));
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "80px" });
    ro.observe(el);
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  const post = (msg: Record<string, unknown>) =>
    frame.current?.contentWindow?.postMessage({ glassMetal: msg }, "*");

  /** The pointer in the shader's units: button heights from the centre, y down. */
  const at = (e: React.PointerEvent, extra: Record<string, unknown> = {}) => {
    const r = e.currentTarget.getBoundingClientRect();
    post({
      x: (e.clientX - (r.left + r.width / 2)) / r.height,
      y: (e.clientY - (r.top + r.height / 2)) / r.height,
      ...extra,
    });
  };

  const handlers = {
    onPointerEnter: (e: React.PointerEvent) =>
      e.pointerType === "mouse" && at(e, { over: true, enter: true }),
    onPointerMove: (e: React.PointerEvent) => at(e),
    onPointerLeave: (e: React.PointerEvent) => e.pointerType === "mouse" && post({ over: false }),
    onPointerDown: (e: React.PointerEvent) => at(e, { press: true, enter: e.pointerType !== "mouse" }),
    onPointerUp: () => post({ press: false }),
    onPointerCancel: () => post({ press: false }),
    onFocus: (e: React.FocusEvent) => post({ focus: e.currentTarget.matches(":focus-visible") }),
    onBlur: () => post({ focus: false }),
  };

  const face = cn(
    "label relative z-[2] inline-flex h-14 items-center justify-center gap-3 rounded-full text-blue outline-offset-4",
    shape === "circle" ? "w-14" : "px-9",
  );

  return (
    <span ref={box} className={cn("relative inline-flex w-fit rounded-full", className)}>
      {/* Clear glass: a thin bright edge, a frosted body and a soft lift off the page. */}
      <span
        aria-hidden
        className="absolute inset-0 z-0 rounded-full border border-white/70 bg-white/25 shadow-[inset_0_1px_0_rgb(255_255_255/0.9),inset_0_-10px_18px_-12px_rgb(24_59_104/0.18),0_14px_30px_-16px_rgb(24_59_104/0.45)] backdrop-blur-md backdrop-saturate-150"
      />
      {inView && size && <Rim ref={frame} size={size} />}
      {href ? (
        <Link href={href} className={face} {...handlers} {...aria}>
          {children}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className={face} {...handlers} {...aria}>
          {children}
        </button>
      )}
    </span>
  );
}

/** The shader frame, mounted only while on screen; it fades in once the page reports ready. */
function Rim({
  ref,
  size,
}: {
  ref: React.RefObject<HTMLIFrameElement | null>;
  size: { w: number; h: number };
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source === ref.current?.contentWindow && e.data?.glassMetal === "ready") setReady(true);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [ref]);
  useEffect(() => {
    if (ready) ref.current?.contentWindow?.postMessage({ glassMetal: { size } }, "*");
  }, [ready, size, ref]);

  const pad = size.h * MARGIN;
  return (
    <iframe
      ref={ref}
      title=""
      aria-hidden
      tabIndex={-1}
      srcDoc={PAGE}
      sandbox="allow-scripts"
      className={cn(
        "pointer-events-none absolute z-[1] max-w-none border-0 bg-transparent transition-opacity duration-500",
        ready ? "opacity-100" : "opacity-0",
      )}
      style={{ left: -pad, top: -pad, width: size.w + 2 * pad, height: size.h + 2 * pad }}
    />
  );
}
