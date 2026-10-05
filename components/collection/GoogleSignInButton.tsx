"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { signInWithGoogle } from "@/lib/firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase/config";

export function GoogleSignInButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setPending(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      if (user) router.push("/collection");
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") {
        setError("登入沒有完成，請再試一次。");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-stretch gap-4">
      <Button onClick={handleClick} disabled={!isFirebaseConfigured || pending} aria-busy={pending}>
        {pending ? "CONNECTING…" : "CONTINUE WITH GOOGLE"}
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
