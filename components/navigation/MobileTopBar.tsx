import { NefertemLogo } from "@/components/brand/NefertemLogo";

/** Quiet wordmark at the top of mobile pages; scrolls away with content. */
export function MobileTopBar() {
  return (
    <header
      className="page-x flex h-16 items-center md:hidden"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <NefertemLogo size="sm" />
    </header>
  );
}
