import { redirect } from "next/navigation";
import { getCurrentUser, type SessionUser } from "@/lib/auth/session";

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}

export function assertCityAccess(user: SessionUser, cityId?: string | null) {
  if (user.role === "admin") return;
  if (!cityId || !user.cityIds.includes(cityId)) {
    throw new Error("Non hai i permessi per questa città.");
  }
}

export function assertContentAccess(user: SessionUser, cityId?: string | null) {
  if (user.role === "refertista") {
    throw new Error("Il ruolo refertista può aggiornare solo le partite.");
  }
  assertCityAccess(user, cityId);
}

export function assertAdmin(user: SessionUser) {
  if (user.role !== "admin") {
    throw new Error("Solo gli amministratori possono eseguire questa azione.");
  }
}
