import { afterEach, describe, expect, it, vi } from "vitest";
import { openMeteoProvider, toCondition } from "./openmeteo";

function respond(body: unknown, ok = true) {
  return Promise.resolve({ ok, status: ok ? 200 : 503, json: () => Promise.resolve(body) } as Response);
}

afterEach(() => vi.unstubAllGlobals());

describe("toCondition", () => {
  it("maps WMO codes", () => {
    expect([0, 1, 2, 3, 45, 53, 63, 81, 73, 95].map(toCondition)).toEqual([
      "clear",
      "clear",
      "cloudy",
      "cloudy",
      "fog",
      "drizzle",
      "rain",
      "rain",
      "snow",
      "storm",
    ]);
  });
});

describe("openMeteoProvider", () => {
  it("returns local weather with the place name for coordinates", async () => {
    const fetchMock = vi.fn((url: URL) =>
      url.hostname === "nominatim.openstreetmap.org"
        ? respond({ name: "大安區", namedetails: { "name:en": "Da'an District", "name:zh-Hant": "大安區" } })
        : respond({ current: { temperature_2m: 27.4, relative_humidity_2m: 81, weather_code: 61 } }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const weather = await openMeteoProvider.getWeather({ lat: 25.03, lon: 121.54 });
    expect(weather).toMatchObject({
      city: "DA'AN DISTRICT",
      place: "大安區",
      temperature: 27,
      humidity: 81,
      condition: "rain",
      isRainy: true,
      isHot: true,
      source: "open-meteo",
    });
    const forecast = fetchMock.mock.calls.map(([u]) => u).find((u) => u.hostname === "api.open-meteo.com");
    expect(forecast?.searchParams.get("latitude")).toBe("25.03");
  });

  it("still returns weather when the place lookup fails", async () => {
    vi.stubGlobal("fetch", (url: URL) =>
      url.hostname === "nominatim.openstreetmap.org"
        ? Promise.reject(new Error("offline"))
        : respond({ current: { temperature_2m: 15, relative_humidity_2m: 60, weather_code: 0 } }),
    );
    const weather = await openMeteoProvider.getWeather({ lat: 24.1, lon: 120.6 });
    expect(weather.city).toBe("YOUR LOCATION");
    expect(weather.place).toBeUndefined();
    expect(weather.isCold).toBe(true);
  });

  it("uses the default city names without a place lookup", async () => {
    const fetchMock = vi.fn(() => respond({ current: { temperature_2m: 22, weather_code: 2 } }));
    vi.stubGlobal("fetch", fetchMock);
    const weather = await openMeteoProvider.getWeather({ city: "tainan" });
    expect(weather).toMatchObject({ city: "TAINAN", place: "台南", condition: "cloudy" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("throws when the forecast fails, so getWeather can fall back", async () => {
    vi.stubGlobal("fetch", () => respond({}, false));
    await expect(openMeteoProvider.getWeather({ city: "taipei" })).rejects.toThrow("503");
  });
});
