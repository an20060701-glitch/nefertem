import { noteLabel } from "@/data/notes";
import { cityLabel } from "@/lib/weather/cities";
import { MOODS } from "@/lib/fragrance/families";
import type { FragranceFamily, Mood, Occasion, WeatherSnapshot } from "@/types";
import type { Recommendation } from "./engine";
import { moodWeights } from "./engine";
import { FAVOURITE_MIN_USES } from "./rules";

/** Families as they read in a sentence ("帶有琥珀與木質氣息"). */
const FAMILY_PROSE: Record<FragranceFamily, string> = {
  citrus: "柑橘",
  fresh: "綠意",
  marine: "海洋",
  floral: "花香",
  fruity: "果香",
  fougere: "芳香草本",
  chypre: "柑苔",
  woody: "木質",
  amber: "琥珀",
  gourmand: "香甜",
  spicy: "辛香",
  musky: "麝香",
  leather: "皮革煙燻",
  mineral: "礦物",
  avantgarde: "前衛分子",
};

function weatherPhrase(w: WeatherSnapshot): string {
  if (w.isRainy) return "潮濕的雨天";
  if (w.isHot) return "炎熱的天氣";
  if (w.isCold) return "微涼的天氣";
  if (w.condition === "fog") return "起霧的早晨";
  if (w.condition === "cloudy") return "溫和的陰天";
  return "晴朗舒適的天氣";
}

function moodPhrase(moods: Mood[]): string {
  return moods.map((m) => `「${MOODS.find((d) => d.key === m)?.zh ?? m}」`).join("與");
}

/** The two families of this scent that best answer today's moods. */
function familyPhrase(rec: Recommendation, moods: Mood[]): string {
  const { family, subFamilies = [] } = rec.fragrance;
  const weights = moodWeights(moods);
  const ranked = [family, ...subFamilies]
    .map((f, i) => ({ f, w: (weights[f] ?? 0) * (i === 0 ? 1 : 0.6), i }))
    .sort((a, b) => b.w - a.w || a.i - b.i)
    .filter(({ w }, i) => i === 0 || w > 0)
    .slice(0, 2)
    .map(({ f }) => FAMILY_PROSE[f]);
  return ranked.join("與");
}

export interface Explanation {
  /** Main sentence, always present. */
  lead: string;
  /** Supporting sentences, at most two. */
  details: string[];
}

/** "為什麼推薦給你？" — template sentences from the strongest parts of the score. */
export function explain(
  rec: Recommendation,
  context: { weather: WeatherSnapshot; occasion: Occasion; moods: Mood[] },
): Explanation {
  const { weather, occasion, moods } = context;
  const where = `今天${cityLabel(weather.city)} ${Math.round(weather.temperature)}°C ${weatherPhrase(weather)}`;
  const families = familyPhrase(rec, moods);
  const lead =
    moods.length > 0
      ? `${where}，加上你選擇的${moodPhrase(moods)}印象，讓帶有${families}氣息的 ${rec.fragrance.name} 成為更適合你的選擇。`
      : `${where}，帶有${families}氣息的 ${rec.fragrance.name} 是今天最自在的選擇。`;

  const details: string[] = [];
  if (rec.favourite || (rec.usageCount >= FAVOURITE_MIN_USES && rec.scores.usageFrequency >= 0.8)) {
    details.push("這也是你最近最常使用的香氣。");
  }
  if (rec.scores.occasion >= 0.75) {
    details.push(
      occasion === "indoor"
        ? "在涼爽的室內，它貼近肌膚，不會打擾身邊的人。"
        : "在戶外，它會隨著風輕輕散開，清爽而不厚重。",
    );
  } else if (rec.scores.temperature >= 0.75) {
    details.push(weather.isHot ? "它在高溫裡依然輕盈，不會變得悶重。" : "它在低溫裡更顯溫潤，留香也更貼身。");
  }
  if (details.length < 2 && rec.scores.weather >= 0.75) {
    details.push("雨天的濕氣會讓木質與樹脂的尾韻更圓潤。");
  }
  if (details.length === 0) {
    const heart = rec.fragrance.heartNotes.slice(0, 2).map(noteLabel).join("與");
    if (heart) details.push(`${heart}在中調慢慢展開，是它今天最動人的部分。`);
  }
  return { lead, details: details.slice(0, 2) };
}
