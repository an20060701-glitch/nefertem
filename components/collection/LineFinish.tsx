"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { afterSignIn, loginHref, safeNext } from "@/lib/account";
import { signInWithLineToken } from "@/lib/firebase/auth";
import { useCollection } from "./CollectionProvider";

/** Last leg of the server-side LINE sign-in: trade the token in the URL fragment for a Firebase session. */
export function LineFinish() {
  const router = useRouter();
  const started = useRef(false);
  const [failed, setFailed] = useState<string>();
  const [signedIn, setSignedIn] = useState<string>();
  const { user, ready, items, error: cabinetError } = useCollection();

  // Signed in: once the cabinet has loaded, go where it says (see afterSignIn).
  useEffect(() => {
    if (signedIn !== undefined && user && (ready || cabinetError))
      router.replace(ready ? afterSignIn(signedIn, items.length > 0) : signedIn);
  }, [signedIn, user, ready, cabinetError, items.length, router]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get("token");
    const next = safeNext(params.get("next"));
    // Keep the token out of history and screenshots.
    window.history.replaceState(null, "", window.location.pathname);
    (token
      ? signInWithLineToken(token, params.get("name") ?? undefined)
      : Promise.reject(new Error("no token"))
    )
      .then(() => setSignedIn(next))
      .catch((error: unknown) => {
        console.error("[sign-in] line token failed", error);
        setFailed(next);
      });
  }, [router]);

  return failed ? (
    <div className="flex flex-col items-center gap-6">
      <p role="alert" className="font-serif-zh text-h2 text-ink">
        LINE 登入沒有完成。
      </p>
      <ButtonLink href={loginHref(failed)}>再試一次</ButtonLink>
    </div>
  ) : (
    <p className="label text-muted" aria-live="polite">
      正在以 LINE 進入…
    </p>
  );
}
