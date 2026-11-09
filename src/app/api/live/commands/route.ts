import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { applyLiveCommand } from "@/lib/live/commands";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const result = await applyLiveCommand(user, body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({
      ok: true,
      duplicate: result.duplicate,
      snapshot: result.snapshot,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "payload_non_valido" }, { status: 400 });
    }
    return NextResponse.json({ error: "comando_fallito" }, { status: 500 });
  }
}
