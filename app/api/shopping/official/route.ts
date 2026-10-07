import { findBrand } from "@/data/brands";
import { cleanKeyword } from "@/lib/shopping/links";
import { findOfficial } from "@/lib/shopping/official";

/** GET /api/shopping/official?brand=chanel&name=Bleu%20de%20Chanel — the brand's own site for a scent. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const brand = findBrand(params.get("brand"));
  if (!brand) return Response.json({ error: "Unknown brand" }, { status: 400 });
  const name = cleanKeyword(params.get("name") ?? "") || undefined;
  const id = /^[a-z0-9-]{1,100}$/.test(params.get("id") ?? "") ? params.get("id")! : undefined;
  const conc = params.get("concentration");
  const concentration = conc && /^(EDP|EDT|EDC|Parfum|Extrait)$/.test(conc) ? conc : undefined;

  const link = await findOfficial({ brandKey: brand.key, name, id, concentration });
  return Response.json({ link }, { headers: { "Cache-Control": "public, max-age=3600" } });
}
