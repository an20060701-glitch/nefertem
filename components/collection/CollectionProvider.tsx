"use client";

import type { User } from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { deviceRepo } from "@/lib/collection/local";
import type { CollectionRepo } from "@/lib/collection/types";
import { onAuthChange } from "@/lib/firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import type { UsageLog, UserFragrance } from "@/types";

interface CollectionState {
  /** undefined while Firebase is still deciding who is signed in. */
  user: User | null | undefined;
  repo: CollectionRepo;
  items: UserFragrance[];
  usage: UsageLog[];
  /** True once the first snapshot of the collection has arrived. */
  ready: boolean;
  error?: string;
}

const CollectionContext = createContext<CollectionState | null>(null);

/**
 * Who is here and where their scents live: a guest's collection stays on
 * this device; a member's lives in Firestore under users/{uid}.
 */
export function CollectionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(isFirebaseConfigured ? undefined : null);
  const [accountRepo, setAccountRepo] = useState<{ uid: string; repo: CollectionRepo }>();
  const [snapshot, setSnapshot] = useState<{ kind: string; items?: UserFragrance[]; usage?: UsageLog[] }>({
    kind: "",
  });
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return onAuthChange((next) => {
      setUser(next);
      if (!next) {
        setAccountRepo(undefined);
        return;
      }
      // Firestore and the profile write load only for members.
      void Promise.all([import("@/lib/firebase/client"), import("@/lib/collection/firestore")]).then(
        async ([client, fs]) => {
          const db = client.firestore();
          if (!db) return;
          setAccountRepo({ uid: next.uid, repo: fs.createAccountRepo(db, client.storage(), next.uid) });
          try {
            await fs.saveProfile(db, next);
          } catch (e) {
            console.error("[profile]", e);
          }
        },
      );
    });
  }, []);

  const repo = user && accountRepo?.uid === user.uid ? accountRepo.repo : deviceRepo;
  const repoKey = repo === deviceRepo ? "device" : `account:${accountRepo?.uid}`;

  useEffect(() => {
    const fail = (e: unknown) => {
      console.error("[collection]", e);
      setError("暫時無法讀取你的香水櫃。");
    };
    const offItems = repo.subscribe(
      (items) => setSnapshot((s) => ({ ...(s.kind === repoKey ? s : {}), kind: repoKey, items })),
      fail,
    );
    const offUsage = repo.subscribeUsage(
      (usage) => setSnapshot((s) => ({ ...(s.kind === repoKey ? s : {}), kind: repoKey, usage })),
      fail,
    );
    return () => {
      offItems();
      offUsage();
    };
  }, [repo, repoKey]);

  const current = snapshot.kind === repoKey ? snapshot : { items: undefined, usage: undefined };
  const waitingForAccount = !!user && repo === deviceRepo;

  const value = useMemo<CollectionState>(
    () => ({
      user,
      repo,
      items: waitingForAccount ? [] : (current.items ?? []),
      usage: waitingForAccount ? [] : (current.usage ?? []),
      ready: user !== undefined && !waitingForAccount && current.items !== undefined,
      error,
    }),
    [user, repo, current.items, current.usage, waitingForAccount, error],
  );

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>;
}

export function useCollection(): CollectionState {
  const value = useContext(CollectionContext);
  if (!value) throw new Error("useCollection must be used inside <CollectionProvider>");
  return value;
}
