import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { competitions } from "@/db/schema";

export async function GET() {
  const db = getDb();
  const ping = await db.execute(sql`select 1 as ok`);
  const rows = await db.select({ slug: competitions.slug }).from(competitions);
  return NextResponse.json({
    ok: true,
    ping: ping.rows[0],
    competitions: rows.map((row) => row.slug),
  });
}
