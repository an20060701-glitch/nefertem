import type { Fragrance } from "@/types";
import { withZhName } from "./name-zh";

/*
 * Calvin Klein perfumes from An's "Calvin Klein 與 adidas 香水產品資料庫" (2026-10-07).
 * Each perfume and its notes were checked against retailer and press pages (Calvin
 * Klein's own site could not be read by a script); the list's notes were replaced by
 * the published ones where they differed. The four Euphoria Elixirs are Parfum Intense.
 * Euphoria Signature Elixir is published as one note list, split evenly here.
 * Where two retailers disagree, the one quoted in the entry's comment is used.
 * adidas: An's list adds none (its site gives no notes), so none are here.
 */
export const CALVIN_KLEIN_SOURCE = "Calvin Klein 香水（An 提供的清單，2026-10-07 依通路與新聞稿查證）";

const CREATED = Date.UTC(2026, 9, 7);
const BRAND = "Calvin Klein";

type Entry = Omit<Fragrance, "brand" | "origin" | "createdAt" | "tags">;

const ENTRIES: readonly Entry[] = [
  {
    // The Perfume Shop
    id: "cat-calvin-klein-ck-one-edt",
    name: "CK One",
    concentration: "EDT",
    family: "citrus",
    subFamilies: ["fresh"],
    topNotes: ["tea", "papaya", "bergamot"],
    heartNotes: ["nutmeg", "violet", "cardamom", "rose"],
    baseNotes: ["musk", "amber"],
    description: "清新中性調，1994 年推出",
  },
  {
    // Macy's, Boots
    id: "cat-calvin-klein-eternity-for-women-edp",
    name: "Eternity for Women",
    concentration: "EDP",
    family: "floral",
    topNotes: ["bergamot", "mandarin", "lily"],
    heartNotes: ["rose", "carnation", "violet"],
    baseNotes: ["sandalwood", "amber", "musk"],
    description: "浪漫花香調",
  },
  {
    // Kohl's
    id: "cat-calvin-klein-eternity-for-women-suede-essence-parfum",
    name: "Eternity for Women Suede Essence",
    concentration: "Parfum",
    family: "floral",
    subFamilies: ["leather", "amber"],
    topNotes: ["raspberry", "bergamot", "lemon"],
    heartNotes: ["jasmine", "pink-pepper", "vanilla"],
    baseNotes: ["suede", "vanilla", "musk", "amber"],
    description: "溫暖辛香麂皮調，2026 年限量版",
  },
  {
    // QVC
    id: "cat-calvin-klein-euphoria-edp",
    name: "Euphoria",
    concentration: "EDP",
    family: "floral",
    subFamilies: ["fruity", "amber"],
    topNotes: ["pomegranate", "persimmon", "green-notes"],
    heartNotes: ["lotus", "orchid", "champaca"],
    baseNotes: ["violet", "mahogany", "amber", "musk"],
    description: "果香花香調",
  },
  {
    // Moodie Davitt Report, NST Perfume (one note list)
    id: "cat-calvin-klein-euphoria-signature-elixir",
    name: "Euphoria Signature Elixir",
    concentration: "Parfum",
    family: "amber",
    subFamilies: ["floral", "chypre"],
    topNotes: ["vanilla"],
    heartNotes: ["orchid"],
    baseNotes: ["patchouli"],
    description: "香草西普調，Parfum Intense，2026 年推出",
  },
  {
    // The Perfume Shop, Business Wire press release
    id: "cat-calvin-klein-euphoria-magnetic-elixir",
    name: "Euphoria Magnetic Elixir",
    concentration: "Parfum",
    family: "amber",
    subFamilies: ["floral", "musky"],
    topNotes: ["ambrette"],
    heartNotes: ["orchid"],
    baseNotes: ["vanilla", "musk"],
    description: "琥珀花香調，Parfum Intense，2026 年推出",
  },
  {
    // The Perfume Shop, Business Wire press release
    id: "cat-calvin-klein-euphoria-bold-elixir",
    name: "Euphoria Bold Elixir",
    concentration: "Parfum",
    family: "amber",
    subFamilies: ["woody"],
    topNotes: ["jasmine"],
    heartNotes: ["orchid"],
    baseNotes: ["vanilla", "cedar"],
    description: "琥珀木質調，Parfum Intense，2026 年推出",
  },
  {
    // The Perfume Shop, Business Wire press release
    id: "cat-calvin-klein-euphoria-solar-elixir",
    name: "Euphoria Solar Elixir",
    concentration: "Parfum",
    family: "amber",
    subFamilies: ["fruity"],
    topNotes: ["mango"],
    heartNotes: ["orchid"],
    baseNotes: ["vanilla", "cedar"],
    description: "琥珀果香調，Parfum Intense，2026 年推出",
  },
  {
    // Notino
    id: "cat-calvin-klein-obsession-for-women-edp",
    name: "Obsession for Women",
    concentration: "EDP",
    family: "amber",
    subFamilies: ["spicy"],
    topNotes: ["bergamot", "mandarin", "vanilla", "green-notes", "basil", "peach", "lemon"],
    heartNotes: ["jasmine", "sandalwood", "cedar", "coriander", "rose", "oakmoss", "orange-blossom"],
    baseNotes: ["musk", "frankincense", "amber", "civet", "vanilla", "vetiver"],
    description: "東方辛香調",
  },
  {
    // The Perfume Shop
    id: "cat-calvin-klein-eternity-for-men-edt",
    name: "Eternity for Men",
    concentration: "EDT",
    family: "fougere",
    topNotes: ["mandarin", "sage", "galbanum"],
    heartNotes: ["basil", "geranium", "lavender"],
    baseNotes: ["moss", "cedar", "amber"],
    description: "芳香馥奇調，1989 年推出",
  },
  {
    // John Lewis, Good Price Pharmacy
    id: "cat-calvin-klein-eternity-for-men-parfum",
    name: "Eternity for Men",
    concentration: "Parfum",
    family: "fougere",
    subFamilies: ["gourmand"],
    topNotes: ["lavender", "mint"],
    heartNotes: ["cedar", "patchouli"],
    baseNotes: ["vanilla", "rum"],
    description: "溫暖馥奇美食調",
  },
  {
    // Lookfantastic
    id: "cat-calvin-klein-eternity-for-men-edp",
    name: "Eternity for Men",
    concentration: "EDP",
    family: "woody",
    subFamilies: ["fougere"],
    topNotes: ["sage", "ozonic", "grapefruit", "apple"],
    heartNotes: ["geranium", "cypress", "nutmeg", "lavender"],
    baseNotes: ["suede", "iris", "vetiver", "ambergris", "cypriol"],
    description: "木質馥奇調",
  },
  {
    // The Perfume Shop
    id: "cat-calvin-klein-obsession-for-men-edt",
    name: "Obsession for Men",
    concentration: "EDT",
    family: "amber",
    subFamilies: ["woody", "spicy"],
    topNotes: ["bergamot", "mandarin"],
    heartNotes: ["lavender", "clove", "myrrh", "nutmeg", "coriander", "sage"],
    baseNotes: ["patchouli", "sandalwood", "vetiver", "amber"],
    description: "木質琥珀調，1986 年推出",
  },
  {
    // Marrons Pharmacy
    id: "cat-calvin-klein-defy-edt",
    name: "Defy",
    concentration: "EDT",
    family: "woody",
    subFamilies: ["fresh"],
    topNotes: ["bergamot"],
    heartNotes: ["lavender"],
    baseNotes: ["vetiver", "amber"],
    description: "清新木質調",
  },
  {
    // Escentual
    id: "cat-calvin-klein-defy-edp",
    name: "Defy",
    concentration: "EDP",
    family: "woody",
    subFamilies: ["leather"],
    topNotes: ["mandarin", "pepper"],
    heartNotes: ["leather"],
    baseNotes: ["vetiver"],
    description: "木質調",
  },
  {
    // Chemist Warehouse
    id: "cat-calvin-klein-defy-parfum",
    name: "Defy",
    concentration: "Parfum",
    family: "woody",
    subFamilies: ["fougere", "gourmand"],
    topNotes: ["pink-pepper", "mandarin", "cardamom"],
    heartNotes: ["lavender", "geranium", "ginger"],
    baseNotes: ["sandalwood", "cocoa"],
    description: "木質芳香調，帶美食調氣息",
  },
];

export const CALVIN_KLEIN: readonly Fragrance[] = ENTRIES.map((e) =>
  withZhName({
    ...e,
    brand: BRAND,
    tags: [],
    origin: "lookup",
    createdAt: CREATED,
  }),
);
