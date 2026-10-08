import type { Fragrance } from "@/types";

export type Concentration = NonNullable<Fragrance["concentration"]>;

export interface ConcentrationInfo {
  /** The bottle's own wording. */
  en: string;
  zh: string;
  /** Share of perfume oil. */
  oil: string;
  /** How long it usually lasts on skin. */
  lasting: string;
}

/*
 * The concentration grades, strongest first, as An gave them (2026-10-08). Parfum and
 * Extrait de Parfum are one grade under two names. Shown in 新增香水 when a grade is picked.
 */
export const CONCENTRATION_GUIDE: Readonly<Record<Concentration, ConcentrationInfo>> = {
  Extrait: { en: "Extrait de Parfum", zh: "濃香精", oil: "約 20% - 40%", lasting: "約 8 - 12 小時以上" },
  Parfum: { en: "Parfum", zh: "香精", oil: "約 20% - 40%", lasting: "約 8 - 12 小時以上" },
  EDP: { en: "Eau de Parfum", zh: "淡香精 / 濃香水", oil: "約 15% - 20%", lasting: "約 6 - 8 小時" },
  EDT: { en: "Eau de Toilette", zh: "淡香水", oil: "約 5% - 15%", lasting: "約 3 - 5 小時" },
  EDC: { en: "Eau de Cologne", zh: "古龍水", oil: "約 2% - 5%", lasting: "約 2 - 3 小時" },
  Fraiche: { en: "Eau Fraîche", zh: "清新水 / 體香水", oil: "約 1% - 3%", lasting: "約 1 - 2 小時" },
};

/** Strongest first. */
export const CONCENTRATIONS = Object.keys(CONCENTRATION_GUIDE) as Concentration[];
