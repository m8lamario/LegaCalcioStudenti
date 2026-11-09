import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { matchExists } from "@/lib/queries/cup";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/partite/")) {
    const id = pathname.slice("/partite/".length).split("/").filter(Boolean)[0];
    if (!id) {
      return NextResponse.redirect(new URL("/#competizioni", request.url), 301);
    }
    try {
      const exists = await matchExists(id);
      if (!exists) {
        return NextResponse.redirect(new URL("/#competizioni", request.url), 301);
      }
    } catch {
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE)?.value;
  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/partite/:path*"],
};
