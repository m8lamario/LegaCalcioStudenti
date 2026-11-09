import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import {
  competitions,
  groups,
  matchEvents,
  matches,
  phases,
  players,
  teams,
  venues,
} from "@/db/schema";
import { deleteEntity, saveMatch } from "@/lib/admin/actions";
import { deleteMatchEvent, saveMatchEvent } from "@/lib/admin/cup-actions";
import { requireUser } from "@/lib/auth/guards";
import { canManageMatches } from "@/lib/auth/session";
import { AdminRoute } from "../AdminRoute";
import styles from "../admin.module.css";

export default function AdminMatchesPage() {
  return (
    <AdminRoute>
      <Content />
    </AdminRoute>
  );
}

async function Content() {
  const user = await requireUser();
  const db = getDb();
  const [cups, phaseRows, groupRows, teamRows, venueRows, playerRows, eventRows, rows] =
    await Promise.all([
      db.select().from(competitions),
      db.select().from(phases),
      db.select().from(groups),
      db.select().from(teams),
      db.select().from(venues),
      db.select().from(players),
      db.select().from(matchEvents),
      db.select().from(matches).orderBy(desc(matches.roundNumber)),
    ]);
  const visibleCups = cups.filter((cup) => canManageMatches(user, cup.cityId));
  const visibleIds = new Set(visibleCups.map((cup) => cup.id));
  const visibleMatches = rows.filter((row) => visibleIds.has(row.competitionId));
  const teamName = new Map(teamRows.map((team) => [team.id, team.name]));

  return (
    <section>
      <h1 className={styles.title}>Partite</h1>
      {visibleMatches.map((row) => (
        <article key={row.id} className={styles.card}>
          <p>
            {row.roundLabel} · {teamName.get(row.homeTeamId ?? "") ?? "Casa"} vs{" "}
            {teamName.get(row.awayTeamId ?? "") ?? "Trasferta"}
          </p>
          <form className={styles.compactForm} action={saveMatch}>
            <input type="hidden" name="id" value={row.id} />
            <input type="hidden" name="competitionId" value={row.competitionId} />
            <input type="hidden" name="phaseId" value={row.phaseId ?? ""} />
            <input type="hidden" name="groupId" value={row.groupId ?? ""} />
            <input type="hidden" name="venueId" value={row.venueId ?? ""} />
            <input type="hidden" name="homeTeamId" value={row.homeTeamId ?? ""} />
            <input type="hidden" name="awayTeamId" value={row.awayTeamId ?? ""} />
            <input type="hidden" name="roundLabel" value={row.roundLabel ?? ""} />
            <input type="hidden" name="dateLabel" value={row.dateLabel ?? ""} />
            <label className={styles.label}>
              Stato
              <select className={styles.select} name="status" defaultValue={row.status}>
                <option value="scheduled">scheduled</option>
                <option value="live">live</option>
                <option value="finished">finished</option>
                <option value="postponed">postponed</option>
              </select>
            </label>
            <label className={styles.label}>
              Casa
              <input className={styles.input} name="homeScore" defaultValue={row.homeScore ?? ""} />
            </label>
            <label className={styles.label}>
              Trasferta
              <input className={styles.input} name="awayScore" defaultValue={row.awayScore ?? ""} />
            </label>
            <button className={styles.button} type="submit">
              Aggiorna
            </button>
          </form>
          <ul>
            {eventRows
              .filter((event) => event.matchId === row.id)
              .map((event) => (
                <li key={event.id}>
                  {event.minute ?? "-"}&apos; {event.type}
                  <form action={deleteMatchEvent}>
                    <input type="hidden" name="id" value={event.id} />
                    <button className={styles.danger} type="submit">
                      Elimina evento
                    </button>
                  </form>
                </li>
              ))}
          </ul>
          <form className={styles.compactForm} action={saveMatchEvent}>
            <input type="hidden" name="matchId" value={row.id} />
            <select className={styles.select} name="type" defaultValue="goal">
              <option value="goal">goal</option>
              <option value="yellow_card">giallo</option>
              <option value="red_card">rosso</option>
              <option value="substitution">cambio</option>
              <option value="note">nota</option>
            </select>
            <input className={styles.input} name="minute" placeholder="min" />
            <select className={styles.select} name="teamId">
              <option value="">Squadra</option>
              {[row.homeTeamId, row.awayTeamId].filter(Boolean).map((id) => (
                <option key={id as string} value={id as string}>
                  {teamName.get(id as string)}
                </option>
              ))}
            </select>
            <select className={styles.select} name="playerId">
              <option value="">Giocatore</option>
              {playerRows
                .filter(
                  (player) =>
                    player.teamId === row.homeTeamId || player.teamId === row.awayTeamId,
                )
                .map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
            </select>
            <button className={styles.button} type="submit">
              Aggiungi evento
            </button>
          </form>
        </article>
      ))}

      <h2 className={styles.title}>Nuova partita</h2>
      <form className={styles.form} action={saveMatch}>
        <label className={styles.label}>
          Coppa
          <select className={styles.select} name="competitionId" required>
            {visibleCups.map((cup) => (
              <option key={cup.id} value={cup.id}>
                {cup.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Fase
          <select className={styles.select} name="phaseId">
            <option value="">—</option>
            {phaseRows.map((phase) => (
              <option key={phase.id} value={phase.id}>
                {phase.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Girone
          <select className={styles.select} name="groupId">
            <option value="">—</option>
            {groupRows.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Campo
          <select className={styles.select} name="venueId">
            <option value="">—</option>
            {venueRows.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Casa
          <select className={styles.select} name="homeTeamId">
            <option value="">—</option>
            {teamRows.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Trasferta
          <select className={styles.select} name="awayTeamId">
            <option value="">—</option>
            {teamRows.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Turno
          <input className={styles.input} name="roundLabel" />
        </label>
        <label className={styles.label}>
          Giornata n.
          <input className={styles.input} name="roundNumber" />
        </label>
        <label className={styles.label}>
          Data etichetta
          <input className={styles.input} name="dateLabel" />
        </label>
        <label className={styles.label}>
          Kickoff
          <input className={styles.input} type="datetime-local" name="kickoffAt" />
        </label>
        <label className={styles.label}>
          Stato
          <select className={styles.select} name="status" defaultValue="scheduled">
            <option value="scheduled">scheduled</option>
            <option value="live">live</option>
            <option value="finished">finished</option>
            <option value="postponed">postponed</option>
          </select>
        </label>
        <button className={styles.button} type="submit">
          Salva partita
        </button>
      </form>
      <form className={styles.form} action={deleteEntity}>
        <input type="hidden" name="entity" value="matches" />
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
