import { getDb } from "@/db";
import { competitions, groups, phases } from "@/db/schema";
import { saveGroup } from "@/lib/admin/cup-actions";
import { requireUser } from "@/lib/auth/guards";
import { AdminRoute } from "../AdminRoute";
import styles from "../admin.module.css";

export default function AdminGroupsPage() {
  return (
    <AdminRoute>
      <Content />
    </AdminRoute>
  );
}

async function Content() {
  await requireUser();
  const db = getDb();
  const [cups, phaseRows, rows] = await Promise.all([
    db.select().from(competitions),
    db.select().from(phases),
    db.select().from(groups),
  ]);
  const cupName = new Map(cups.map((cup) => [cup.id, cup.name]));

  return (
    <section>
      <h1 className={styles.title}>Gironi</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Slug</th>
            <th>Fase</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const phase = phaseRows.find((item) => item.id === row.phaseId);
            return (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.slug}</td>
                <td>
                  {phase?.name} · {phase ? cupName.get(phase.competitionId) : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <form className={styles.form} action={saveGroup}>
        <label className={styles.label}>
          ID esistente
          <input className={styles.input} name="id" />
        </label>
        <label className={styles.label}>
          Fase
          <select className={styles.select} name="phaseId" required>
            {phaseRows.map((phase) => (
              <option key={phase.id} value={phase.id}>
                {phase.name} ({cupName.get(phase.competitionId)})
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Nome
          <input className={styles.input} name="name" required />
        </label>
        <label className={styles.label}>
          Slug
          <input className={styles.input} name="slug" />
        </label>
        <label className={styles.label}>
          Ordine
          <input className={styles.input} name="sortOrder" defaultValue="0" />
        </label>
        <button className={styles.button} type="submit">
          Salva girone
        </button>
      </form>
    </section>
  );
}
