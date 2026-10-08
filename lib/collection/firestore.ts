"use client";

import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  increment,
  onSnapshot,
  orderBy,
  runTransaction,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Firestore,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes, type FirebaseStorage } from "firebase/storage";
import type { User } from "firebase/auth";
import type { UsageLog, UserFragrance } from "@/types";
import { dayKey } from "@/lib/recommendation/today";
import type { CollectionRepo } from "./types";
import { usageAfterUndo } from "./undo";

const USAGE_WINDOW_MS = 120 * 86_400_000;

/** Firestore rejects `undefined`; drop those keys before writing. */
function clean<T extends object>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as T;
}

/** Keeps users/{uid} to what Google gives us (architecture §4.2: minimal personal data). */
export async function saveProfile(db: Firestore, user: User): Promise<void> {
  const profile = doc(db, "users", user.uid);
  const now = Date.now();
  const existing = await getDoc(profile);
  await setDoc(
    profile,
    clean({
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      lastLoginAt: now,
      createdAt: existing.exists() ? undefined : now,
    }),
    { merge: true },
  );
}

export function createAccountRepo(db: Firestore, store: FirebaseStorage | null, uid: string): CollectionRepo {
  const fragrances = collection(db, "users", uid, "fragrances");
  const usageLogs = collection(db, "users", uid, "usageLogs");
  const coverRef = (id: string) => (store ? ref(store, `users/${uid}/fragrances/${id}/cover.webp`) : null);

  async function uploadCover(id: string, image: Blob): Promise<string | undefined> {
    const target = coverRef(id);
    if (!target) return undefined;
    await uploadBytes(target, image, { contentType: "image/webp" });
    return getDownloadURL(target);
  }

  async function removeCover(id: string) {
    const target = coverRef(id);
    if (!target) return;
    try {
      await deleteObject(target);
    } catch (error) {
      if ((error as { code?: string }).code !== "storage/object-not-found") throw error;
    }
  }

  // Today's 重新開始, shared by every device signed in to this account.
  const ritual = doc(db, "users", uid, "state", "ritual");
  const cabinet = doc(db, "users", uid, "state", "cabinet");

  return {
    kind: "account",

    subscribeRestart(onRestart, onError) {
      return onSnapshot(
        ritual,
        (snap) => {
          const at = snap.get("restartedAt") as unknown;
          onRestart(typeof at === "number" && dayKey(at) === dayKey(Date.now()) ? at : undefined);
        },
        onError,
      );
    },

    async markRestarted(at) {
      await setDoc(ritual, { restartedAt: at }, { merge: true });
    },

    subscribeHiddenShelves(onKeys, onError) {
      return onSnapshot(
        cabinet,
        (snap) => {
          const keys = snap.get("hiddenShelves") as unknown;
          onKeys(Array.isArray(keys) ? keys.filter((k): k is string => typeof k === "string") : []);
        },
        onError,
      );
    },

    async setHiddenShelves(keys) {
      await setDoc(cabinet, { hiddenShelves: [...keys] }, { merge: true });
    },
    supportsImages: !!store,

    subscribe(onItems, onError) {
      return onSnapshot(
        query(fragrances, orderBy("addedAt", "desc")),
        (snap) => onItems(snap.docs.map((d) => ({ ...(d.data() as UserFragrance), id: d.id }))),
        onError,
      );
    },

    subscribeUsage(onLogs, onError) {
      return onSnapshot(
        query(usageLogs, where("timestamp", ">=", Date.now() - USAGE_WINDOW_MS), orderBy("timestamp", "asc")),
        (snap) => onLogs(snap.docs.map((d) => ({ ...(d.data() as UsageLog), id: d.id }))),
        onError,
      );
    },

    async add(draft, options) {
      const target = options?.id ? doc(fragrances, options.id) : doc(fragrances);
      const now = Date.now();
      const imageUrl = options?.image ? await uploadCover(target.id, options.image) : draft.imageUrl;
      const imageSource = options?.image ? undefined : draft.imageSource;
      const item: UserFragrance = {
        ...draft,
        id: target.id,
        origin: draft.origin ?? "manual",
        imageUrl,
        imageSource,
        createdAt: now,
        addedAt: now,
        usageCount: 0,
      };
      await setDoc(target, clean({ ...item, updatedAt: serverTimestamp() }));
      return item;
    },

    async update(id, patch, options) {
      let imageUrl = patch.imageUrl;
      if (options?.image) imageUrl = await uploadCover(id, options.image);
      if (options?.image === null) {
        // Like remove(): clearing the picture never waits on Storage.
        removeCover(id).catch((error: unknown) => console.error("[collection] photo not removed", error));
        imageUrl = undefined;
      }
      const data: Record<string, unknown> = clean({ ...patch, imageUrl, updatedAt: serverTimestamp() });
      if (options?.image === null) data.imageUrl = null;
      // A member's own photo, or none, replaces the official picture and its credit.
      if (options?.image !== undefined) data.imageSource = null;
      await updateDoc(doc(fragrances, id), data);
    },

    async remove(id) {
      const target = doc(fragrances, id);
      const imageUrl = (await getDoc(target)).data()?.imageUrl as string | undefined;
      // The scent goes first: removing it must never wait on Storage. Projects
      // without a Storage bucket (no Blaze plan) used to retry the photo delete
      // for minutes and then fail the whole removal (An, 2026-10-06).
      // Usage logs stay, matched by fragranceId (architecture §7).
      await deleteDoc(target);
      // Only our own uploads live in Storage; brand pictures are just links.
      if (imageUrl?.includes("firebasestorage")) {
        removeCover(id).catch((error: unknown) => console.error("[collection] photo not removed", error));
      }
    },

    async logUsage(entry) {
      const logRef = doc(usageLogs);
      const log: UsageLog = { ...entry, id: logRef.id, timestamp: Date.now() };
      const batch = writeBatch(db);
      batch.set(logRef, clean(log));
      const owned = await getDoc(doc(fragrances, entry.fragranceId));
      if (owned.exists()) {
        batch.update(owned.ref, { usageCount: increment(1), lastUsedAt: log.timestamp });
      }
      await batch.commit();
      return log;
    },

    async undoUsage(logs, usage) {
      if (!logs.length) return;
      // In a transaction, counting only logs that still exist: two devices taking back the
      // same wears (a restart seen on both) lower each count once.
      await runTransaction(db, async (tx) => {
        const present = [];
        for (const l of logs) if ((await tx.get(doc(usageLogs, l.id))).exists()) present.push(l);
        if (!present.length) return;
        const after = usageAfterUndo(present, usage);
        const owned = new Map<string, boolean>();
        for (const id of after.keys()) owned.set(id, (await tx.get(doc(fragrances, id))).exists());
        for (const l of present) tx.delete(doc(usageLogs, l.id));
        for (const [fragranceId, e] of after) {
          if (!owned.get(fragranceId)) continue;
          tx.update(doc(fragrances, fragranceId), {
            usageCount: increment(-e.count),
            lastUsedAt: e.lastUsedAt ?? deleteField(),
          });
        }
      });
    },
  };
}
