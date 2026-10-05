import type { Mood, Occasion } from "./fragrance";
import type { WeatherCondition } from "./weather";

export interface UsageLog {
  id: string;
  fragranceId: string;
  timestamp: number;
  weather: WeatherCondition;
  temperature: number;
  city: string;
  occasion: Occasion;
  mood: Mood[];
  viaWheel: boolean;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: number;
  lastLoginAt: number;
}
