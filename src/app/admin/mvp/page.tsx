import { getDb } from "@/db";
import { competitions, matchdayAwards, players, teams } from "@/db/schema";
import { saveMatchdayAward } from "@/lib/admin/cup-actions";
import { requireUser } from "@/lib/auth/guards";
import { AdminRoute } from "../AdminRoute";
import styles from "../admin.module.css";

export default function AdminMvpPage() {
  return (
    <AdminRoute>
      <Content />
    </AdminRoute>
  );
}

async function Content() {
  await requireUser();
  const db = getDb();
  const [cups, playerRows, teamRows, rows] = await Promise.all([
    db.select().from(competitions),
    db.select().from(players),
    db.select().from(teams),
    db.select().from(matchdayAwards),
  ]);
  const teamName = new Map(teamRows.map((team) => [team.id, team.name]));
  const playerName = new Map(playerRows.map((player) => [player.id, player.name]));

  return (
    <section>
      <h1 className={styles.title}>MVP di giornata</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Turno</th>
            <th>Giocatore</th>
            <th>Nota</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.roundLabel}</td>
              <td>{row.playerId ? playerName.get(row.playerId) : "—"}</td>
              <td>{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form className={styles.form} action={saveMatchdayAward}>
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
          Turno
          <input className={styles.input} name="roundLabel" required />
        </label>
        <label className={styles.label}>
          Giocatore
          <select className={styles.select} name="playerId">
            <option value="">—</option>
            {playerRows.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} ({teamName.get(player.teamId)})
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Nota
          <input className={styles.input} name="note" />
        </label>
        <button className={styles.button} type="submit">
          Salva MVP
        </button>
      </form>
    </section>
  );
}
