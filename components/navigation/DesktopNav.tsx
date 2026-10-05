"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS, isActive } from "@/lib/navigation";
import { cn } from "@/lib/cn";
import { NefertemLogo } from "@/components/brand/NefertemLogo";

/**
 * Tablet / desktop editorial masthead: wordmark left, three labels right,
 * generous emptiness between. Condenses after the first scroll.
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
          ? "h-16 border-b border-line bg-surface"
          : "h-[var(--nav-desktop-height)] border-b border-transparent bg-transparent",
      )}
    >
      <NefertemLogo
        size={condensed ? "sm" : "md"}
        withTagline={!condensed}
        className="transition-all duration-500"
      />
      <nav aria-label="主要導覽">
        <ul className="flex items-center gap-10 desk:gap-14">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item, pathname);
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "label gold-underline transition-colors duration-300",
                    active ? "text-blue" : "text-ink/70 hover:text-ink",
                  )}
                >
                  {item.labelEnShort}
                  <span className="sr-only">（{item.labelZh}）</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
