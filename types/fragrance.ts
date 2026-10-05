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

export type DataOrigin = "demo" | "manual" | "lookup";

export interface Fragrance {
  id: string;
  brand: string;
  name: string;
  nameZh?: string;
  concentration?: "EDC" | "EDT" | "EDP" | "Parfum" | "Extrait";
  volumeMl?: number;
  imageUrl?: string;
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
