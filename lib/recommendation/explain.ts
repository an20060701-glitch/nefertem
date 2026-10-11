import { noteLabel } from "@/data/notes";
import { cityLabel } from "@/lib/weather/cities";
import type { Feeling, FragranceFamily, Scene, WeatherSnapshot } from "@/types";
import type { Recommendation } from "./engine";
import { guideNotes } from "./engine";
import { FAVOURITE_MIN_USES } from "./rules";
import { feelingInfo, sceneInfo, WEATHER_BUCKETS, weatherBucket } from "./scenes";

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

/** The two families of this scent that best answer today's feeling. */
function familyPhrase(rec: Recommendation, feeling: Feeling): string {
  const { family, subFamilies = [] } = rec.fragrance;
  const weights = feelingInfo(feeling).families;
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
  /** 使用提醒 from the guide, for the place or else the weather. */
  tip?: string;
}

/** "為什麼推薦給你？" — template sentences from the strongest parts of the score. */
export function explain(
  rec: Recommendation,
  context: { weather: WeatherSnapshot; scene: Scene; feeling: Feeling },
): Explanation {
  const { weather, scene, feeling } = context;
  const place = sceneInfo(scene);
  const bucket = WEATHER_BUCKETS[weatherBucket(weather)];
  const where = `今天${weather.place ?? cityLabel(weather.city)} ${Math.round(weather.temperature)}°C，${bucket.zh}`;
  const lead = `${where}，要去${place.zh}、想呈現「${feelingInfo(feeling).zh}」，讓帶有${familyPhrase(rec, feeling)}氣息的 ${rec.fragrance.name} 成為更適合你的選擇。`;

  const details: string[] = [];
  if (rec.favourite || (rec.usageCount >= FAVOURITE_MIN_USES && rec.scores.usageFrequency >= 0.8)) {
    details.push("這也是你最近最常使用的香氣。");
  }
  const notes = guideNotes(rec.fragrance, scene, weather).slice(0, 2);
  if (notes.length > 0) {
    const forPlace = notes.some((n) => place.notes.includes(n));
    details.push(
      `它的${notes.map(noteLabel).join("與")}，${forPlace ? `正是${place.zh}時合適的香材` : `正適合${bucket.zh}的天氣`}。`,
    );
  } else {
    const heart = rec.fragrance.heartNotes.slice(0, 2).map(noteLabel).join("與");
    if (heart) details.push(`${heart}在中調慢慢展開，是它今天最動人的部分。`);
  }
  return { lead, details: details.slice(0, 2), tip: place.tip ?? bucket.tip };
}
