import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { auditLog } from "@/db/schema";
import { requireUser } from "@/lib/auth/guards";
import { AdminRoute } from "../AdminRoute";
import styles from "../admin.module.css";

export default function AdminAuditPage() {
  return (
    <AdminRoute>
      <Content />
    </AdminRoute>
  );
}

async function Content() {
  await requireUser();
  const rows = await getDb().select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(100);

  return (
    <section>
      <h1 className={styles.title}>Registro modifiche</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Quando</th>
            <th>Azione</th>
            <th>Entità</th>
            <th>Dettaglio</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.createdAt.toISOString()}</td>
              <td>{row.action}</td>
              <td>
                {row.entity} {row.entityId}
              </td>
              <td>{row.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
