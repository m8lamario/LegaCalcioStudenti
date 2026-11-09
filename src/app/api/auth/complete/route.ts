import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { LOGIN_REQUEST_COOKIE } from "@/lib/auth/constants";
import { completeLogin } from "@/lib/auth/login";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const jar = await cookies();
  const requestId = jar.get(LOGIN_REQUEST_COOKIE)?.value;
  if (!requestId) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const result = await completeLogin(requestId);
  if (!result.ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  await createSession(result.userId);
  jar.delete(LOGIN_REQUEST_COOKIE);
  return NextResponse.redirect(new URL("/admin", request.url));
}
