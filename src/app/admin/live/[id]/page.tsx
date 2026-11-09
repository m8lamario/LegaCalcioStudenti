import { Suspense } from "react";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/guards";
import { getLiveDeskMatch } from "@/lib/live/admin";
import { loadLiveSnapshot } from "@/lib/live/snapshot";
import { AdminRoute } from "../../AdminRoute";
import { LiveBoard } from "../LiveBoard";
import styles from "../../admin.module.css";
import live from "../live.module.css";

interface Props {
  params: Promise<{ id: string }>;
}

export default function AdminLiveMatchPage({ params }: Props) {
  return (
    <AdminRoute>
      <Content params={params} />
    </AdminRoute>
  );
}

async function Content({ params }: Props) {
  const { id } = await params;
  const user = await requireUser();
  const row = await getLiveDeskMatch(id, user);
  if (!row) notFound();
  const snapshot = await loadLiveSnapshot(id);

  return (
    <div className={live.page}>
      <h1 className={styles.title}>Referto live</h1>
      <Suspense fallback={<p className={styles.message}>Caricamento referto…</p>}>
        <LiveBoard
          matchId={row.match.id}
          homeName={row.homeTeam?.name ?? "Casa"}
          awayName={row.awayTeam?.name ?? "Trasferta"}
          homeTeamId={row.match.homeTeamId}
          awayTeamId={row.match.awayTeamId}
          players={row.players}
          isAdmin={user.role === "admin"}
          initialSnapshot={snapshot}
        />
      </Suspense>
    </div>
  );
}
