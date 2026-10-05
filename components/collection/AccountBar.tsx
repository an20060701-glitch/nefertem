"use client";

import Link from "next/link";
import { signOut } from "@/lib/firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { useCollection } from "./CollectionProvider";

/** Where this collection lives, in one quiet line. */
export function AccountBar() {
  const { user } = useCollection();
  if (user) {
    return (
      <p className="text-small text-muted">
        已登入 · {user.displayName ?? user.email}
        <button type="button" onClick={() => void signOut()} className="gold-underline ml-6 text-blue">
          登出
        </button>
      </p>
    );
  }
  return (
    <p className="text-small text-muted">
      目前存在這台裝置。
      {isFirebaseConfigured && (
        <Link href="/login" className="gold-underline ml-4 text-blue">
          登入後同步到雲端
        </Link>
      )}
    </p>
  );
}
