import type { Feeling, FragranceFamily, Mood, Scene, WeatherSnapshot } from "@/types";

/**
 * An's scene guide (Nefertem 情境香水推薦指南, 2026-10-11): where you are going,
 * the feeling you want to give, and today's weather each point at families and
 * notes. Families are weighted 0–1; `avoid` families pull a scent down; `notes`
 * are the guide's own 適合的氣味, keyed as in data/notes.ts.
 * "Oriental" is folded into `amber` throughout the data; tea notes are `fresh`.
 */
export type FamilyWeights = Partial<Record<FragranceFamily, number>>;

export interface Leaning {
  families: FamilyWeights;
  avoid: FragranceFamily[];
  notes: string[];
  /** 使用提醒, when the guide gives one. */
  tip?: string;
}

export interface SceneDefinition extends Leaning {
  key: Scene;
  zh: string;
  en: string;
  /** Where it applies, in a few words. */
  note: string;
}

/** 你現在要去哪裡？ — guide §三.1, filled from the matching scenes in §一. */
export const SCENES: readonly SceneDefinition[] = [
  {
    // §01 陽光明媚的戶外
    key: "sunny",
    zh: "陽光戶外",
    en: "OUTDOORS",
    note: "公園、野餐、散步",
    families: { citrus: 1, fresh: 1, floral: 0.5, marine: 0.5 },
    avoid: [],
    notes: [
      "bergamot",
      "lemon",
      "neroli",
      "orange-blossom",
      "petitgrain",
      "tea",
      "grass",
      "green-notes",
      "sea-notes",
    ],
  },
  {
    // §02 辦公室與工作環境, §10 正式場合與重要會議
    key: "work",
    zh: "辦公與工作",
    en: "WORK",
    note: "辦公室、會議、面試",
    families: { woody: 1, musky: 1, fresh: 0.5, floral: 0.5, citrus: 0.5 },
    avoid: ["gourmand", "leather"],
    notes: [
      "green-tea",
      "tea",
      "cedar",
      "sandalwood",
      "iris",
      "white-musk",
      "musk",
      "bergamot",
      "vetiver",
      "cardamom",
    ],
    tip: "密閉空間裡少噴一些，貼膚、低擴散的香氣最有分寸。",
  },
  {
    // §07 浪漫約會與燭光晚餐
    key: "date",
    zh: "約會時刻",
    en: "DATE",
    note: "晚餐、散步、兩人獨處",
    families: { floral: 1, musky: 1, woody: 0.5, amber: 0.5 },
    avoid: [],
    notes: ["rose", "iris", "orange-blossom", "sandalwood", "vanilla", "cardamom", "musk"],
    tip: "用餐時少噴一些，別讓香氣蓋過食物的味道。",
  },
  {
    // §08 藝術展覽與美術館
    key: "art",
    zh: "藝術與展覽",
    en: "GALLERY",
    note: "看展、藝廊、文化活動",
    families: { woody: 1, mineral: 1, avantgarde: 1, floral: 0.5, amber: 0.5 },
    avoid: ["gourmand"],
    notes: ["iris", "papyrus", "ink", "cedar", "frankincense", "incense", "vetiver"],
    tip: "展覽多在室內，記得控制擴散度。",
  },
  {
    // §06 居家休息與獨處, §13 創作、閱讀與專注
    key: "home",
    zh: "居家獨處",
    en: "AT HOME",
    note: "閱讀、休息、創作",
    families: { musky: 1, woody: 0.5, floral: 0.5, fougere: 0.5, fresh: 0.5 },
    avoid: ["leather", "spicy"],
    notes: [
      "white-musk",
      "musk",
      "sandalwood",
      "lavender",
      "iris",
      "tea",
      "green-tea",
      "cedar",
      "frankincense",
    ],
  },
  {
    // §09 派對、酒吧與夜生活
    key: "night",
    zh: "夜晚聚會",
    en: "NIGHT OUT",
    note: "派對、酒吧、音樂活動",
    families: { amber: 1, spicy: 1, leather: 1, floral: 0.5, woody: 0.5 },
    avoid: [],
    notes: ["saffron", "pepper", "amber", "patchouli", "leather", "tuberose"],
    tip: "在密閉的酒吧裡，依空間大小控制噴量。",
  },
];

export interface FeelingDefinition {
  key: Feeling;
  zh: string;
  en: string;
  families: FamilyWeights;
  /** Collection tags (神秘、清新…) that say the same thing. */
  moods: Mood[];
}

