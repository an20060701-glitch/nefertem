import type { CityKey, WeatherCondition, WeatherSnapshot } from "@/types";

export type WeatherLocation = { lat: number; lon: number } | { city: CityKey };

/** Weather providers live behind this interface so the UI never calls an API directly. */
export interface WeatherProvider {
  name: WeatherSnapshot["source"];
  getWeather(location: WeatherLocation): Promise<WeatherSnapshot>;
}

export const HOT_AT = 26;
export const COLD_AT = 18;

const RAINY: WeatherCondition[] = ["drizzle", "rain", "storm"];

/** Derive the boolean flags the recommendation engine uses. */
export function classify(base: Omit<WeatherSnapshot, "isRainy" | "isHot" | "isCold">): WeatherSnapshot {
  return {
    ...base,
    temperature: Math.round(base.temperature),
    humidity: Math.round(base.humidity),
    isRainy: RAINY.includes(base.condition),
    isHot: base.temperature >= HOT_AT,
    isCold: base.temperature <= COLD_AT,
  };
}
