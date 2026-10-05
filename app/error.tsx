"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="page-x flex min-h-[70svh] items-center justify-center md:pt-[var(--nav-desktop-height)]">
      <EmptyState
        title="暫時無法載入這一頁。"
        description="請稍後再試一次。"
        action={
          <Button variant="text" onClick={() => retry()}>
            TRY AGAIN →
          </Button>
        }
      />
    </section>
  );
}
