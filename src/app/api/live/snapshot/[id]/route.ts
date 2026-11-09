import { NextResponse } from "next/server";
import { getLiveSnapshot } from "@/lib/live/snapshot";

const CACHE = "public, s-maxage=4, stale-while-revalidate=8";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const snapshot = await getLiveSnapshot(id);
  if (!snapshot) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json(snapshot, {
    headers: {
      "Cache-Control": CACHE,
      "CDN-Cache-Control": CACHE,
    },
  });
}
