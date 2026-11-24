import type { CupAwaitingCopy } from "@/data/cupAwaiting";
import { withKeptLines, withKeptSentences } from "@/lib/typography";
import styles from "./CupPage.module.css";

export function CupAwaiting({ copy }: { copy: CupAwaitingCopy }) {
  return (
    <div className={styles.awaiting}>
      <p className={styles.eyebrow}>{copy.eyebrow}</p>
      <p className={styles.awaitingTitle}>{withKeptLines(copy.title)}</p>
      <p className={styles.awaitingLead}>{withKeptSentences(copy.lead)}</p>
    </div>
  );
}

export function hasStandingsResults(
  standings: { rows: { played: number }[] }[],
) {
  return standings.some((group) => group.rows.some((row) => row.played > 0));
}

export function hasFinishedTeamStats(
  attack: { goalsFor: number; goalsAgainst: number }[],
) {
  return attack.some((row) => row.goalsFor + row.goalsAgainst > 0);
}
