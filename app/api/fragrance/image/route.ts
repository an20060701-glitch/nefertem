import { findOfficialImage } from "@/lib/fragrance/image";
import { cleanQueryPart } from "@/lib/fragrance/lookup/normalize";

/** GET /api/fragrance/image?brand=Le%20Labo&name=Santal%2033 → { image: OfficialImage | null } */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const brand = cleanQueryPart(params.get("brand"));
  const name = cleanQueryPart(params.get("name"));
  if (!brand || !name) {
    return Response.json({ error: "Provide ?brand= and ?name=" }, { status: 400 });
  }
  const image = await findOfficialImage({ brand, name });
  // No personal data involved: the answer depends only on the query.
  return Response.json({ image }, { headers: { "Cache-Control": "public, max-age=86400" } });
}
