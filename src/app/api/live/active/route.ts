import { NextResponse } from "next/server";
import { getLiveActive } from "@/lib/live/snapshot";

const CACHE = "public, s-maxage=4, stale-while-revalidate=8";

export async function GET() {
  const matches = await getLiveActive();
  return NextResponse.json(
    { matches, serverNow: Date.now() },
    {
      headers: {
        "Cache-Control": CACHE,
        "CDN-Cache-Control": CACHE,
      },
    },
  );
}
