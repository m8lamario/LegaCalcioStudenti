import { getDb } from "@/db";
import { homeBlocks } from "@/db/schema";
import { saveHomeBlock } from "@/lib/admin/actions";
import { assertAdmin, requireUser } from "@/lib/auth/guards";
import { AdminRoute } from "../AdminRoute";
import styles from "../admin.module.css";

export default function AdminHomePageEditor() {
  return (
    <AdminRoute>
      <Content />
    </AdminRoute>
  );
}

async function Content() {
  const user = await requireUser();
  assertAdmin(user);
  const blocks = await getDb().select().from(homeBlocks);

  return (
    <section>
      <h1 className={styles.title}>Home</h1>
      {blocks.map((block) => (
        <form key={block.key} className={styles.form} action={saveHomeBlock}>
          <input type="hidden" name="key" value={block.key} />
          <label className={styles.label}>
            {block.key}
            <textarea
              className={styles.textarea}
              name="payload"
              defaultValue={JSON.stringify(block.payload, null, 2)}
            />
          </label>
          <button className={styles.button} type="submit">
            Salva {block.key}
          </button>
        </form>
      ))}
    </section>
  );
}
