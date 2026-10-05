import type { WeatherCondition } from "@/types";

/** Display words for a weather condition. Safe for client components. */
export const CONDITION_LABELS: Record<WeatherCondition, { zh: string; en: string }> = {
  clear: { zh: "晴朗", en: "CLEAR" },
  cloudy: { zh: "多雲", en: "CLOUDY" },
  fog: { zh: "起霧", en: "FOGGY" },
  drizzle: { zh: "毛毛雨", en: "DRIZZLE" },
  rain: { zh: "下雨", en: "RAINY" },
  storm: { zh: "雷雨", en: "STORMY" },
  snow: { zh: "下雪", en: "SNOWY" },
};
