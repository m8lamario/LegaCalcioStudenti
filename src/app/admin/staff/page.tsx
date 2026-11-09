import { getDb } from "@/db";
import { competitions, staffMembers } from "@/db/schema";
import { saveStaffMember } from "@/lib/admin/cup-actions";
import { requireUser } from "@/lib/auth/guards";
import { AdminRoute } from "../AdminRoute";
import styles from "../admin.module.css";

export default function AdminStaffPage() {
  return (
    <AdminRoute>
      <Content />
    </AdminRoute>
  );
}

async function Content() {
  await requireUser();
  const db = getDb();
  const [cups, rows] = await Promise.all([
    db.select().from(competitions),
    db.select().from(staffMembers),
  ]);

  return (
    <section>
      <h1 className={styles.title}>Staff coppe</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Ruolo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form className={styles.form} action={saveStaffMember}>
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
          Nome
          <input className={styles.input} name="name" required />
        </label>
        <label className={styles.label}>
          Ruolo
          <input className={styles.input} name="role" required />
        </label>
        <label className={styles.label}>
          Foto
          <input className={styles.input} name="photo" />
        </label>
        <label className={styles.label}>
          Ordine
          <input className={styles.input} name="sortOrder" defaultValue="0" />
        </label>
        <button className={styles.button} type="submit">
          Salva staff
        </button>
      </form>
    </section>
  );
}
