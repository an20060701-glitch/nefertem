"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { NAV_ITEMS, isActive, showsSections } from "@/lib/navigation";
import { cn } from "@/lib/cn";
import { transition } from "@/lib/motion";
import { NavIcon } from "./NavIcons";

/**
 * Mobile / app-like bottom bar (design system §6.3).
 * Translucent ivory with a light blur; the active item is marked by a gold
 * dot that glides between tabs — never a coloured tab background.
 */
export function BottomNavigation() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  if (!showsSections(pathname)) return null;

  return (
    <nav
      aria-label="主要導覽"
      className="fixed inset-x-0 bottom-0 z-50 material-bar border-t border-line md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid h-[var(--nav-mobile-height)] max-w-md grid-cols-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item, pathname);
          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "press flex h-full flex-col items-center justify-center gap-1",
                  active ? "text-lotus-deep" : "text-muted hover:text-ink",
                )}
              >
                <NavIcon name={item.key} size={24} />
                <span className="text-[0.75rem] leading-none tracking-[0.08em]">{item.labelZh}</span>
                <span className="text-[0.5625rem] font-medium leading-none tracking-[0.16em] opacity-70">
                  {item.labelEn}
                </span>
                <span className="relative mt-0.5 h-1 w-1">
                  {active ? (
                    <motion.span
                      layoutId="bottom-nav-dot"
                      className="absolute inset-0 rounded-full bg-gold"
                      transition={reduce ? { duration: 0 } : transition.base}
                    />
                  ) : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
