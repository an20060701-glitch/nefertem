export type WeatherCondition = "clear" | "cloudy" | "fog" | "drizzle" | "rain" | "storm" | "snow";

export type CityKey = "taipei" | "taichung" | "kaohsiung" | "tainan" | "hsinchu";

export interface WeatherSnapshot {
  city: string;
  temperature: number;
  condition: WeatherCondition;
  humidity: number;
  isRainy: boolean;
  /** ≥ 26°C */
  isHot: boolean;
  /** ≤ 18°C */
  isCold: boolean;
  source: "openweathermap" | "cwa" | "mock";
}
