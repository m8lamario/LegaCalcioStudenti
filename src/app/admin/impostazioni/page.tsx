import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";
import { saveSetting } from "@/lib/admin/actions";
import { assertAdmin, requireUser } from "@/lib/auth/guards";
import { AdminRoute } from "../AdminRoute";
import styles from "../admin.module.css";

export default function AdminSettingsPage() {
  return (
    <AdminRoute>
      <Content />
    </AdminRoute>
  );
}

async function Content() {
  const user = await requireUser();
  assertAdmin(user);
  const rows = await getDb().select().from(siteSettings);

  return (
    <section>
      <h1 className={styles.title}>Impostazioni sito</h1>
      {rows.map((row) => (
        <form key={row.key} className={styles.form} action={saveSetting}>
          <input type="hidden" name="key" value={row.key} />
          <label className={styles.label}>
            {row.key}
            <textarea
              className={styles.textarea}
              name="value"
              defaultValue={
                typeof row.value === "string" ? row.value : JSON.stringify(row.value)
              }
            />
          </label>
          <button className={styles.button} type="submit">
            Salva
          </button>
        </form>
      ))}
      <form className={styles.form} action={saveSetting}>
        <label className={styles.label}>
          Nuova chiave
          <input className={styles.input} name="key" required />
        </label>
        <label className={styles.label}>
          Valore
          <textarea className={styles.textarea} name="value" />
        </label>
        <button className={styles.button} type="submit">
          Aggiungi
        </button>
      </form>
    </section>
  );
}
