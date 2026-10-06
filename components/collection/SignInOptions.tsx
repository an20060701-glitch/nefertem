"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { signInWithGoogle, signInWithLine } from "@/lib/firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { useCollection } from "./CollectionProvider";

type Provider = "google" | "line";

const SIGN_IN: Record<Provider, () => Promise<unknown>> = {
  google: signInWithGoogle,
  line: signInWithLine,
};

/** Google or LINE; once signed in (popup or redirect), go on to `next`. */
export function SignInOptions({ next }: { next: string }) {
  const router = useRouter();
  const { user } = useCollection();
  const [pending, setPending] = useState<Provider>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  async function signIn(provider: Provider) {
    setPending(provider);
    setError(undefined);
    try {
      await SIGN_IN[provider]();
      // Navigation follows from the auth state change above.
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      setError(
        provider === "line" && (code === "auth/operation-not-allowed" || code === "auth/invalid-provider-id")
          ? "LINE 登入尚未開通，請先使用 Google 帳號。"
          : "登入沒有完成，請再試一次。",
      );
    } finally {
      setPending(undefined);
    }
  }

  if (user) return <p className="label text-muted">正在進入今天的儀式…</p>;

  return (
    <div className="flex flex-col items-stretch gap-4">
      <Button
        onClick={() => signIn("google")}
        disabled={!isFirebaseConfigured || !!pending}
        aria-busy={pending === "google"}
      >
        {pending === "google" ? "CONNECTING…" : "CONTINUE WITH GOOGLE"}
      </Button>
      <Button
        variant="ghost"
        onClick={() => signIn("line")}
        disabled={!isFirebaseConfigured || !!pending}
        aria-busy={pending === "line"}
      >
        {pending === "line" ? "CONNECTING…" : "CONTINUE WITH LINE"}
      </Button>
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
