"use client";

import { useState } from "react";
import { INTRO_DURATION, hasSeenIntro } from "@/lib/intro";

/**
 * Seconds to hold page-entrance animations so they begin as the loading
 * ritual lifts. Zero for visitors who already saw it this session.
 * Read once at mount: the html flag is set before hydration by app/layout.tsx.
 */
export function useIntroDelay(): number {
  const [delay] = useState(() => (typeof document === "undefined" || hasSeenIntro() ? 0 : INTRO_DURATION));
  return delay;
}
