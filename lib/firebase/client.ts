"use client";

import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { firebaseApp as app } from "./app";
import { firestoreDatabaseId } from "./config";

/*
 * Firestore and Storage, imported dynamically (CollectionProvider) so they stay
 * out of every page's first download; a missing config degrades to `null`.
 */

export function firestore(): Firestore | null {
  const a = app();
  if (!a) return null;
  return firestoreDatabaseId ? getFirestore(a, firestoreDatabaseId) : getFirestore(a);
}

/**
 * Member photo uploads need a Cloud Storage bucket, which needs the Blaze plan.
 * Off until NEXT_PUBLIC_FIREBASE_STORAGE_ENABLED=true (An, 2026-10-06: hide uploads for now);
 * without it the forms show the official picture or the bottle line drawing.
 */
export function storage(): FirebaseStorage | null {
  if (process.env.NEXT_PUBLIC_FIREBASE_STORAGE_ENABLED !== "true") return null;
  const a = app();
  if (!a) return null;
  const store = getStorage(a);
  // Fail within seconds rather than minutes when Storage is missing or unreachable.
  store.maxOperationRetryTime = 15_000;
  store.maxUploadRetryTime = 30_000;
  return store;
}
