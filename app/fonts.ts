import { Cormorant_Garamond, Inter, Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";

/** Display serif — perfume names, English headlines. */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

/** Body sans for Latin text. */
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/*
 * CJK fonts are split into many unicode-range files by Google Fonts, so they
 * are not preloaded; the browser fetches only the slices a page actually uses.
 */
export const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500"],
  variable: "--font-noto-sans-tc",
  display: "swap",
  preload: false,
});

export const notoSerifTC = Noto_Serif_TC({
  weight: ["400", "600"],
  variable: "--font-noto-serif-tc",
  display: "swap",
  preload: false,
});

export const fontVariables = [cormorant, inter, notoSansTC, notoSerifTC]
  .map((font) => font.variable)
  .join(" ");
