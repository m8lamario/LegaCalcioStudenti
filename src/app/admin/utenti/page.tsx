import { getDb } from "@/db";
import { cities, userCities, users } from "@/db/schema";
import { saveUser } from "@/lib/admin/actions";
import { assertAdmin, requireUser } from "@/lib/auth/guards";
import { AdminRoute } from "../AdminRoute";
import styles from "../admin.module.css";

export default function AdminUsersPage() {
  return (
    <AdminRoute>
      <Content />
    </AdminRoute>
  );
}

async function Content() {
  const user = await requireUser();
  assertAdmin(user);
  const db = getDb();
  const [people, cityRows, links] = await Promise.all([
    db.select().from(users),
    db.select().from(cities),
    db.select().from(userCities),
  ]);

  return (
    <section>
      <h1 className={styles.title}>Utenti e ruoli</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Nome</th>
            <th>Ruolo</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr key={person.id}>
              <td>{person.email}</td>
              <td>{person.name}</td>
              <td>{person.role}</td>
              <td>{person.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.message}>
        Assegnazioni città: {links.length}
      </p>
      <form className={styles.form} action={saveUser}>
        <label className={styles.label}>
          ID esistente
          <input className={styles.input} name="id" />
        </label>
        <label className={styles.label}>
          Email
          <input className={styles.input} type="email" name="email" required />
        </label>
        <label className={styles.label}>
          Nome
          <input className={styles.input} name="name" required />
        </label>
        <label className={styles.label}>
          Ruolo
          <select className={styles.select} name="role" defaultValue="staff_citta">
            <option value="admin">admin</option>
            <option value="staff_citta">staff_citta</option>
            <option value="refertista">refertista</option>
          </select>
        </label>
        <label className={styles.label}>
          Città
          <select className={styles.select} name="cityIds" multiple>
            {cityRows.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
        <button className={styles.button} type="submit">
          Salva utente
        </button>
      </form>
    </section>
  );
}
