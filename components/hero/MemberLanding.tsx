"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCollection } from "@/components/collection/CollectionProvider";
import { afterOpening } from "@/lib/account";

/** Decided once per page load: pages opened from inside the site afterwards are kept. */
let landed = false;

/** The path this document was opened (or reloaded) at. */
function openedAt(): string | undefined {
  const entry = performance.getEntriesByType("navigation")[0];
  return entry && new URL(entry.name).pathname;
}

/**
 * Opening the site signed in, reloading any page or reopening a closed tab (An, 2026-10-11)
 * lands on 香水選擇; a member whose cabinet is still empty (a new account) lands on
 * 我的香水櫃 instead (see afterOpening). Guests are left where they are.
 */
export function MemberLanding() {
  const router = useRouter();
  const { user, ready, items, error } = useCollection();

  useEffect(() => {
    if (landed || user === undefined) return;
    if (!user) {
      landed = true;
      return;
    }
    if (!ready && !error) return;
    landed = true;
    const opened = openedAt();
    // Only while the visitor is still on the page that was opened.
    if (!opened || opened !== window.location.pathname) return;
    const target = afterOpening(opened, ready ? items.length > 0 : true);
    if (target) router.replace(target);
  }, [user, ready, error, items.length, router]);

  return null;
}
