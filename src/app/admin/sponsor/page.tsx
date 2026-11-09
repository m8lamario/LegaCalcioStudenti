import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  SPONSOR_PLACEMENTS,
  competitions,
  sponsorClicks,
  sponsorImpressions,
  sponsorSlots,
  sponsors,
} from "@/db/schema";
import { saveSponsor } from "@/lib/admin/actions";
import { saveSponsorSlot } from "@/lib/admin/cup-actions";
import { requireUser } from "@/lib/auth/guards";
import { AdminRoute } from "../AdminRoute";
import styles from "../admin.module.css";

export default function AdminSponsorsPage() {
  return (
    <AdminRoute>
      <Content />
    </AdminRoute>
  );
}

async function Content() {
  await requireUser();
  const db = getDb();
  const [cups, rows, slots, clickRows, impressionRows] = await Promise.all([
    db.select().from(competitions),
    db.select().from(sponsors),
    db.select().from(sponsorSlots),
    db
      .select({
        sponsorId: sponsorClicks.sponsorId,
        clicks: sql<number>`count(*)`,
      })
      .from(sponsorClicks)
      .groupBy(sponsorClicks.sponsorId),
    db
      .select({
        sponsorId: sponsorImpressions.sponsorId,
        views: sql<number>`coalesce(sum(${sponsorImpressions.count}), 0)`,
      })
      .from(sponsorImpressions)
      .groupBy(sponsorImpressions.sponsorId),
  ]);
  const sponsorName = new Map(rows.map((row) => [row.id, row.name]));
  const clicks = new Map(clickRows.map((row) => [row.sponsorId, Number(row.clicks)]));
  const views = new Map(impressionRows.map((row) => [row.sponsorId, Number(row.views)]));

  return (
    <section>
      <h1 className={styles.title}>Sponsor e slot</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Click</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.name}</td>
              <td>{row.kind}</td>
              <td>{clicks.get(row.id) ?? 0}</td>
              <td>{views.get(row.id) ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className={styles.title}>Anteprima slot attivi</h2>
      <div className={styles.grid}>
        {slots.map((slot) => (
          <article key={slot.id} className={styles.card}>
            <p>{sponsorName.get(slot.sponsorId)}</p>
            <p>
              {slot.placement}
              {slot.competitionId ? " · coppa" : " · sito"}
            </p>
            <p>
              {slot.startsOn ?? "sempre"} → {slot.endsOn ?? "sempre"}
            </p>
            <p>
              <a href={`/api/sponsor/click?id=${slot.id}`}>link tracciato</a>
            </p>
          </article>
        ))}
      </div>

      <p>
        <a className={styles.button} href="/admin/sponsor/csv">
          Esporta CSV
        </a>
      </p>

      <h2 className={styles.title}>Nuovo sponsor</h2>
      <form className={styles.form} action={saveSponsor}>
        <label className={styles.label}>
          ID esistente
          <input className={styles.input} name="id" />
        </label>
        <label className={styles.label}>
          Nome
          <input className={styles.input} name="name" required />
        </label>
        <label className={styles.label}>
          Tipo
          <select className={styles.select} name="kind" defaultValue="sponsor">
            <option value="istituzionale">istituzionale</option>
            <option value="sponsor">sponsor</option>
            <option value="media">media</option>
            <option value="tecnico">tecnico</option>
          </select>
        </label>
        <label className={styles.label}>
          Logo
          <input className={styles.input} name="logo" />
        </label>
        <label className={styles.label}>
          Link
          <input className={styles.input} name="href" />
        </label>
        <button className={styles.button} type="submit">
          Salva sponsor
        </button>
      </form>

      <h2 className={styles.title}>Nuovo slot</h2>
      <form className={styles.form} action={saveSponsorSlot}>
        <label className={styles.label}>
          ID esistente
          <input className={styles.input} name="id" />
        </label>
        <label className={styles.label}>
          Sponsor
          <select className={styles.select} name="sponsorId" required>
            {rows.map((row) => (
              <option key={row.id} value={row.id}>
                {row.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Posizione
          <select className={styles.select} name="placement" defaultValue="nazionale">
            <option value="home">home</option>
            {SPONSOR_PLACEMENTS.map((placement) => (
              <option key={placement} value={placement}>
                {placement}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Coppa (vuoto = sito)
          <select className={styles.select} name="competitionId">
            <option value="">Nazionale / sito</option>
            {cups.map((cup) => (
              <option key={cup.id} value={cup.id}>
                {cup.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Dal
          <input className={styles.input} type="date" name="startsOn" />
        </label>
        <label className={styles.label}>
          Al
          <input className={styles.input} type="date" name="endsOn" />
        </label>
        <label className={styles.label}>
          Ordine
          <input className={styles.input} name="sortOrder" defaultValue="0" />
        </label>
        <button className={styles.button} type="submit">
          Salva slot
        </button>
      </form>
    </section>
  );
}
