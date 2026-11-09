import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { LOGIN_REQUEST_COOKIE } from "@/lib/auth/constants";
import { getLoginRequestStatus } from "@/lib/auth/login";

export async function GET() {
  const jar = await cookies();
  const requestId = jar.get(LOGIN_REQUEST_COOKIE)?.value;
  if (!requestId) {
    return NextResponse.json({ status: "unknown" });
  }
  const result = await getLoginRequestStatus(requestId);
  return NextResponse.json(result);
}
