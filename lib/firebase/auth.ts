"use client";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { firebaseAuth } from "./client";

export class FirebaseNotConfiguredError extends Error {
  constructor() {
    super("Firebase is not configured. Fill in NEXT_PUBLIC_FIREBASE_* in .env.local.");
    this.name = "FirebaseNotConfiguredError";
  }
}

/** Popup first; mobile browsers that block popups fall back to a redirect. */
export async function signInWithGoogle(): Promise<User | null> {
  const auth = firebaseAuth();
  if (!auth) throw new FirebaseNotConfiguredError();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw error;
  }
}

export async function signOut(): Promise<void> {
  const auth = firebaseAuth();
  if (auth) await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void): () => void {
  const auth = firebaseAuth();
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
