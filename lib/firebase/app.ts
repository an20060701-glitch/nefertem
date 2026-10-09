"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { firebaseConfig, isFirebaseConfigured } from "./config";

/*
 * The app and Auth only. Every page needs to know who is signed in, so this
 * loads up front; Firestore and Storage (lib/firebase/client.ts) are much
 * larger and load on demand, only for members.
 */

export function firebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function firebaseAuth(): Auth | null {
  const a = firebaseApp();
  return a ? getAuth(a) : null;
}
