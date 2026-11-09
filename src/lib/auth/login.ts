import { and, eq } from "drizzle-orm";
import { Resend } from "resend";
import { getDb } from "@/db";
import { loginRequests, users } from "@/db/schema";
import {
  LOGIN_EMAIL_LIMIT,
  LOGIN_IP_LIMIT,
  LOGIN_TTL_MS,
  LOGIN_WINDOW_MS,
} from "@/lib/auth/constants";
import { hashToken, randomToken } from "@/lib/auth/crypto";
import { consumeRateLimit } from "@/lib/auth/rate-limit";
import { getAppUrl } from "@/lib/env";

const GENERIC_OK = "Se l'email è autorizzata, riceverai un link di accesso.";

export async function requestMagicLink(emailRaw: string, ip: string) {
  const email = emailRaw.trim().toLowerCase();
  if (!email.includes("@")) {
    return { ok: true as const, message: GENERIC_OK, requestId: null as string | null };
  }

  if (
    !consumeRateLimit(`ip:${ip}`, LOGIN_IP_LIMIT, LOGIN_WINDOW_MS) ||
    !consumeRateLimit(`email:${email}`, LOGIN_EMAIL_LIMIT, LOGIN_WINDOW_MS)
  ) {
    return { ok: true as const, message: GENERIC_OK, requestId: null as string | null };
  }

  const [user] = await getDb()
    .select({ id: users.id, email: users.email, name: users.name })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    return { ok: true as const, message: GENERIC_OK, requestId: crypto.randomUUID() };
  }

  const token = randomToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + LOGIN_TTL_MS);

  const [request] = await getDb()
    .insert(loginRequests)
    .values({
      email,
      tokenHash,
      status: "pending",
      ip,
      expiresAt,
    })
    .returning({ id: loginRequests.id });

  const confirmUrl = `${getAppUrl()}/admin/login/confirm?token=${encodeURIComponent(token)}`;
  await sendLoginEmail(user.email, user.name, confirmUrl);

  return { ok: true as const, message: GENERIC_OK, requestId: request.id };
}

export async function confirmLoginToken(token: string) {
  const tokenHash = hashToken(token);
  const [request] = await getDb()
    .select()
    .from(loginRequests)
    .where(eq(loginRequests.tokenHash, tokenHash))
    .limit(1);

  if (!request) {
    return { ok: false as const, reason: "invalid" };
  }

  if (request.status !== "pending" || request.expiresAt.getTime() < Date.now()) {
    return { ok: false as const, reason: request.status === "pending" ? "expired" : "used" };
  }

  await getDb()
    .update(loginRequests)
    .set({ status: "confirmed", confirmedAt: new Date() })
    .where(
      and(eq(loginRequests.id, request.id), eq(loginRequests.status, "pending")),
    );

  return { ok: true as const };
}

export async function getLoginRequestStatus(requestId: string) {
  const [request] = await getDb()
    .select({
      status: loginRequests.status,
      expiresAt: loginRequests.expiresAt,
    })
    .from(loginRequests)
    .where(eq(loginRequests.id, requestId))
    .limit(1);

  if (!request) return { status: "unknown" as const };
  if (request.status === "pending" && request.expiresAt.getTime() < Date.now()) {
    return { status: "expired" as const };
  }
  return { status: request.status };
}

export async function completeLogin(requestId: string) {
  const [request] = await getDb()
    .select()
    .from(loginRequests)
    .where(eq(loginRequests.id, requestId))
    .limit(1);

  if (!request || request.status !== "confirmed") {
    return { ok: false as const };
  }

  const [user] = await getDb()
    .select()
    .from(users)
    .where(eq(users.email, request.email))
    .limit(1);

  if (!user) return { ok: false as const };

  const updated = await getDb()
    .update(loginRequests)
    .set({ status: "used", usedAt: new Date() })
    .where(
      and(eq(loginRequests.id, request.id), eq(loginRequests.status, "confirmed")),
    )
    .returning({ id: loginRequests.id });

  if (updated.length === 0) return { ok: false as const };

  return { ok: true as const, userId: user.id };
}

async function sendLoginEmail(email: string, name: string, confirmUrl: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[auth] Magic link for ${email}: ${confirmUrl}`);
    return;
  }

  const resend = new Resend(apiKey);
  const from = process.env.AUTH_FROM_EMAIL ?? "Lega Calcio Studenti <onboarding@resend.dev>";
  await resend.emails.send({
    from,
    to: email,
    subject: "Accesso al gestionale LCS",
    html: `<p>Ciao ${name},</p><p>Conferma l'accesso al gestionale aprendo questo link (valido 10 minuti):</p><p><a href="${confirmUrl}">${confirmUrl}</a></p>`,
  });
}
