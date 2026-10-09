"use client";

import {
  type AuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signInWithCustomToken,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { firebaseAuth } from "./app";

export class FirebaseNotConfiguredError extends Error {
  constructor() {
    super("Firebase is not configured. Fill in NEXT_PUBLIC_FIREBASE_* in .env.local.");
    this.name = "FirebaseNotConfiguredError";
  }
}

/**
 * LINE signs in through Firebase's OpenID Connect support (Identity Platform):
 * add an OIDC provider with the LINE Login channel's ID and secret, issuer
 * https://access.line.me, and put its provider ID here (default "oidc.line").
 */
export const LINE_PROVIDER_ID = process.env.NEXT_PUBLIC_FIREBASE_LINE_PROVIDER_ID || "oidc.line";

export function signInWithGoogle(): Promise<User | null> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return signInWith(provider);
}

/** LINE through our own server (lib/line/server.ts) when NEXT_PUBLIC_LINE_LOGIN=server; otherwise Firebase OIDC. */
export const LINE_SERVER_LOGIN = process.env.NEXT_PUBLIC_LINE_LOGIN === "server";

/** Finishes a server-side LINE sign-in with the custom token it issued. */
export async function signInWithLineToken(token: string, name?: string): Promise<User> {
  const auth = firebaseAuth();
  if (!auth) throw new FirebaseNotConfiguredError();
  const { user } = await signInWithCustomToken(auth, token);
  if (name && user.displayName !== name) await updateProfile(user, { displayName: name });
  return user;
}

export function signInWithLine(): Promise<User | null> {
  const provider = new OAuthProvider(LINE_PROVIDER_ID);
  provider.addScope("openid");
  provider.addScope("profile");
  // On phones LINE hands the login to the LINE app, which returns in a new browser
  // tab without the sign-in state, so Firebase fails with "missing initial state"
  // (An, 2026-10-07). Keep the whole login in the browser page instead.
  provider.setCustomParameters({ disable_auto_login: "true", disable_ios_auto_login: "true" });
  return signInWith(provider);
}

/** Popup first; mobile browsers that block popups fall back to a redirect. */
async function signInWith(provider: AuthProvider): Promise<User | null> {
  const auth = firebaseAuth();
  if (!auth) throw new FirebaseNotConfiguredError();
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
