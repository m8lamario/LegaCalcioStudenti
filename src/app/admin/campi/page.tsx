import { getDb } from "@/db";
import { cities, venues } from "@/db/schema";
import { saveVenue } from "@/lib/admin/actions";
import { requireUser } from "@/lib/auth/guards";
import { AdminRoute } from "../AdminRoute";
import styles from "../admin.module.css";

export default function AdminVenuesPage() {
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
  const rows = await db.select().from(venues);

  return (
    <section>
      <h1 className={styles.title}>Campi</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Indirizzo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form className={styles.form} action={saveVenue}>
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
          Indirizzo
          <input className={styles.input} name="address" />
        </label>
        <label className={styles.label}>
          Lat
          <input className={styles.input} name="lat" />
        </label>
        <label className={styles.label}>
          Lon
          <input className={styles.input} name="lon" />
        </label>
        <label className={styles.label}>
          URL mappa
          <input className={styles.input} name="mapsUrl" />
        </label>
        <button className={styles.button} type="submit">
          Salva campo
        </button>
      </form>
    </section>
  );
}
