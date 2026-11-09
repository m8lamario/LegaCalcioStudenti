import { createHash, randomBytes } from "node:crypto";
import { getAuthSecret } from "@/lib/env";

export function randomToken() {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string) {
  return createHash("sha256")
    .update(`${getAuthSecret()}:${token}`)
    .digest("hex");
}
