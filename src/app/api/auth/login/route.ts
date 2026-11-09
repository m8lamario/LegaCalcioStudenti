import { NextResponse } from "next/server";
import { LOGIN_REQUEST_COOKIE, LOGIN_TTL_MS } from "@/lib/auth/constants";
import { requestMagicLink } from "@/lib/auth/login";
import { sessionCookieOptions } from "@/lib/auth/session";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "");
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const result = await requestMagicLink(email, ip);
  const response = NextResponse.redirect(new URL("/admin/login?sent=1", request.url));

  if (result.requestId) {
    response.cookies.set(
      LOGIN_REQUEST_COOKIE,
      result.requestId,
      sessionCookieOptions(Math.floor(LOGIN_TTL_MS / 1000)),
    );
  }

  return response;
}
