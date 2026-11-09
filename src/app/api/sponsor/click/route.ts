import { connection } from "next/server";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { sponsorClicks } from "@/db/schema";
import { getSponsorSlotById } from "@/lib/queries/sponsors";
import { isUuid } from "@/lib/slug";

export async function GET(request: Request) {
  await connection();
  const id = new URL(request.url).searchParams.get("id") ?? "";
  const fallback = new URL("/", request.url);
  if (!isUuid(id)) {
    return NextResponse.redirect(fallback, 302);
  }
  const slot = await getSponsorSlotById(id);
  if (!slot?.href) {
    return NextResponse.redirect(fallback, 302);
  }
  await getDb().insert(sponsorClicks).values({
    slotId: slot.slotId,
    sponsorId: slot.sponsorId,
  });
  const target = /^https?:\/\//i.test(slot.href)
    ? slot.href
    : new URL(slot.href, request.url).toString();
  return NextResponse.redirect(target, 302);
}
