import "server-only";

import type { WeatherSnapshot } from "@/types";
import { mockProvider } from "./mock";
import { createOpenWeatherMapProvider } from "./openweathermap";
import type { WeatherLocation, WeatherProvider } from "./types";

function configuredProvider(): WeatherProvider {
  const key = process.env.OPENWEATHER_API_KEY;
  if (process.env.WEATHER_PROVIDER === "openweathermap" && key) return createOpenWeatherMapProvider(key);
  // The CWA provider is planned (architecture §6.2); until then CWA config falls back to mock.
  return mockProvider;
}

/**
 * Today's weather for a place. Never throws: if the real provider fails,
 * mock weather keeps the ritual usable, and `source` tells the UI so.
 */
export async function getWeather(location: WeatherLocation): Promise<WeatherSnapshot> {
  const provider = configuredProvider();
  try {
    return await provider.getWeather(location);
  } catch (error) {
    console.error(`[weather] ${provider.name} failed, using mock`, error);
    return mockProvider.getWeather(location);
  }
}

export type { WeatherLocation } from "./types";
