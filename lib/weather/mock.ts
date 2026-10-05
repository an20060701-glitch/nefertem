import type { CityKey, WeatherCondition } from "@/types";
import { CITIES, nearestCity } from "./cities";
import { classify, type WeatherLocation, type WeatherProvider } from "./types";

/*
 * Plausible Taiwanese weather by month, so the site works with no API key.
 * Deterministic per city and day: the same visitor sees the same "today".
 */
const MONTHLY_MEAN_C = [16, 17, 19, 23, 26, 28, 30, 30, 28, 25, 22, 18];
const MONTHLY_RAIN_CHANCE = [0.3, 0.35, 0.35, 0.4, 0.5, 0.6, 0.45, 0.5, 0.45, 0.3, 0.3, 0.3];
const SOUTH_OFFSET: Partial<Record<CityKey, number>> = { kaohsiung: 2, tainan: 1.5, taichung: 0.5 };

function seeded(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function mockWeather(city: CityKey, date = new Date()) {
  const month = date.getMonth();
  const daySeed = date.getFullYear() * 1000 + month * 40 + date.getDate() + city.length * 7;
  const rain = seeded(daySeed) < MONTHLY_RAIN_CHANCE[month];
  const condition: WeatherCondition = rain ? "rain" : seeded(daySeed + 1) < 0.5 ? "clear" : "cloudy";
  const temperature =
    MONTHLY_MEAN_C[month] + (SOUTH_OFFSET[city] ?? 0) + (seeded(daySeed + 2) - 0.5) * 4 - (rain ? 1.5 : 0);
  return classify({
    city: CITIES[city].en,
    temperature,
    condition,
    humidity: rain ? 85 : 65 + seeded(daySeed + 3) * 15,
    source: "mock",
  });
}

export const mockProvider: WeatherProvider = {
  name: "mock",
  async getWeather(location: WeatherLocation) {
    const city = "city" in location ? location.city : nearestCity(location.lat, location.lon);
    return mockWeather(city);
  },
};
