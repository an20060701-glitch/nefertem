"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { showsSections } from "@/lib/navigation";
import { cn } from "@/lib/cn";
import { NefertemLogo } from "@/components/brand/NefertemLogo";
import { GlassDock } from "./GlassDock";

/**
 * Tablet / desktop editorial masthead: wordmark left, the three sections right in a
 * glass dock, generous emptiness between. Condenses after the first scroll.
 */
export function DesktopNav() {
  const pathname = usePathname();
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "page-x fixed inset-x-0 top-0 z-50 hidden items-center justify-between transition-[height,background-color,border-color] duration-500 ease-[var(--ease-editorial)] md:flex",
        condensed
          ? "material-bar h-16 border-b border-line"
          : "h-[var(--nav-desktop-height)] border-b border-transparent bg-transparent",
      )}
    >
      <NefertemLogo
        size={condensed ? "sm" : "md"}
        withTagline={!condensed}
        // Larger at desktop width while the masthead is open (An, 2026-10-06).
        className={cn("transition-all duration-500", !condensed && "desk:text-[2.25rem]")}
      />
      {/* The sections as a clear-glass dock (An, 2026-10-08). */}
      <div hidden={!showsSections(pathname)}>
        <GlassDock pathname={pathname} />
      </div>
    </header>
  );
}
