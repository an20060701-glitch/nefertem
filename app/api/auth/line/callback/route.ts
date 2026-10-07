import { NextResponse, type NextRequest } from "next/server";
import { loginHref, safeNext } from "@/lib/account";
import { firebaseTokenFor, identify, LINE_COOKIE, lineConfig, type PendingLogin } from "@/lib/line/server";

function readPending(raw: string | undefined): PendingLogin | null {
  try {
    const value = JSON.parse(raw ?? "") as Partial<PendingLogin>;
    return typeof value.state === "string" && typeof value.nonce === "string"
      ? { state: value.state, nonce: value.nonce, next: safeNext(value.next) }
      : null;
  } catch {
    return null;
  }
}

/**
 * GET /api/auth/line/callback?code&state — LINE sends the visitor back here,
 * possibly in a new tab. The Firebase sign-in token travels in the URL
 * fragment, which never reaches a server or a log.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const pending = readPending(request.cookies.get(LINE_COOKIE)?.value);
  const config = lineConfig();
  const fail = (next = pending?.next) => {
    const response = NextResponse.redirect(new URL(`${loginHref(next)}&error=line`, request.url));
    response.cookies.delete({ name: LINE_COOKIE, path: "/api/auth/line" });
    return response;
  };

  const code = params.get("code");
  if (!config || !pending || !code || params.get("state") !== pending.state) return fail();

  try {
    const identity = await identify(config, request.nextUrl.origin, code, pending.nonce);
    const fragment = new URLSearchParams({
      token: firebaseTokenFor(config, identity.sub),
      next: pending.next,
    });
    if (identity.name) fragment.set("name", identity.name.slice(0, 80));
    const response = NextResponse.redirect(new URL(`/login/line#${fragment}`, request.url));
    response.cookies.delete({ name: LINE_COOKIE, path: "/api/auth/line" });
    return response;
  } catch (error) {
    console.error("[line] sign-in failed", error);
    return fail();
  }
}
