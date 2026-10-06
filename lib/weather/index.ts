import "server-only";

import type { WeatherSnapshot } from "@/types";
import { mockProvider } from "./mock";
import { openMeteoProvider } from "./openmeteo";
import { createOpenWeatherMapProvider } from "./openweathermap";
import type { WeatherLocation, WeatherProvider } from "./types";

function configuredProvider(): WeatherProvider {
  const key = process.env.OPENWEATHER_API_KEY;
  const choice = process.env.WEATHER_PROVIDER;
  if (choice === "openweathermap" && key) return createOpenWeatherMapProvider(key);
  if (choice === "mock") return mockProvider;
  // Open-Meteo needs no key, so it is the default (CWA is still planned, architecture §6.2).
  return openMeteoProvider;
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
