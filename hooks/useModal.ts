"use client";

import { useEffect, type RefObject } from "react";

/**
 * Full-screen overlay behaviour shared by the wheel and the collection sheets:
 * lock page scroll, make the page behind inert, move focus in, restore all on close.
 */
export function useModal(
  dialogRef: RefObject<HTMLElement | null>,
  initialFocus?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    const behind = [...document.body.children].filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== dialogRef.current && !el.inert,
    );
    behind.forEach((el) => (el.inert = true));
    (initialFocus?.current ?? dialogRef.current)?.focus();
    return () => {
      root.style.overflow = overflow;
      behind.forEach((el) => (el.inert = false));
      previous?.focus();
    };
  }, [dialogRef, initialFocus]);
}

/** Escape closes; Tab stays inside the dialog. */
export function modalKeyDown(e: React.KeyboardEvent, dialog: HTMLElement | null, onClose: () => void) {
  if (e.key === "Escape") {
    e.stopPropagation();
    onClose();
    return;
  }
  if (e.key !== "Tab" || !dialog) return;
  const focusable = dialog.querySelectorAll<HTMLElement>(
    "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])",
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}
