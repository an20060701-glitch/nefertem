/**
 * The loading ritual plays once per browser session. The flag is read by an
 * inline script in app/layout.tsx before first paint so returning visitors
 * never see a flash of the overlay.
 */
export const INTRO_STORAGE_KEY = "nefertem:intro-seen";
export const INTRO_DONE_EVENT = "nefertem:intro-done";
/** Seconds the ritual occupies the screen before the page beneath animates in. */
export const INTRO_DURATION = 2.4;

export const introFlagScript = `try{if(sessionStorage.getItem("${INTRO_STORAGE_KEY}")){document.documentElement.dataset.introSeen=""}}catch(e){}`;

export function hasSeenIntro(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.hasAttribute("data-intro-seen");
}
