"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GlassMetalButton } from "@/components/ui/liquid-metal/GlassMetalButton";
import { afterSignIn } from "@/lib/account";
import { LINE_SERVER_LOGIN, signInWithGoogle, signInWithLine } from "@/lib/firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { useCollection } from "./CollectionProvider";

type Provider = "google" | "line";

const SIGN_IN: Record<Provider, () => Promise<unknown>> = {
  google: signInWithGoogle,
  line: signInWithLine,
};

/** Google or LINE; once signed in (popup or redirect), go on to `next`. */
export function SignInOptions({ next, lineFailed = false }: { next: string; lineFailed?: boolean }) {
  const router = useRouter();
  const { user, ready, items, error: cabinetError } = useCollection();
  const [pending, setPending] = useState<Provider>();
  const [error, setError] = useState<string | undefined>(
    lineFailed ? "LINE 登入沒有完成，請再試一次。" : undefined,
  );

  // Once signed in and the cabinet has loaded: where to go depends on whether it holds scents.
  useEffect(() => {
    // A cabinet that cannot be read does not hold the visitor here: they go on to `next`.
    if (user && (ready || cabinetError)) router.replace(ready ? afterSignIn(next, items.length > 0) : next);
  }, [user, ready, cabinetError, items.length, next, router]);

  async function signIn(provider: Provider) {
    setPending(provider);
    setError(undefined);
    if (provider === "line" && LINE_SERVER_LOGIN) {
      // A full-page trip through our server; any tab LINE returns to can finish it.
      window.location.assign(
        new URL(`/api/auth/line/start?next=${encodeURIComponent(next)}`, window.location.origin),
      );
      return;
    }
    try {
      await SIGN_IN[provider]();
      // Navigation follows from the auth state change above.
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      console.error(`[sign-in] ${provider} failed`, e);
      // While developing, show Firebase's code so a failed provider setup can be diagnosed.
      const detail = process.env.NODE_ENV !== "production" && code ? `（${code}）` : "";
      setError(
        (provider === "line" && (code === "auth/operation-not-allowed" || code === "auth/invalid-provider-id")
          ? "LINE 登入尚未開通，請先使用 Google 帳號。"
          : "登入沒有完成，請再試一次。") + detail,
      );
    } finally {
      setPending(undefined);
    }
  }

  if (user) return <p className="label text-muted">正在進入今天的儀式…</p>;

  return (
    <div className="flex flex-col items-stretch gap-4">
      {/* Clear glass with the moving liquid-metal rim, like BEGIN (An, 2026-10-08). */}
      <GlassMetalButton
        wide
        onClick={() => signIn("google")}
        disabled={!isFirebaseConfigured || !!pending}
        aria-busy={pending === "google"}
      >
        {pending === "google" ? "CONNECTING…" : "CONTINUE WITH GOOGLE"}
      </GlassMetalButton>
      <GlassMetalButton
        wide
        onClick={() => signIn("line")}
        disabled={!isFirebaseConfigured || !!pending}
        aria-busy={pending === "line"}
      >
        {pending === "line" ? "CONNECTING…" : "CONTINUE WITH LINE"}
      </GlassMetalButton>
      {!isFirebaseConfigured ? (
        <p className="text-small text-faint">會員服務尚未設定，暫時無法登入。</p>
      ) : null}
      {error ? (
        <p role="alert" className="text-small text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
