"use client";

import { useEffect, useRef, useState } from "react";
import { displayMinute, estimatedServerNow } from "@/lib/live/clock";
import { defaultLiveSubscriber } from "@/lib/live/subscriber";
import type { LiveSnapshot, PublicLiveEvent } from "@/lib/live/types";
import page from "@/components/CupPage/CupPage.module.css";
import styles from "./LiveMatch.module.css";

const EVENT_LABEL: Record<PublicLiveEvent["type"], string> = {
  goal: "Gol",
  yellow_card: "Giallo",
  red_card: "Rosso",
  substitution: "Cambio",
  note: "Nota",
};

function formatUpdated(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  });
}

export function LiveMatchClient({
  matchId,
  initial,
}: {
  matchId: string;
  initial: LiveSnapshot;
}) {
  const [snapshot, setSnapshot] = useState(initial);
  const [receivedAt, setReceivedAt] = useState(initial.serverNow);
  const [now, setNow] = useState(initial.serverNow);
  const [goalPulse, setGoalPulse] = useState(false);
  const lastGoal = useRef(
    initial.events.filter((event) => event.type === "goal").at(-1)?.id ?? null,
  );

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const sub = defaultLiveSubscriber();
    return sub.subscribe(`/api/live/snapshot/${matchId}`, (data) => {
      const next = data as LiveSnapshot;
      if (!next?.matchId) return;
      const newestGoal = next.events.filter((event) => event.type === "goal").at(-1)?.id ?? null;
      if (newestGoal && newestGoal !== lastGoal.current) {
        lastGoal.current = newestGoal;
        setGoalPulse(true);
        window.setTimeout(() => setGoalPulse(false), 1200);
      }
      setSnapshot(next);
      setReceivedAt(Date.now());
    });
  }, [matchId]);

  const minute = displayMinute(
    snapshot.clock,
    estimatedServerNow(snapshot.serverNow, receivedAt, now),
  );
  const score =
    snapshot.homePenaltyScore > 0 || snapshot.awayPenaltyScore > 0
      ? `${snapshot.homeScore} — ${snapshot.awayScore} (${snapshot.homePenaltyScore}–${snapshot.awayPenaltyScore} dcr)`
      : `${snapshot.homeScore} — ${snapshot.awayScore}`;

  return (
    <div className={`${styles.wrap} ${goalPulse ? styles.pulse : ""}`}>
      <p className={page.score}>{score}</p>
      <p className={page.muted}>{snapshot.status === "live" ? minute.label : snapshot.status}</p>
      <h2 className={page.cardTitle}>Cronaca eventi</h2>
      {snapshot.events.length === 0 ? (
        <p className={page.empty}>Gli eventi di gara appariranno qui in diretta.</p>
      ) : (
        <ol className={page.events}>
          {snapshot.events.map((event) => (
            <li key={event.id}>
              {event.minute != null ? `${event.minute}' · ` : ""}
              {EVENT_LABEL[event.type]}
              {event.goalKind === "own_goal" ? " (autogol)" : ""}
              {event.goalKind === "penalty" ? " (rigore)" : ""}
              {event.shootout ? " dcr" : ""} · {event.playerName}
              {event.assistName ? ` · assist ${event.assistName}` : ""}
              {event.note ? ` · ${event.note}` : ""}
            </li>
          ))}
        </ol>
      )}
      <p className={styles.updated}>
        Ultimo aggiornamento alle {formatUpdated(snapshot.updatedAt) || "—"}
      </p>
    </div>
  );
}
