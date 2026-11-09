import { getDb } from "@/db";
import { players, teams } from "@/db/schema";
import { savePlayer } from "@/lib/admin/actions";
import { requireUser } from "@/lib/auth/guards";
import { AdminRoute } from "../AdminRoute";
import styles from "../admin.module.css";

export default function AdminPlayersPage() {
  return (
    <AdminRoute>
      <Content />
    </AdminRoute>
  );
}

async function Content() {
  await requireUser();
  const db = getDb();
  const teamRows = await db.select().from(teams);
  const rows = await db.select().from(players);

  return (
    <section>
      <h1 className={styles.title}>Giocatori</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Numero</th>
            <th>Consenso</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.number}</td>
              <td>{row.publicationConsent ? "sì" : "no"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form className={styles.form} action={savePlayer}>
        <label className={styles.label}>
          ID esistente
          <input className={styles.input} name="id" />
        </label>
        <label className={styles.label}>
          Squadra
          <select className={styles.select} name="teamId" required>
            {teamRows.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Nome
          <input className={styles.input} name="name" required />
        </label>
        <label className={styles.label}>
          Numero
          <input className={styles.input} name="number" />
        </label>
        <label className={styles.label}>
          Ruolo
          <input className={styles.input} name="position" />
        </label>
        <label className={styles.label}>
          <input type="checkbox" name="publicationConsent" /> Consenso pubblicazione
        </label>
        <button className={styles.button} type="submit">
          Salva giocatore
        </button>
      </form>
    </section>
  );
}
