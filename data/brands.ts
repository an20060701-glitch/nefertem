/**
 * Brands the shopping search recognises, with the names Taiwanese shoppers use.
 *
 * `domain` is the brand's own website, listed only where we are confident of it;
 * brands without one get a web search for their official site instead of a guess.
 * Chinese names are common trade names used for search matching, not brand data.
 */
export interface BrandInfo {
  key: string;
  name: string;
  zh?: string;
  /** Other spellings people type: abbreviations, accent-free forms, other Chinese names. */
  aliases?: string[];
  domain?: string;
}

export const BRANDS: readonly BrandInfo[] = [
  { key: "acqua-di-parma", name: "Acqua di Parma", zh: "帕爾瑪之水", domain: "acquadiparma.com" },
  { key: "aesop", name: "Aesop", zh: "伊索", domain: "aesop.com" },
  { key: "bulgari", name: "Bvlgari", zh: "寶格麗", aliases: ["Bulgari"], domain: "bulgari.com" },
  { key: "burberry", name: "Burberry", zh: "博柏利", domain: "burberry.com" },
  { key: "byredo", name: "Byredo", zh: "百瑞德", domain: "byredo.com" },
  { key: "carolina-herrera", name: "Carolina Herrera", zh: "卡羅琳娜海萊拉", domain: "carolinaherrera.com" },
  { key: "celine", name: "Celine", zh: "思琳", domain: "celine.com" },
  { key: "chanel", name: "Chanel", zh: "香奈兒", domain: "chanel.com" },
  { key: "creed", name: "Creed", zh: "克莉德", aliases: ["克利德"] },
  { key: "dior", name: "Dior", zh: "迪奧", aliases: ["Christian Dior"], domain: "dior.com" },
  { key: "diptyque", name: "Diptyque", zh: "蒂普提克", domain: "diptyqueparis.com" },
  {
    key: "dolce-gabbana",
    name: "Dolce & Gabbana",
    zh: "杜嘉班納",
    aliases: ["D&G", "Dolce&Gabbana"],
    domain: "dolcegabbana.com",
  },
  { key: "escentric-molecules", name: "Escentric Molecules", zh: "分子香水", domain: "escentric.com" },
  {
    key: "frederic-malle",
    name: "Frédéric Malle",
    zh: "馥馬爾",
    aliases: ["Frederic Malle"],
    domain: "fredericmalle.com",
  },
  {
    key: "giorgio-armani",
    name: "Giorgio Armani",
    zh: "亞曼尼",
    aliases: ["Armani"],
    domain: "armanibeauty.com",
  },
  { key: "givenchy", name: "Givenchy", zh: "紀梵希", domain: "givenchybeauty.com" },
  { key: "gucci", name: "Gucci", zh: "古馳", domain: "gucci.com" },
  { key: "guerlain", name: "Guerlain", zh: "嬌蘭", domain: "guerlain.com" },
  { key: "hermes", name: "Hermès", zh: "愛馬仕", aliases: ["Hermes"], domain: "hermes.com" },
  {
    key: "jo-malone",
    name: "Jo Malone London",
    zh: "祖瑪瓏",
    aliases: ["Jo Malone", "祖馬龍"],
    domain: "jomalone.com",
  },
  {
    key: "kilian",
    name: "Kilian Paris",
    zh: "凱利安",
    aliases: ["Kilian", "By Kilian"],
    domain: "bykilian.com",
  },
  { key: "le-labo", name: "Le Labo", zh: "勒拉柏", domain: "lelabofragrances.com" },
  { key: "loewe", name: "Loewe", zh: "羅意威", domain: "loewe.com" },
  {
    key: "louis-vuitton",
    name: "Louis Vuitton",
    zh: "路易威登",
    aliases: ["LV"],
    domain: "louisvuitton.com",
  },
  {
    key: "maison-francis-kurkdjian",
    name: "Maison Francis Kurkdjian",
    zh: "法蘭西斯庫克",
    aliases: ["MFK", "Francis Kurkdjian"],
    domain: "franciskurkdjian.com",
  },
  {
    key: "maison-margiela",
    name: "Maison Margiela",
    zh: "梅森馬吉拉",
    aliases: ["Margiela", "MMM", "Replica"],
    domain: "maisonmargiela.com",
  },
  { key: "mugler", name: "Mugler", zh: "穆勒", aliases: ["Thierry Mugler"], domain: "mugler.com" },
  {
    key: "penhaligons",
    name: "Penhaligon's",
    zh: "潘海利根",
    aliases: ["Penhaligons"],
    domain: "penhaligons.com",
  },
  { key: "prada", name: "Prada", zh: "普拉達", domain: "prada.com" },
  { key: "serge-lutens", name: "Serge Lutens", zh: "蘆丹氏", domain: "sergelutens.com" },
  { key: "tom-ford", name: "Tom Ford", zh: "湯姆福特", aliases: ["TF"], domain: "tomfordbeauty.com" },
  { key: "versace", name: "Versace", zh: "凡賽斯", domain: "versace.com" },
  {
    key: "ysl",
    name: "Yves Saint Laurent",
    zh: "聖羅蘭",
    aliases: ["YSL", "Saint Laurent"],
    domain: "yslbeauty.com",
  },
];

export function findBrand(key: string | null | undefined): BrandInfo | undefined {
  return key ? BRANDS.find((b) => b.key === key) : undefined;
}

/** Common Taiwanese names for the demo catalogue, keyed by fragrance id. Search aliases only. */
export const FRAGRANCE_ALIASES: Readonly<Record<string, readonly string[]>> = {
  "demo-creed-aventus": ["阿文圖斯", "拿破崙之水"],
  "demo-dior-sauvage": ["曠野之心"],
  "demo-chanel-bleu": ["蔚藍"],
  "demo-jo-malone-wood-sage-sea-salt": ["鼠尾草與海鹽", "鼠尾草海鹽"],
  "demo-le-labo-santal-33": ["檀香33", "檀香木33"],
  "demo-byredo-gypsy-water": ["吉普賽之水"],
  "demo-margiela-lazy-sunday-morning": ["慵懶週日早晨", "慵懶週日"],
  "demo-margiela-by-the-fireplace": ["壁爐火光", "溫暖壁爐"],
  "demo-ysl-black-opium": ["黑鴉片"],
  "demo-diptyque-philosykos": ["希臘無花果"],
  "demo-tom-ford-oud-wood": ["神秘東方"],
  "demo-armani-acqua-di-gio": ["寄情水"],
  "demo-chanel-coco-mademoiselle": ["摩登COCO", "摩登可可"],
  "demo-guerlain-shalimar": ["一千零一夜"],
  "demo-escentric-molecule-01": ["分子01"],
  "demo-hermes-terre-d-hermes": ["大地"],
  "demo-jo-malone-english-pear-freesia": ["英國梨與小蒼蘭", "英國梨"],
  "demo-chanel-no5": ["五號", "No5", "No.5"],
};
