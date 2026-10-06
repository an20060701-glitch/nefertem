import { NextResponse, type NextRequest } from "next/server";
import { loginHref, safeNext } from "@/lib/account";
import { authorizeUrl, LINE_COOKIE, lineConfig, newPendingLogin } from "@/lib/line/server";

/** GET /api/auth/line/start?next=/choice → LINE's consent screen. */
export function GET(request: NextRequest) {
  const next = safeNext(request.nextUrl.searchParams.get("next"));
  const config = lineConfig();
  if (!config) return NextResponse.redirect(new URL(`${loginHref(next)}&error=line`, request.url));

  const pending = newPendingLogin(next);
  const response = NextResponse.redirect(authorizeUrl(config.channelId, request.nextUrl.origin, pending));
  response.cookies.set(LINE_COOKIE, JSON.stringify(pending), {
    httpOnly: true,
    secure: request.nextUrl.protocol === "https:",
    sameSite: "lax",
    path: "/api/auth/line",
    maxAge: 600,
  });
  return response;
}
