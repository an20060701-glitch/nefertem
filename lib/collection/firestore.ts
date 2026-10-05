"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  increment,
  onSnapshot,
  orderBy,
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
import type { CollectionRepo } from "./types";

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

  return {
    kind: "account",
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
      const item: UserFragrance = {
        ...draft,
        id: target.id,
        origin: draft.origin ?? "manual",
        imageUrl,
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
        await removeCover(id);
        imageUrl = undefined;
      }
      const data: Record<string, unknown> = clean({ ...patch, imageUrl, updatedAt: serverTimestamp() });
      if (options?.image === null) data.imageUrl = null;
      await updateDoc(doc(fragrances, id), data);
    },

    async remove(id) {
      await removeCover(id);
      // Usage logs stay, matched by fragranceId (architecture §7).
      await deleteDoc(doc(fragrances, id));
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
  };
}
