import { lookupFragrance } from "@/lib/fragrance/lookup";
import { cleanQueryPart } from "@/lib/fragrance/lookup/normalize";

/** GET /api/fragrance/lookup?brand=Creed&name=Aventus → { result: FragranceLookupResult | null } */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const brand = cleanQueryPart(params.get("brand"));
  const name = cleanQueryPart(params.get("name"));
  if (!brand || !name) {
    return Response.json({ error: "Provide ?brand= and ?name=" }, { status: 400 });
  }
  const result = await lookupFragrance({ brand, name });
  // No personal data involved: the answer depends only on the query.
  return Response.json({ result }, { headers: { "Cache-Control": "public, max-age=3600" } });
}
