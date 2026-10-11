import type { Feeling, Mood, Occasion, Scene } from "./fragrance";
import type { WeatherCondition } from "./weather";

export interface UsageLog {
  id: string;
  fragranceId: string;
  timestamp: number;
  weather: WeatherCondition;
  temperature: number;
  city: string;
  scene?: Scene;
  feeling?: Feeling;
  /** Answers asked before the scene guide (2026-10-11); older logs carry these instead. */
  occasion?: Occasion;
  mood?: Mood[];
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
