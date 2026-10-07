"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { loginHref } from "@/lib/account";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { useCollection } from "./CollectionProvider";

/**
 * The three sections open after sign-in (An, 2026-10-06). Without Firebase
 * configured there is no way to sign in, so the gate stays open for local work.
 */
export function AccountGate({ children }: { children: React.ReactNode }) {
  const { user } = useCollection();
  const pathname = usePathname();
  const router = useRouter();
  const locked = isFirebaseConfigured && !user;

  useEffect(() => {
    if (isFirebaseConfigured && user === null) router.replace(loginHref(pathname));
  }, [user, pathname, router]);

  if (!locked) return children;
  return (
    <div className="page-x flex min-h-[70svh] items-center md:pt-[var(--nav-desktop-height)]" aria-live="polite">
      <p className="label text-muted">{user === undefined ? "正在確認你的身分…" : "請先登入…"}</p>
    </div>
  );
}
