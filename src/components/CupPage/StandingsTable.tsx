import type { StandingRow } from "@/lib/standings";
import styles from "./CupPage.module.css";

export function StandingsTable({
  rows,
  compact = false,
}: {
  rows: StandingRow[];
  compact?: boolean;
}) {
  const visible = compact ? rows.slice(0, 8) : rows;
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Squadra</th>
            <th>Pt</th>
            <th>G</th>
            {compact ? null : (
              <>
                <th>V</th>
                <th>N</th>
                <th>P</th>
              </>
            )}
            <th>DR</th>
            {compact ? null : <th>GF</th>}
          </tr>
        </thead>
        <tbody>
          {visible.map((row) => (
            <tr key={row.teamId}>
              <td className={styles.rank}>{row.rank}</td>
              <td>{row.teamName}</td>
              <td>{row.points}</td>
              <td>{row.played}</td>
              {compact ? null : (
                <>
                  <td>{row.won}</td>
                  <td>{row.drawn}</td>
                  <td>{row.lost}</td>
                </>
              )}
              <td>
                {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
              </td>
              {compact ? null : <td>{row.goalsFor}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
