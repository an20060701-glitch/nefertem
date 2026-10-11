/** Shared domain types — see docs/NEFERTEM-ARCHITECTURE.md §4. */

export type FragranceFamily =
  | "citrus"
  | "fresh"
  | "marine"
  | "floral"
  | "fruity"
  | "fougere"
  | "chypre"
  | "woody"
  | "amber"
  | "gourmand"
  | "spicy"
  | "musky"
  | "leather"
  | "mineral"
  | "avantgarde";

export type Mood = "mysterious" | "fresh" | "warm" | "calm" | "mature" | "seductive" | "bold";

export type Occasion = "indoor" | "outdoor";

/** 你現在要去哪裡？ — the places in An's scene guide (2026-10-11). */
export type Scene = "sunny" | "work" | "date" | "art" | "home" | "night";

/** 你想呈現什麼感覺？ — the feelings in An's scene guide (2026-10-11). */
export type Feeling = "calm" | "fresh" | "elegant" | "mysterious" | "romantic";

export type DataOrigin = "demo" | "manual" | "lookup";

export interface Fragrance {
  id: string;
  brand: string;
  name: string;
  nameZh?: string;
  concentration?: "EDC" | "EDT" | "EDP" | "Parfum" | "Extrait" | "Fraiche";
  volumeMl?: number;
  imageUrl?: string;
  /** The brand's product page when `imageUrl` is its official picture (shown as the credit). */
  imageSource?: string;
  family: FragranceFamily;
  subFamilies?: FragranceFamily[];
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  tags: (Mood | string)[];
  description?: string;
  origin: DataOrigin;
  sources?: string[];
  createdAt: number;
}

export interface UserFragrance extends Fragrance {
  addedAt: number;
  usageCount: number;
  lastUsedAt?: number;
}
