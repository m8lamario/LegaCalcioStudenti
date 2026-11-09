export type CityScopedUser = {
  role: "admin" | "staff_citta" | "refertista";
  cityIds: string[];
};

export function canAccessCity(user: CityScopedUser, cityId?: string | null) {
  if (user.role === "admin") return true;
  if (!cityId) return false;
  return user.cityIds.includes(cityId);
}

export function canManageMatches(user: CityScopedUser, cityId?: string | null) {
  if (user.role === "admin") return true;
  if (!cityId) return false;
  return user.cityIds.includes(cityId);
}

export function canManageContent(user: CityScopedUser, cityId?: string | null) {
  if (user.role === "admin") return true;
  if (user.role === "refertista") return false;
  if (!cityId) return false;
  return user.cityIds.includes(cityId);
}
