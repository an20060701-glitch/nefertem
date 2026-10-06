"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { firebaseConfig, firestoreDatabaseId, isFirebaseConfigured } from "./config";

/*
 * Lazily initialised so pages that never touch Firebase don't pay for it,
 * and so a missing config degrades to `null` instead of throwing.
 */

function app(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function firebaseAuth(): Auth | null {
  const a = app();
  return a ? getAuth(a) : null;
}

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
  return a ? getStorage(a) : null;
}
