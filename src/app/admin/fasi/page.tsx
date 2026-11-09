import { getDb } from "@/db";
import { competitions, phases } from "@/db/schema";
import { savePhase } from "@/lib/admin/actions";
import { requireUser } from "@/lib/auth/guards";
import { AdminRoute } from "../AdminRoute";
import styles from "../admin.module.css";

export default function AdminPhasesPage() {
  return (
    <AdminRoute>
      <Content />
    </AdminRoute>
  );
}

async function Content() {
  await requireUser();
  const db = getDb();
  const cups = await db.select().from(competitions);
  const rows = await db.select().from(phases);

  return (
    <section>
      <h1 className={styles.title}>Fasi e date</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Slug</th>
            <th>Inizio</th>
            <th>Fine</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.slug}</td>
              <td>{row.startsOn}</td>
              <td>{row.endsOn}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form className={styles.form} action={savePhase}>
        <label className={styles.label}>
          ID esistente
          <input className={styles.input} name="id" />
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
          Slug
          <input className={styles.input} name="slug" required />
        </label>
        <label className={styles.label}>
          Nome
          <input className={styles.input} name="name" required />
        </label>
        <label className={styles.label}>
          Tipo
          <select className={styles.select} name="kind" defaultValue="group">
            <option value="group">Gironi</option>
            <option value="knockout">Eliminazione</option>
          </select>
        </label>
        <label className={styles.label}>
          Inizio
          <input className={styles.input} type="date" name="startsOn" />
        </label>
        <label className={styles.label}>
          Fine
          <input className={styles.input} type="date" name="endsOn" />
        </label>
        <label className={styles.label}>
          Minuti per tempo (vuoto = coppa)
          <input className={styles.input} name="halfMinutes" />
        </label>
        <label className={styles.label}>
          Minuti supplementari
          <input className={styles.input} name="extraHalfMinutes" />
        </label>
        <label className={styles.label}>
          Supplementari
          <input type="checkbox" name="allowExtraTime" />
        </label>
        <label className={styles.label}>
          Rigori
          <input type="checkbox" name="allowPenalties" />
        </label>
        <label className={styles.label}>
          Ordine
          <input className={styles.input} name="sortOrder" defaultValue="0" />
        </label>
        <button className={styles.button} type="submit">
          Salva fase
        </button>
      </form>
    </section>
  );
}