/** 你想呈現什麼感覺？ — guide §三.2, families from the scenes that carry each feeling in §一 and §二. */
export const FEELINGS: readonly FeelingDefinition[] = [
  {
    // 沉穩 (§02), 安靜、內斂 (§04), 放鬆 (§06), 沉靜 (§13)
    key: "calm",
    zh: "平靜、沉穩",
    en: "CALM",
    families: { woody: 1, musky: 1, chypre: 0.5, fougere: 0.5, fresh: 0.5 },
    moods: ["calm", "mature"],
  },
  {
    // 明亮、活力 (§01), 清爽、自由 (§03), 活力、清新 (§11)
    key: "fresh",
    zh: "清新、充滿活力",
    en: "FRESH",
    families: { citrus: 1, fresh: 1, marine: 1, fougere: 0.5 },
    moods: ["fresh"],
  },
  {
    // 藝術、知性 (§08), 俐落、可靠 (§10)
    key: "elegant",
    zh: "優雅、知性",
    en: "ELEGANT",
    families: { floral: 1, woody: 1, chypre: 0.5, mineral: 0.5 },
    moods: ["mature"],
  },
  {
    // 神秘 (§08), 個性、鮮明 (§09), 故事感 (§04)
    key: "mysterious",
    zh: "神秘、個性鮮明",
    en: "MYSTERIOUS",
    families: { amber: 1, leather: 1, avantgarde: 1, spicy: 0.5, woody: 0.5 },
    moods: ["mysterious", "bold"],
  },
  {
    // 溫柔、迷人、親密 (§07)
    key: "romantic",
    zh: "溫柔、浪漫",
    en: "ROMANTIC",
    families: { floral: 1, musky: 1, amber: 0.5, gourmand: 0.5 },
    moods: ["seductive", "warm"],
  },
];

export type WeatherBucket = "hot" | "warm" | "cool" | "rainy";

export interface WeatherDefinition extends Leaning {
  key: WeatherBucket;
  zh: string;
}

/** 當下的天氣如何？ — guide §三.3, read from today's weather rather than asked. */
export const WEATHER_BUCKETS: Record<WeatherBucket, WeatherDefinition> = {
  // §03 海邊與炎熱潮濕的天氣
  hot: {
    key: "hot",
    zh: "炎熱、潮濕",
    families: { marine: 1, citrus: 1, fresh: 1, fougere: 0.5 },
    avoid: ["gourmand", "amber", "leather"],
    notes: ["sea-salt", "sea-notes", "bergamot", "mint", "sage", "juniper"],
    tip: "高溫會讓香氣散得更快、更明顯，噴少一點就好。",
  },
  // The guide gives no scene of its own for mild days: no lean either way.
  warm: { key: "warm", zh: "溫暖、舒適", families: {}, avoid: [], notes: [] },
  // §05 秋冬與寒冷的戶外
  cool: {
    key: "cool",
    zh: "涼爽、寒冷",
    families: { amber: 1, spicy: 1, woody: 1, gourmand: 1, leather: 0.5 },
    avoid: [],
    notes: ["sandalwood", "cedar", "cinnamon", "cardamom", "amber", "vanilla", "leather"],
  },
  // §04 下雨天與陰鬱天氣
  rainy: {
    key: "rainy",
    zh: "陰雨、潮濕",
    families: { woody: 1, chypre: 1, fresh: 0.5, amber: 0.5, leather: 0.5 },
    avoid: [],
    notes: ["cedar", "vetiver", "patchouli", "moss", "oakmoss", "black-tea", "incense"],
  },
};

/** Rain first, then temperature (hot ≥ 26°C, cool ≤ 18°C). */
export function weatherBucket(weather: WeatherSnapshot): WeatherBucket {
  if (weather.isRainy) return "rainy";
  if (weather.isHot) return "hot";
  if (weather.isCold) return "cool";
  return "warm";
}

export const sceneInfo = (key: Scene) => SCENES.find((s) => s.key === key)!;
export const feelingInfo = (key: Feeling) => FEELINGS.find((f) => f.key === key)!;

const SCENE_KEYS = new Set<string>(SCENES.map((s) => s.key));
const FEELING_KEYS = new Set<string>(FEELINGS.map((f) => f.key));
export const isScene = (v: unknown): v is Scene => typeof v === "string" && SCENE_KEYS.has(v);
export const isFeeling = (v: unknown): v is Feeling => typeof v === "string" && FEELING_KEYS.has(v);
