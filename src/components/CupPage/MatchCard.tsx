import Link from "next/link";
import type { CupMatchView } from "@/lib/cup-types";
import { MatchCountdown } from "./MatchCountdown";
import styles from "./CupPage.module.css";

const STATUS: Record<CupMatchView["status"], string> = {
  live: "Live",
  finished: "Finale",
  scheduled: "In programma",
  postponed: "Rinviata",
};

export function MatchCard({
  match,
  countdown = false,
}: {
  match: CupMatchView;
  countdown?: boolean;
}) {
  const home = match.homeTeam?.name ?? "TBD";
  const away = match.awayTeam?.name ?? "TBD";
  const score =
    match.homeScore != null && match.awayScore != null
      ? `${match.homeScore} — ${match.awayScore}`
      : match.dateLabel ?? STATUS[match.status];

  return (
    <Link href={`/partite/${match.id}`} className={styles.card}>
      <p className={styles.eyebrow}>
        {match.roundLabel ?? "Partita"}
        {match.groupName ? ` · ${match.groupName}` : ""}
      </p>
      <p className={styles.cardTitle}>
        {home} — {away}
      </p>
      <p className={styles.muted}>
        {countdown && match.kickoffAt ? <MatchCountdown iso={match.kickoffAt} /> : score}
        {match.venueName ? ` · ${match.venueName}` : ""}
      </p>
    </Link>
  );
}
