import { getDb } from "@/db";
import { cities, competitions } from "@/db/schema";
import { saveCity, saveCompetition, deleteEntity } from "@/lib/admin/actions";
import { requireUser } from "@/lib/auth/guards";
import { canManageContent } from "@/lib/auth/session";
import { AdminRoute } from "../AdminRoute";
import styles from "../admin.module.css";

export default function AdminCupsPage() {
  return (
    <AdminRoute>
      <Content />
    </AdminRoute>
  );
}

async function Content() {
  const user = await requireUser();
  const db = getDb();
  const cityRows = await db.select().from(cities);
  const cups = await db.select().from(competitions);
  const visible = cups.filter((cup) => canManageContent(user, cup.cityId));

  return (
    <section>
      <h1 className={styles.title}>Coppe e città</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Slug</th>
            <th>Stato</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((cup) => (
            <tr key={cup.id}>
              <td>{cup.name}</td>
              <td>{cup.slug}</td>
              <td>{cup.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className={styles.title}>Nuova / modifica coppa</h2>
      <form className={styles.form} action={saveCompetition}>
        <label className={styles.label}>
          ID esistente (vuoto per nuova)
          <input className={styles.input} name="id" />
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
          Regione
          <input className={styles.input} name="regionTag" />
        </label>
        <label className={styles.label}>
          Stagione
          <input className={styles.input} name="season" />
        </label>
        <label className={styles.label}>
          Stato
          <select className={styles.select} name="status" defaultValue="published">
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </label>
        <label className={styles.label}>
          Fase
          <input className={styles.input} name="stageLabel" />
        </label>
        <label className={styles.label}>
          Logo
          <input className={styles.input} name="logo" />
        </label>
        <label className={styles.label}>
          Immagine
          <input className={styles.input} name="image" />
        </label>
        <label className={styles.label}>
          Alt immagine
          <input className={styles.input} name="imageAlt" />
        </label>
        <label className={styles.label}>
          Descrizione
          <textarea className={styles.textarea} name="description" />
        </label>
        <label className={styles.label}>
          URL abbonamenti
          <input className={styles.input} name="ticketsUrl" />
        </label>
        <label className={styles.label}>
          Abbonamenti attivi
          <input type="checkbox" name="ticketsActive" />
        </label>
        <label className={styles.label}>
          Regolamento
          <input className={styles.input} name="regulationsUrl" />
        </label>
        <label className={styles.label}>
          Email
          <input className={styles.input} name="contactEmail" />
        </label>
        <label className={styles.label}>
          Telefono
          <input className={styles.input} name="contactPhone" />
        </label>
        <label className={styles.label}>
          Indirizzo
          <input className={styles.input} name="contactAddress" />
        </label>
        <label className={styles.label}>
          Instagram
          <input className={styles.input} name="instagram" />
        </label>
        <label className={styles.label}>
          Facebook
          <input className={styles.input} name="facebook" />
        </label>
        <label className={styles.label}>
          Minuti per tempo
          <input className={styles.input} name="halfMinutes" defaultValue="25" />
        </label>
        <label className={styles.label}>
          Minuti supplementari per tempo
          <input className={styles.input} name="extraHalfMinutes" defaultValue="10" />
        </label>
        <label className={styles.label}>
          Ordine
          <input className={styles.input} name="sortOrder" defaultValue="0" />
        </label>
        <button className={styles.button} type="submit">
          Salva coppa
        </button>
      </form>

      {user.role === "admin" ? (
        <>
          <h2 className={styles.title}>Città</h2>
          <form className={styles.form} action={saveCity}>
            <label className={styles.label}>
              ID esistente
              <input className={styles.input} name="id" />
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
              Regione
              <input className={styles.input} name="region" />
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
              Callout dx
              <input className={styles.input} name="mapCalloutDx" />
            </label>
            <label className={styles.label}>
              Callout dy
              <input className={styles.input} name="mapCalloutDy" />
            </label>
            <button className={styles.button} type="submit">
              Salva città
            </button>
          </form>
          <form className={styles.form} action={deleteEntity}>
            <input type="hidden" name="entity" value="competitions" />
            <label className={styles.label}>
              Elimina coppa ID
              <input className={styles.input} name="id" required />
            </label>
            <label className={styles.label}>
              Scrivi ELIMINA
              <input className={styles.input} name="confirm" required />
            </label>
            <button className={styles.danger} type="submit">
              Elimina
            </button>
          </form>
        </>
      ) : null}
    </section>
  );
}
