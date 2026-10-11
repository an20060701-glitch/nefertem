"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCollection } from "@/components/collection/CollectionProvider";
import { afterSignIn, RITUAL_HOME } from "@/lib/account";

/** Decided once per page load: coming back to the cover from inside the site keeps it. */
let landed = false;

/** Whether this document was opened (or reloaded) at the cover itself. */
function openedAtCover(): boolean {
  const entry = performance.getEntriesByType("navigation")[0];
  return !!entry && new URL(entry.name).pathname === "/";
}

/**
 * Opening the site signed in, or reloading it (An, 2026-10-11), lands on 香水選擇; a member
 * whose cabinet is still empty (a new account) lands on 我的香水櫃 instead (see afterSignIn).
 * Guests stay on the cover.
 */
export function MemberLanding() {
  const router = useRouter();
  const { user, ready, items, error } = useCollection();

  useEffect(() => {
    if (landed || user === undefined) return;
    if (!user || !openedAtCover()) {
      landed = true;
      return;
    }
    if (!ready && !error) return;
    landed = true;
    router.replace(ready ? afterSignIn(RITUAL_HOME, items.length > 0) : RITUAL_HOME);
  }, [user, ready, error, items.length, router]);

  return null;
}
