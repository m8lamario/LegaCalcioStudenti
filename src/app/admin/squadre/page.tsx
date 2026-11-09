import { getDb } from "@/db";
import { competitions, groups, phases, schools, teams } from "@/db/schema";
import { saveTeam } from "@/lib/admin/actions";
import { requireUser } from "@/lib/auth/guards";
import { AdminRoute } from "../AdminRoute";
import styles from "../admin.module.css";

export default function AdminTeamsPage() {
  return (
    <AdminRoute>
      <Content />
    </AdminRoute>
  );
}

async function Content() {
  await requireUser();
  const db = getDb();
  const [cups, schoolRows, phaseRows, groupRows, rows] = await Promise.all([
    db.select().from(competitions),
    db.select().from(schools),
    db.select().from(phases),
    db.select().from(groups),
    db.select().from(teams),
  ]);

  return (
    <section>
      <h1 className={styles.title}>Squadre</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form className={styles.form} action={saveTeam}>
        <label className={styles.label}>
          ID esistente
          <input className={styles.input} name="id" />
        </label>
        <label className={styles.label}>
          Scuola
          <select className={styles.select} name="schoolId" required>
            {schoolRows.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Coppa
          <select className={styles.select} name="competitionId" required>
            {cups.map((cup) => (
              <option key={cup.id} value={cup.id}>
                {cup.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Fase
          <select className={styles.select} name="phaseId">
            <option value="">—</option>
            {phaseRows.map((phase) => (
              <option key={phase.id} value={phase.id}>
                {phase.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Girone
          <select className={styles.select} name="groupId">
            <option value="">—</option>
            {groupRows.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
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
          Logo
          <input className={styles.input} name="logo" />
        </label>
        <button className={styles.button} type="submit">
          Salva squadra
        </button>
      </form>
    </section>
  );
}
