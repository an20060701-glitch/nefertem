import type { WeatherCondition } from "@/types";
import { CITIES } from "./cities";
import { classify, type WeatherLocation, type WeatherProvider } from "./types";

/** Map OpenWeatherMap condition ids (https://openweathermap.org/weather-conditions). */
function toCondition(id: number): WeatherCondition {
  if (id >= 200 && id < 300) return "storm";
  if (id >= 300 && id < 400) return "drizzle";
  if (id >= 500 && id < 600) return "rain";
  if (id >= 600 && id < 700) return "snow";
  if (id >= 700 && id < 800) return "fog";
  if (id === 800) return "clear";
  return "cloudy";
}

interface OwmResponse {
  name?: string;
  weather?: { id: number }[];
  main?: { temp: number; humidity: number };
}

export function createOpenWeatherMapProvider(apiKey: string): WeatherProvider {
  return {
    name: "openweathermap",
    async getWeather(location: WeatherLocation) {
      const coords = "city" in location ? CITIES[location.city] : location;
      const url = new URL("https://api.openweathermap.org/data/2.5/weather");
      url.searchParams.set("lat", String(coords.lat));
      url.searchParams.set("lon", String(coords.lon));
      url.searchParams.set("units", "metric");
      url.searchParams.set("appid", apiKey);

      const response = await fetch(url, {
        next: { revalidate: 1800 },
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) throw new Error(`OpenWeatherMap responded ${response.status}`);
      const data = (await response.json()) as OwmResponse;
      if (!data.main || !data.weather?.[0]) throw new Error("OpenWeatherMap returned no weather");

      return classify({
        city: ("city" in location ? CITIES[location.city].en : data.name?.toUpperCase()) || "YOUR CITY",
        temperature: data.main.temp,
        humidity: data.main.humidity,
        condition: toCondition(data.weather[0].id),
        source: "openweathermap",
      });
    },
  };
}
