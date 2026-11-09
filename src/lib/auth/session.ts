import { cookies } from "next/headers";
import { and, eq, gt } from "drizzle-orm";
import { getDb } from "@/db";
import { sessions, userCities, users } from "@/db/schema";
import {
  SESSION_COOKIE,
  SESSION_TTL_MS,
} from "@/lib/auth/constants";
import { hashToken, randomToken } from "@/lib/auth/crypto";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "staff_citta" | "refertista";
  cityIds: string[];
};

export function sessionCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export async function createSession(userId: string) {
  const token = randomToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await getDb().insert(sessions).values({ userId, tokenHash, expiresAt });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, sessionCookieOptions(Math.floor(SESSION_TTL_MS / 1000)));
  return token;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await getDb().delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
  }
  jar.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);
  const [row] = await getDb()
    .select({
      sessionId: sessions.id,
      expiresAt: sessions.expiresAt,
      user: users,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, new Date())))
    .limit(1);

  if (!row) return null;

  const cityRows = await getDb()
    .select({ cityId: userCities.cityId })
    .from(userCities)
    .where(eq(userCities.userId, row.user.id));

  return {
    id: row.user.id,
    email: row.user.email,
    name: row.user.name,
    role: row.user.role,
    cityIds: cityRows.map((item) => item.cityId),
  };
}

export function canAccessCity(user: SessionUser, cityId?: string | null) {
  if (user.role === "admin") return true;
  if (!cityId) return false;
  return user.cityIds.includes(cityId);
}

export function canManageMatches(user: SessionUser, cityId?: string | null) {
  if (user.role === "admin") return true;
  if (!cityId) return false;
  return user.cityIds.includes(cityId);
}

export function canManageContent(user: SessionUser, cityId?: string | null) {
  if (user.role === "admin") return true;
  if (user.role === "refertista") return false;
  if (!cityId) return false;
  return user.cityIds.includes(cityId);
}
