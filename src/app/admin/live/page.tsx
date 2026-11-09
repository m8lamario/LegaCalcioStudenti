import Link from "next/link";
import { requireUser } from "@/lib/auth/guards";
import { listLiveDeskMatches } from "@/lib/live/admin";
import { AdminRoute } from "../AdminRoute";
import styles from "../admin.module.css";
import live from "./live.module.css";

export default function AdminLiveListPage() {
  return (
    <AdminRoute>
      <Content />
    </AdminRoute>
  );
}

async function Content() {
  const user = await requireUser();
  const rows = await listLiveDeskMatches(user);

  return (
    <section className={live.page}>
      <h1 className={styles.title}>Diretta</h1>
      <p className={styles.message}>Partite di oggi e partite già in corso, nelle tue città.</p>
      {rows.length === 0 ? (
        <p className={styles.message}>Nessuna partita in elenco.</p>
      ) : (
        <div className={live.list}>
          {rows.map((row) => (
            <Link key={row.match.id} className={live.card} href={`/admin/live/${row.match.id}`}>
              <strong>
                {row.homeTeam?.name ?? "Casa"} — {row.awayTeam?.name ?? "Trasferta"}
              </strong>
              <span>
                {row.competition.name} · {row.match.status}
                {row.match.kickoffAt
                  ? ` · ${row.match.kickoffAt.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}`
                  : ""}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
