import { adminConfig, isAdmin, loadStats, verifyIdToken } from "@/lib/admin/stats";

/** GET /api/admin/stats with `Authorization: Bearer <Firebase ID token>`; only for ADMIN_EMAILS. */
export async function GET(request: Request) {
  const noStore = { "Cache-Control": "no-store" };
  const config = adminConfig();
  if (!config) return Response.json({ error: "not-configured" }, { status: 503, headers: noStore });

  const idToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const user = idToken ? await verifyIdToken(config, idToken) : null;
  if (!user) return Response.json({ error: "signed-out" }, { status: 401, headers: noStore });
  if (!isAdmin(user)) return Response.json({ error: "forbidden" }, { status: 403, headers: noStore });

  try {
    return Response.json(await loadStats(config), { headers: noStore });
  } catch (error) {
    console.error("admin stats", error);
    return Response.json({ error: "failed" }, { status: 502, headers: noStore });
  }
}
