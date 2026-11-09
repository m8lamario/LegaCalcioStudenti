import { getDb } from "@/db";
import { competitions, posts } from "@/db/schema";
import { deleteEntity, savePost } from "@/lib/admin/actions";
import { requireUser } from "@/lib/auth/guards";
import { AdminRoute } from "../AdminRoute";
import styles from "../admin.module.css";

export default function AdminBlogPage() {
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
  const rows = await db.select().from(posts);

  return (
    <section>
      <h1 className={styles.title}>News / Blog</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Titolo</th>
            <th>Slug</th>
            <th>Pubblicato</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.title}</td>
              <td>{row.slug}</td>
              <td>{row.published ? "sì" : "no"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form className={styles.form} action={savePost} encType="multipart/form-data">
        <label className={styles.label}>
          ID esistente
          <input className={styles.input} name="id" />
        </label>
        <label className={styles.label}>
          Coppa
          <select className={styles.select} name="competitionId">
            <option value="">Nazionale</option>
            {cups.map((cup) => (
              <option key={cup.id} value={cup.id}>
                {cup.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Tipo
          <select className={styles.select} name="kind" defaultValue="blog">
            <option value="blog">blog</option>
            <option value="news">news</option>
          </select>
        </label>
        <label className={styles.label}>
          Slug
          <input className={styles.input} name="slug" required />
        </label>
        <label className={styles.label}>
          Titolo
          <input className={styles.input} name="title" required />
        </label>
        <label className={styles.label}>
          Sommario
          <textarea className={styles.textarea} name="dek" />
        </label>
        <label className={styles.label}>
          Autori (virgola)
          <input className={styles.input} name="authors" />
        </label>
        <label className={styles.label}>
          Data etichetta
          <input className={styles.input} name="dateLabel" />
        </label>
        <label className={styles.label}>
          Data ISO
          <input className={styles.input} type="date" name="dateIso" required />
        </label>
        <label className={styles.label}>
          Immagine URL
          <input className={styles.input} name="image" />
        </label>
        <label className={styles.label}>
          Upload
          <input className={styles.input} type="file" name="imageFile" accept="image/*" />
        </label>
        <label className={styles.label}>
          Alt
          <input className={styles.input} name="imageAlt" />
        </label>
        <label className={styles.label}>
          Credito
          <input className={styles.input} name="imageCredit" />
        </label>
        <label className={styles.label}>
          Corpo JSON
          <textarea
            className={styles.textarea}
            name="body"
            defaultValue='[{"type":"p","text":""}]'
          />
        </label>
        <label className={styles.label}>
          <input type="checkbox" name="published" defaultChecked /> Pubblicato
        </label>
        <button className={styles.button} type="submit">
          Salva articolo
        </button>
      </form>
      <form className={styles.form} action={deleteEntity}>
        <input type="hidden" name="entity" value="posts" />
        <label className={styles.label}>
          Elimina ID
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
    </section>
  );
}
