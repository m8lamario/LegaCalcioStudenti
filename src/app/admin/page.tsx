import Link from "next/link";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { auditLog, competitions, matches, posts, users } from "@/db/schema";
import { requireUser } from "@/lib/auth/guards";
import { AdminRoute } from "./AdminRoute";
import styles from "./admin.module.css";

export default function AdminHomePage() {
  return (
    <AdminRoute>
      <Content />
    </AdminRoute>
  );
}

async function Content() {
  await requireUser();
  const db = getDb();
  const [cupCount] = await db.select().from(competitions);
  const [postCount] = await db.select().from(posts);
  const [matchCount] = await db.select().from(matches);
  const [userCount] = await db.select().from(users);
  const recent = await db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(8);

  return (
    <section>
      <h1 className={styles.title}>Panoramica</h1>
      <div className={styles.grid}>
        <Link className={styles.card} href="/admin/coppe">
          Coppe
          <strong> {cupCount ? "in database" : "vuote"}</strong>
        </Link>
        <Link className={styles.card} href="/admin/blog">
          Articoli
          <strong> {postCount ? "in database" : "vuoti"}</strong>
        </Link>
        <Link className={styles.card} href="/admin/partite">
          Partite
          <strong> {matchCount ? "in database" : "vuote"}</strong>
        </Link>
        <Link className={styles.card} href="/admin/utenti">
          Utenti
          <strong> {userCount ? "in database" : "vuoti"}</strong>
        </Link>
      </div>
      <h2 className={styles.title}>Ultime modifiche</h2>
      <ul>
        {recent.map((entry) => (
          <li key={entry.id}>
            {entry.createdAt.toISOString()} — {entry.summary}
          </li>
        ))}
      </ul>
    </section>
  );
}
