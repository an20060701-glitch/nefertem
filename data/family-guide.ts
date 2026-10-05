import type { FragranceFamily } from "@/types";
import type { NoteKey } from "./notes";

/**
 * 香調家族指南 — editorial copy provided by An (2026-10-05).
 * Seven reader-facing groups, each covering one or more engine families.
 * Representative perfumes are editorial examples, not verified brand data,
 * and are not part of the recommendation catalogue.
 */
export interface FamilyGuide {
  key: string;
  zh: string;
  en: string;
  /** Engine families this group covers (types/fragrance.ts). */
  families: FragranceFamily[];
  description: string;
  /** 氣味特性 — also used as descriptive mood tags. */
  traits: string[];
  /** 常見香料原料, as note keys in data/notes.ts. */
  materials: NoteKey[];
  representatives: { brand: string; name: string; accords: string }[];
}

export const FAMILY_GUIDES: readonly FamilyGuide[] = [
  {
    key: "woody",
    zh: "木質調",
    en: "WOODY NOTES",
    families: ["woody", "leather"],
    description:
      "木質調給人沉穩、溫暖與安心的感受，通常作為香水的中後調，持香度極高。近年（2026 年趨勢）木質調開始走向「柔軟化」，不再只有深沉煙燻，而是加入奶油感、茶香或果香來中和。",
    traits: ["溫暖", "乾燥", "沉穩", "貼膚", "中性"],
    materials: ["sandalwood", "cedar", "patchouli", "oud", "vetiver", "hinoki"],
    representatives: [
      { brand: "YSL", name: "自由不羈花息檀木淡香精", accords: "流金檀木、雪松" },
      { brand: "Le Labo", name: "Santal 33", accords: "檀香、雪松" },
      { brand: "Prada", name: "水印私藏系列 醇境檀木", accords: "檀香結合柴茶辛香" },
      { brand: "Aesop", name: "喚空香水", accords: "肉豆蔻、泥土木質氣息" },
    ],
  },
  {
    key: "floral",
    zh: "花香調",
    en: "FLORAL NOTES",
    families: ["floral", "fruity"],
    description:
      "香水界中最龐大、最普遍的家族。從清新的白花到馥郁的紅花，能展現出優雅、浪漫或性感的多元面貌。",
    traits: ["柔和", "浪漫", "明亮", "優雅"],
    materials: ["rose", "jasmine", "tuberose", "orange-blossom", "iris", "peony"],
    representatives: [
      { brand: "DIOR", name: "晚夏茉莉淬鍊香精", accords: "大花茉莉、豐盈果香" },
      { brand: "GUCCI", name: "花悅金燦女性淡香精", accords: "茉莉原精、晚香玉原精" },
      { brand: "Chanel", name: "N°5", accords: "五月玫瑰、格拉斯茉莉結合醛香" },
    ],
  },
  {
    key: "citrus",
    zh: "柑橘調／清新調",
    en: "CITRUS · FRESH NOTES",
    families: ["citrus", "fresh"],
    description:
      "以高揮發性的柑橘果皮萃取為主，通常作為香水的前調，給人清爽、充滿活力的第一印象，非常適合早晨或夏季推薦。",
    traits: ["清新", "酸甜", "明朗", "活力"],
    materials: ["bergamot", "lemon", "grapefruit", "petitgrain", "orange"],
    representatives: [
      { brand: "Jo Malone London", name: "青檸羅勒與柑橘", accords: "青檸、香檸檬" },
      { brand: "Atelier Cologne 歐瓏", name: "赤霞橘光", accords: "血橙、苦橙" },
      {
        brand: "DOLCE&GABBANA",
        name: "L'Imperatrice 卓絕群倫女性淡香水",
        accords: "清新果香前調，如西瓜、明亮柑橘",
      },
    ],
  },
  {
    key: "amber",
    zh: "琥珀調／東方調",
    en: "AMBER · ORIENTAL NOTES",
    families: ["amber", "spicy", "musky"],
    description: "帶有異國情調，氣味濃郁、深邃且具有神秘感，常結合樹脂與辛香料，適合夜晚、約會或秋冬季節。",
    traits: ["神秘", "性感", "微甜", "辛辣", "深邃"],
    materials: ["vanilla", "amber", "musk", "frankincense", "tonka", "cinnamon"],
    representatives: [
      { brand: "Maison Francis Kurkdjian", name: "Baccarat Rouge 540", accords: "龍涎香、番紅花" },
      { brand: "MCM", name: "呼嚕喵喵淡香精", accords: "安息香、香草、零陵香豆、麝香" },
      { brand: "Guerlain 嬌蘭", name: "一千零一夜 Shalimar", accords: "香草、鳶尾、香檸檬的經典東方調" },
    ],
  },
  {
    key: "gourmand",
    zh: "美食調",
    en: "GOURMAND NOTES",
    families: ["gourmand"],
    description:
      "模擬食物香氣的調性。近期的美食調已從純粹的「甜膩糖果味」進化為「熟成大人味」，加入酒香、堅果與鹹甜交織的質地。",
    traits: ["溫潤", "可口", "微醺", "療癒"],
    materials: ["rum", "whisky", "coffee", "pistachio", "hazelnut", "caramel", "rice", "soy-milk"],
    representatives: [
      { brand: "BORNTOSTANDOUT", name: "飲癮作樂淡香精", accords: "朗姆酒香、可樂糖漿、香草" },
      { brand: "TAMBURINS", name: "PUMKINI", accords: "南瓜、奶油鹹甜香氣" },
      { brand: "YSL", name: "黑鴉片 Black Opium", accords: "咖啡豆、香草" },
    ],
  },
  {
    key: "aquatic",
    zh: "海洋調／礦物前衛調",
    en: "AQUATIC · MINERAL NOTES",
    families: ["marine", "mineral", "avantgarde"],
    description:
      "早期以模擬海風、水氣為主，近年則延伸出帶有「工業感」的礦物、水泥或金屬氣息，營造出清冷、疏離的現代都市感。",
    traits: ["清涼", "純淨", "冷冽", "微鹹", "俐落"],
    materials: ["sea-salt", "calone", "seaweed", "metallic", "ink"],
    representatives: [
      { brand: "ISSEY MIYAKE 三宅一生", name: "一生之鹽香精", accords: "海洋氣息、琥珀、廣藿香" },
      { brand: "Jo Malone London", name: "鼠尾草與海鹽", accords: "海鹽、秋葵籽" },
      { brand: "YSL", name: "墨染繆思", accords: "墨水、金屬感礦物質氣息" },
    ],
  },
  {
    key: "fougere-chypre",
    zh: "馥奇調與西普調",
    en: "FOUGÈRE · CHYPRE NOTES",
    families: ["fougere", "chypre"],
    description:
      "兩者皆屬於層次豐富的傳統經典香調。馥奇調（Fougère）帶有陽剛與草本的清潔感；西普調（Chypre）則帶有濕潤泥土與橡木苔的氣息，質感輕奢。",
    traits: ["濕潤", "綠意", "層次分明", "泥土", "草本"],
    materials: ["oakmoss", "lavender", "geranium", "patchouli", "labdanum"],
    representatives: [
      { brand: "Tom Ford", name: "薰衣草極光", accords: "薰衣草、橡木苔的馥奇表現" },
      { brand: "Diptyque", name: "花都之水", accords: "廣藿香與玫瑰交織的現代西普調" },
      { brand: "Aesop", name: "悟香水", accords: "羅勒、香橙結合岩蘭草的草本綠意" },
    ],
  },
];

/** The guide a fragrance family belongs to. */
export function guideForFamily(family: FragranceFamily): FamilyGuide | undefined {
  return FAMILY_GUIDES.find((g) => g.families.includes(family));
}
