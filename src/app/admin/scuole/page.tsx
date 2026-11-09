import { getDb } from "@/db";
import { cities, schools } from "@/db/schema";
import { saveSchool } from "@/lib/admin/actions";
import { requireUser } from "@/lib/auth/guards";
import { AdminRoute } from "../AdminRoute";
import styles from "../admin.module.css";

export default function AdminSchoolsPage() {
  return (
    <AdminRoute>
      <Content />
    </AdminRoute>
  );
}

async function Content() {
  await requireUser();
  const db = getDb();
  const cityRows = await db.select().from(cities);
  const rows = await db.select().from(schools);

  return (
    <section>
      <h1 className={styles.title}>Scuole</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Slug</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.slug}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form className={styles.form} action={saveSchool}>
        <label className={styles.label}>
          ID esistente
          <input className={styles.input} name="id" />
        </label>
        <label className={styles.label}>
          Città
          <select className={styles.select} name="cityId">
            <option value="">—</option>
            {cityRows.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
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
          <input className={styles.input} name="slug" required />
        </label>
        <button className={styles.button} type="submit">
          Salva scuola
        </button>
      </form>
    </section>
  );
}
