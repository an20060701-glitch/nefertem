import { getWeather, type WeatherLocation } from "@/lib/weather";
import { isCityKey } from "@/lib/weather/cities";

/** GET /api/weather?city=taipei  or  ?lat=25.03&lon=121.56 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const city = params.get("city");
  const lat = Number(params.get("lat"));
  const lon = Number(params.get("lon"));

  let location: WeatherLocation;
  if (isCityKey(city)) {
    location = { city };
  } else if (Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
    // Round to ~1 km: enough for weather, and we never need the exact position.
    location = { lat: Math.round(lat * 100) / 100, lon: Math.round(lon * 100) / 100 };
  } else {
    return Response.json({ error: "Provide ?city= or ?lat=&lon=" }, { status: 400 });
  }

  const weather = await getWeather(location);
  return Response.json(weather, { headers: { "Cache-Control": "private, max-age=600" } });
}
