import type { Fragrance } from "@/types";

/*
 * HEAVEN LAFA 天堂費洛香 — a Taiwanese house inspired by ancient Egypt, woody and
 * unisex — from An's "HEAVEN LAFA 香水產品資料庫" (2026-10-07). Top, heart and base
 * notes are as listed; the two 100 ml scents come with mood words only, no notes.
 * The style words go in tags exactly as listed, so any mood they name can count.
 * Names are the official Chinese ones: the English names in the list could not be
 * found on the brand's site or in a web search, so they are not used.
 */
export const HEAVEN_LAFA_SOURCE = "An 提供的 HEAVEN LAFA 產品資料（2026-10-07，整理自品牌官網）";

const CREATED = Date.UTC(2026, 9, 7);
const BRAND = "HEAVEN LAFA";

type Entry = Omit<Fragrance, "brand" | "origin" | "createdAt">;

const ENTRIES: readonly Entry[] = [
  {
    id: "cat-heaven-lafa-beast-wolf",
    name: "神獸阿努比",
    nameZh: "神獸阿努比－俐落好感香",
    volumeMl: 50,
    family: "woody",
    subFamilies: ["leather", "spicy"],
    topNotes: ["cardamom", "violet", "leather", "bergamot"],
    heartNotes: ["iris", "papyrus", "amber", "pink-pepper"],
    baseNotes: ["sandalwood", "cedar", "honey", "rosewood"],
    tags: ["俐落", "好感", "痞帥"],
    description: "皮革豆蔻木質調。俐落好感香，痞帥、俐落、好感。",
  },
  {
    id: "cat-heaven-lafa-immortal-soul",
    name: "永生法老魂",
    nameZh: "永生法老魂－慵懶偽體香",
    volumeMl: 50,
    family: "woody",
    subFamilies: ["musky"],
    topNotes: ["blackberry", "bergamot", "oak"],
    heartNotes: ["beeswax", "peony", "freesia", "pink-pepper"],
    baseNotes: ["ambergris", "amber", "musk"],
    tags: ["慵懶", "陽光", "百搭"],
    description: "龍涎麝香木質調。慵懶偽體香，陽光、慵懶、百搭。",
  },
  {
    id: "cat-heaven-lafa-pyramid-lover",
    name: "金字塔戀人",
    nameZh: "金字塔戀人－狂野魅惑香",
    volumeMl: 50,
    family: "woody",
    subFamilies: ["floral", "leather"],
    topNotes: ["cinnamon", "blood-orange", "iris", "elemi"],
    heartNotes: ["rose", "leather", "pink-pepper", "lavender"],
    baseNotes: ["sandalwood", "cherry", "vetiver"],
    tags: ["狂野", "魅惑"],
    description: "煙燻薔薇木質調。狂野魅惑香，薔薇、狂野、魅惑。",
  },
  {
    id: "cat-heaven-lafa-ankh-life-key",
    name: "生命馥之鑰",
    nameZh: "生命馥之鑰－催眠治癒香",
    volumeMl: 50,
    family: "woody",
    subFamilies: ["amber", "floral"],
    topNotes: ["pink-pepper", "bitter-orange"],
    heartNotes: ["rose", "jasmine"],
    baseNotes: ["vetiver", "patchouli", "myrrh"],
    tags: ["療癒", "催眠", "治癒"],
    description: "焚香玫瑰木質調。催眠治癒香，療癒、催眠、治癒。",
  },
  {
    id: "cat-heaven-lafa-nile-moon",
    name: "月暮尼羅河",
    nameZh: "月暮尼羅河－沉穩內斂信任感",
    volumeMl: 100,
    family: "woody",
    topNotes: [],
    heartNotes: [],
    baseNotes: [],
    tags: ["沉穩", "內斂", "信任感"],
    description: "木質調。沉穩、內斂、信任感。",
  },
  {
    id: "cat-heaven-lafa-heart-of-isis",
    name: "伊西絲之心",
    nameZh: "伊西絲之心－冷熱反差生命力",
    volumeMl: 100,
    family: "woody",
    topNotes: [],
    heartNotes: [],
    baseNotes: [],
    tags: ["冷熱", "反差", "生命力"],
    description: "木質調。冷熱、反差、生命力。",
  },
];

export const HEAVEN_LAFA: readonly Fragrance[] = ENTRIES.map((e) => ({
  ...e,
  brand: BRAND,
  origin: "lookup",
  createdAt: CREATED,
}));
