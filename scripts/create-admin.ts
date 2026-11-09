import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/db/schema";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL_UNPOOLED or DATABASE_URL is required");
}

const email = process.argv[2]?.trim().toLowerCase();
const name = process.argv[3]?.trim() || "Admin";

if (!email || !email.includes("@")) {
  console.error("Usage: npx tsx scripts/create-admin.ts <email> [name]");
  process.exit(1);
}

async function main() {
  const pool = new Pool({ connectionString: url, max: 1 });
  const db = drizzle({ client: pool, schema });

  const [existing] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (existing) {
    await db
      .update(schema.users)
      .set({ name, role: "admin", updatedAt: new Date() })
      .where(eq(schema.users.id, existing.id));
    console.log(`Updated existing user ${email} to admin.`);
  } else {
    await db.insert(schema.users).values({ email, name, role: "admin" });
    console.log(`Created admin ${email}.`);
  }

  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
