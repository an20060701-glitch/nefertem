import type { CityKey } from "@/types";

/** Default cities offered when location is denied or unavailable. */
export const CITIES: Record<CityKey, { zh: string; en: string; lat: number; lon: number }> = {
  taipei: { zh: "台北", en: "TAIPEI", lat: 25.033, lon: 121.565 },
  taichung: { zh: "台中", en: "TAICHUNG", lat: 24.148, lon: 120.674 },
  kaohsiung: { zh: "高雄", en: "KAOHSIUNG", lat: 22.627, lon: 120.301 },
  tainan: { zh: "台南", en: "TAINAN", lat: 22.999, lon: 120.227 },
  hsinchu: { zh: "新竹", en: "HSINCHU", lat: 24.804, lon: 120.971 },
};

export const CITY_KEYS = Object.keys(CITIES) as CityKey[];

export function isCityKey(value: unknown): value is CityKey {
  return typeof value === "string" && value in CITIES;
}

/** Nearest default city to a coordinate — used to label mock weather. */
export function nearestCity(lat: number, lon: number): CityKey {
  let best: CityKey = "taipei";
  let bestDistance = Infinity;
  for (const key of CITY_KEYS) {
    const c = CITIES[key];
    const d = (c.lat - lat) ** 2 + (c.lon - lon) ** 2;
    if (d < bestDistance) {
      bestDistance = d;
      best = key;
    }
  }
  return best;
}

/** Chinese name for a city key or a provider's English name ("TAIPEI" → 台北); otherwise the name as given. */
export function cityLabel(name: string): string {
  if (isCityKey(name)) return CITIES[name].zh;
  const match = CITY_KEYS.find((key) => CITIES[key].en === name.toUpperCase());
  return match ? CITIES[match].zh : name;
}
