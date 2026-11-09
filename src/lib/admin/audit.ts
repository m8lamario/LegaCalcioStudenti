import { getDb } from "@/db";
import { auditLog } from "@/db/schema";

export async function writeAudit(input: {
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  summary: string;
}) {
  await getDb().insert(auditLog).values(input);
}
