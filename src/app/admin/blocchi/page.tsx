import { getDb } from "@/db";
import { CUP_BLOCK_KEYS, competitionBlocks, competitions } from "@/db/schema";
import { saveCompetitionBlocks } from "@/lib/admin/cup-actions";
import { requireUser } from "@/lib/auth/guards";
import { AdminRoute } from "../AdminRoute";
import styles from "../admin.module.css";

export default function AdminBlocksPage() {
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
    db.select().from(competitionBlocks),
  ]);

  return (
    <section>
      <h1 className={styles.title}>Blocchi coppa</h1>
      {cups.map((cup) => {
        const cupRows = rows.filter((row) => row.competitionId === cup.id);
        return (
          <form key={cup.id} className={styles.form} action={saveCompetitionBlocks}>
            <h2 className={styles.title}>{cup.name}</h2>
            <input type="hidden" name="competitionId" value={cup.id} />
            {CUP_BLOCK_KEYS.map((key, index) => {
              const row = cupRows.find((item) => item.key === key);
              return (
                <label key={key} className={styles.label}>
                  {key}
                  <input
                    type="checkbox"
                    name={`visible_${key}`}
                    defaultChecked={row?.visible ?? true}
                  />
                  <input
                    className={styles.input}
                    name={`order_${key}`}
                    defaultValue={row?.sortOrder ?? index}
                  />
                </label>
              );
            })}
            <button className={styles.button} type="submit">
              Salva visibilità
            </button>
          </form>
        );
      })}
    </section>
  );
}
