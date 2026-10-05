import type { FragranceFamily, Mood } from "@/types";

/**
 * Single source of truth for fragrance families and their watercolour swatches.
 * Swatches mark small dots, wheel segments and pyramid hairlines only —
 * never large backgrounds or gradients (design system §1.4).
 */
export interface FamilyDefinition {
  key: FragranceFamily;
  zh: string;
  en: string;
  color: string;
}

export const FAMILIES: Record<FragranceFamily, FamilyDefinition> = {
  citrus: { key: "citrus", zh: "柑橘", en: "CITRUS", color: "#C9A43B" },
  fresh: { key: "fresh", zh: "清新綠意", en: "FRESH", color: "#7F9A6A" },
  marine: { key: "marine", zh: "海洋水生", en: "MARINE", color: "#5F86A6" },
  floral: { key: "floral", zh: "花香", en: "FLORAL", color: "#B9707F" },
  fruity: { key: "fruity", zh: "果香", en: "FRUITY", color: "#C07A5A" },
  fougere: { key: "fougere", zh: "馥奇", en: "FOUGÈRE", color: "#6E8370" },
  chypre: { key: "chypre", zh: "柑苔", en: "CHYPRE", color: "#6B6A3E" },
  woody: { key: "woody", zh: "木質", en: "WOODY", color: "#7A5C45" },
  amber: { key: "amber", zh: "琥珀／東方", en: "AMBER · ORIENTAL", color: "#A9713A" },
  gourmand: { key: "gourmand", zh: "美食", en: "GOURMAND", color: "#9A6B4F" },
  spicy: { key: "spicy", zh: "辛香", en: "SPICY", color: "#9C4F33" },
  musky: { key: "musky", zh: "麝香", en: "MUSK", color: "#A69A93" },
  leather: { key: "leather", zh: "皮革煙燻", en: "LEATHER", color: "#4E3B30" },
  mineral: { key: "mineral", zh: "礦物", en: "MINERAL", color: "#8C9196" },
  avantgarde: { key: "avantgarde", zh: "前衛", en: "AVANT-GARDE", color: "#3E4A5C" },
};

export interface MoodDefinition {
  key: Mood;
  zh: string;
  en: string;
}

export const MOODS: readonly MoodDefinition[] = [
  { key: "mysterious", zh: "神秘", en: "MYSTERIOUS" },
  { key: "fresh", zh: "清新", en: "FRESH" },
  { key: "warm", zh: "溫暖", en: "WARM" },
  { key: "calm", zh: "平靜", en: "CALM" },
  { key: "mature", zh: "成熟", en: "MATURE" },
  { key: "seductive", zh: "誘人", en: "SEDUCTIVE" },
  { key: "bold", zh: "侵略性", en: "BOLD" },
];
