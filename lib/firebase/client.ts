"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { firebaseConfig, isFirebaseConfigured } from "./config";

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
  return a ? getFirestore(a) : null;
}

export function storage(): FirebaseStorage | null {
  const a = app();
  return a ? getStorage(a) : null;
}
