import { parseEnv } from "@neon/env";
import config from "../../neon";

export function getDatabaseUrl() {
  const { postgres } = parseEnv(config, ["DATABASE_URL"]);
  return postgres.databaseUrl;
}

export function getDatabaseUrlUnpooled() {
  const { postgres } = parseEnv(config, ["DATABASE_URL_UNPOOLED"]);
  return postgres.databaseUrlUnpooled;
}

export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not set");
  }
  return secret;
}

export function getAppUrl() {
  return (
    process.env.AUTH_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")
  );
}
