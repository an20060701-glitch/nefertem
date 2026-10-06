/**
 * The cover's watercolour ground. Pre-rendered from scripts/watercolor/wash.html
 * (landscape for tablet and up, portrait for phones), so nothing is filtered at
 * runtime. It reaches up under the mobile top bar and dissolves into the page
 * colour at the bottom, where Today's Choice begins on ivory.
 */
export function CoverWash() {
  return (
    <div
      aria-hidden
      className="cover-wash pointer-events-none absolute inset-x-0 -top-16 bottom-0 -z-10 bg-[url(/images/cover-wash-portrait.webp)] bg-cover bg-[position:right_top] md:top-0 md:bg-[url(/images/cover-wash-landscape.webp)] md:bg-[position:right_bottom]"
    />
  );
}
