/**
 * Printed-paper grain over the whole site (design system §3.4).
 * A static SVG noise tile — rendered once by the browser, no per-frame cost.
 * The tile is black with varying alpha, so plain blending already darkens the
 * paper exactly as multiply would; no blend mode, which made the browser
 * re-blend the whole screen on every scroll and animation frame.
 */
const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{ backgroundImage: NOISE, opacity: 0.035 }}
    />
  );
}
