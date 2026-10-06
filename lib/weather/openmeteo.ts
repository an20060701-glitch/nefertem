import type { WeatherCondition } from "@/types";
import { CITIES } from "./cities";
import { classify, type WeatherLocation, type WeatherProvider } from "./types";

/*
 * Open-Meteo (https://open-meteo.com): a free forecast API with no key, so real
 * weather works out of the box. Place names come from OpenStreetMap's Nominatim,
 * asked once per ~1 km cell and cached for a day, per its usage policy.
 */
const FORECAST = "https://api.open-meteo.com/v1/forecast";
const REVERSE = "https://nominatim.openstreetmap.org/reverse";
const USER_AGENT = "Nefertem/1.0 (+https://github.com/an20060701-glitch/nefertem)";

/** WMO weather interpretation codes (https://open-meteo.com/en/docs). */
export function toCondition(code: number): WeatherCondition {
  if (code >= 95) return "storm";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if (code >= 51 && code <= 57) return "drizzle";
  if (code === 45 || code === 48) return "fog";
  if (code <= 1) return "clear";
  return "cloudy";
}

interface ForecastResponse {
  current?: { temperature_2m?: number; relative_humidity_2m?: number; weather_code?: number };
}

interface ReverseResponse {
  name?: string;
  namedetails?: Record<string, string>;
  address?: Record<string, string>;
}

/** The place's English and Chinese names, or nothing if the lookup fails. */
export async function placeName(lat: number, lon: number): Promise<{ en?: string; zh?: string }> {
  try {
    const url = new URL(REVERSE);
    url.searchParams.set("lat", String(lat));
    url.searchParams.set("lon", String(lon));
    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("zoom", "10");
    url.searchParams.set("namedetails", "1");
    url.searchParams.set("accept-language", "zh-TW");
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      next: { revalidate: 86400 },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return {};
    const data = (await response.json()) as ReverseResponse;
    const names = data.namedetails ?? {};
    const zh = names["name:zh-Hant"] ?? names["name:zh-TW"] ?? names["name:zh"] ?? data.name;
    return { en: names["name:en"], zh };
  } catch {
    return {};
  }
}

export const openMeteoProvider: WeatherProvider = {
  name: "open-meteo",
  async getWeather(location: WeatherLocation) {
    const coords = "city" in location ? CITIES[location.city] : location;
    const url = new URL(FORECAST);
    url.searchParams.set("latitude", String(coords.lat));
    url.searchParams.set("longitude", String(coords.lon));
    url.searchParams.set("current", "temperature_2m,relative_humidity_2m,weather_code");
    url.searchParams.set("timezone", "auto");

    const lookup: Promise<{ en?: string; zh?: string }> =
      "city" in location ? Promise.resolve({}) : placeName(location.lat, location.lon);
    const [response, named] = await Promise.all([
      fetch(url, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(5000) }),
      lookup,
    ]);
    if (!response.ok) throw new Error(`Open-Meteo responded ${response.status}`);
    const current = ((await response.json()) as ForecastResponse).current;
    if (current?.temperature_2m === undefined || current.weather_code === undefined)
      throw new Error("Open-Meteo returned no current weather");

    return classify({
      city: "city" in location ? CITIES[location.city].en : named.en?.toUpperCase() || "YOUR LOCATION",
      place: "city" in location ? CITIES[location.city].zh : named.zh,
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m ?? 70,
      condition: toCondition(current.weather_code),
      source: "open-meteo",
    });
  },
};
