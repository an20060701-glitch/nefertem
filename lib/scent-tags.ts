import type { Mood } from "@/types";
import { MOODS } from "@/lib/fragrance/families";

/**
 * Scent Tag Engine (architecture §7.2).
 * Each note suggests a few impressions; the seven Mood words (神秘、清新…)
 * double as recommendation moods, the rest are descriptive tags.
 */
export const NOTE_TAGS: Record<string, string[]> = {
  bergamot: ["清新", "活力"],
  grapefruit: ["清新", "活力"],
  lemon: ["清新", "明亮"],
  lime: ["清新", "活力"],
  mandarin: ["清新", "甜美"],
  orange: ["清新", "明亮"],
  neroli: ["清新", "優雅"],
  mint: ["清新", "涼感"],
  "fig-leaf": ["清新", "平靜"],
  "green-notes": ["清新", "自然"],
  rhubarb: ["清新", "酸甜"],
  pine: ["平靜", "自然"],
  "sea-notes": ["清新", "侵略性"],
  calone: ["清新", "侵略性"],
  "sea-salt": ["清新", "侵略性"],
  flint: ["侵略性", "成熟"],
  lavender: ["平靜", "成熟"],
  geranium: ["成熟", "清新"],
  rosemary: ["清新", "自然"],
  sage: ["平靜", "自然"],
  juniper: ["清新", "平靜"],
  jasmine: ["誘人", "優雅"],
  rose: ["優雅", "浪漫", "誘人"],
  iris: ["優雅", "平靜", "成熟"],
  violet: ["優雅", "神秘"],
  "lily-of-the-valley": ["清新", "優雅"],
  "orange-blossom": ["誘人", "明亮"],
  freesia: ["清新", "浪漫"],
  "ylang-ylang": ["誘人", "濃郁"],
  pineapple: ["活力", "侵略性"],
  blackcurrant: ["活力", "酸甜"],
  apple: ["清新", "活力"],
  pear: ["清新", "甜美"],
  peach: ["甜美", "誘人"],
  litchi: ["甜美", "誘人"],
  melon: ["清新", "甜美"],
  fig: ["溫暖", "甜美"],
  oakmoss: ["成熟", "平靜"],
  pepper: ["侵略性", "活力"],
  "pink-pepper": ["活力", "誘人"],
  "sichuan-pepper": ["侵略性", "活力"],
  ginger: ["溫暖", "活力"],
  nutmeg: ["溫暖", "成熟"],
  cardamom: ["溫暖", "神秘"],
  clove: ["溫暖", "濃郁"],
  cedar: ["平靜", "成熟"],
  sandalwood: ["溫暖", "平靜", "成熟"],
  vetiver: ["成熟", "平靜"],
  patchouli: ["沉穩", "平靜", "成熟"],
  "guaiac-wood": ["溫暖", "神秘"],
  rosewood: ["溫暖", "優雅"],
  oud: ["神秘", "成熟", "濃郁"],
  papyrus: ["神秘", "平靜"],
  amber: ["溫暖", "神秘", "誘人"],
  ambroxan: ["侵略性", "清新"],
  labdanum: ["神秘", "溫暖"],
  incense: ["神秘", "平靜"],
  elemi: ["神秘", "清新"],
  opoponax: ["神秘", "溫暖"],
  benzoin: ["溫暖", "甜美"],
  "peru-balsam": ["溫暖", "甜美"],
  vanilla: ["溫暖", "甜美", "誘人"],
  tonka: ["溫暖", "甜美"],
  coffee: ["誘人", "神秘"],
  "bitter-almond": ["甜美", "神秘"],
  licorice: ["神秘", "甜美"],
  chestnut: ["溫暖", "甜美"],
  coconut: ["溫暖", "甜美"],
  musk: ["誘人", "平靜"],
  "white-musk": ["平靜", "乾淨"],
  ambrette: ["誘人", "平靜"],
  ambergris: ["神秘", "成熟"],
  cashmeran: ["溫暖", "平靜"],
  "cashmere-wood": ["溫暖", "平靜"],
  leather: ["侵略性", "成熟", "神秘"],
  birch: ["侵略性", "神秘"],
  "iso-e-super": ["神秘", "侵略性"],
  aldehydes: ["優雅", "侵略性"],
  hinoki: ["平靜", "沉穩", "乾燥"],
  tea: ["平靜", "清新"],
  basil: ["清新", "綠意"],
  petitgrain: ["清新", "明朗"],
  "blood-orange": ["清新", "酸甜"],
  "bitter-orange": ["清新", "明朗"],
  watermelon: ["清新", "活力"],
  tuberose: ["誘人", "濃郁"],
  peony: ["浪漫", "優雅"],
  frankincense: ["神秘", "平靜", "深邃"],
  saffron: ["神秘", "誘人", "辛辣"],
  cinnamon: ["溫暖", "辛辣"],
  rum: ["微醺", "溫暖", "誘人"],
  whisky: ["微醺", "成熟"],
  pistachio: ["可口", "溫暖"],
  hazelnut: ["可口", "溫暖"],
  caramel: ["甜美", "療癒"],
  rice: ["療癒", "平靜"],
  "soy-milk": ["療癒", "溫潤"],
  pumpkin: ["溫潤", "療癒"],
  butter: ["溫潤", "可口"],
  seaweed: ["清涼", "微鹹"],
  ink: ["清冷", "侵略性"],
  metallic: ["清冷", "俐落", "侵略性"],
};

const LAYER_WEIGHT = { top: 0.8, heart: 1.2, base: 1 } as const;

export interface NoteLayers {
  topNotes: readonly string[];
  heartNotes: readonly string[];
  baseNotes: readonly string[];
}

export interface WeightedTag {
  tag: string;
  weight: number;
}

/** Suggested tags from a fragrance's notes, heaviest first (heart notes count most). */
export function deriveTags({ topNotes, heartNotes, baseNotes }: NoteLayers): WeightedTag[] {
  const weights = new Map<string, number>();
  const add = (notes: readonly string[], layerWeight: number) => {
    for (const note of notes) {
      for (const tag of NOTE_TAGS[note] ?? []) weights.set(tag, (weights.get(tag) ?? 0) + layerWeight);
    }
  };
  add(topNotes, LAYER_WEIGHT.top);
  add(heartNotes, LAYER_WEIGHT.heart);
  add(baseNotes, LAYER_WEIGHT.base);
  return [...weights]
    .map(([tag, weight]) => ({ tag, weight: Math.round(weight * 100) / 100 }))
    .sort((a, b) => b.weight - a.weight || a.tag.localeCompare(b.tag));
}

const MOOD_BY_ZH = new Map(MOODS.map((m) => [m.zh, m.key]));
const MOOD_KEYS = new Set<string>(MOODS.map((m) => m.key));

/** The Mood a tag stands for, accepting either the key ("calm") or its Chinese word (平靜). */
export function tagToMood(tag: string): Mood | undefined {
  if (MOOD_KEYS.has(tag)) return tag as Mood;
  return MOOD_BY_ZH.get(tag);
}

/** Moods suggested by the notes, strongest first. */
export function deriveMoods(layers: NoteLayers, limit = 2): Mood[] {
  const moods: Mood[] = [];
  for (const { tag } of deriveTags(layers)) {
    const mood = tagToMood(tag);
    if (mood && !moods.includes(mood)) moods.push(mood);
    if (moods.length === limit) break;
  }
  return moods;
}
