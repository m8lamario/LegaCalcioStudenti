"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  createQueuedCommand,
  enqueueCommand,
  markOffline,
  markSending,
  markSynced,
  nextToSend,
  pendingCount,
  syncLabel,
} from "@/lib/live/queue";
import { displayMinute, estimatedServerNow } from "@/lib/live/clock";
import { defaultLiveSubscriber } from "@/lib/live/subscriber";
import type { LiveSnapshot, QueuedCommand } from "@/lib/live/types";
import styles from "./live.module.css";

type Player = {
  id: string;
  teamId: string;
  name: string;
  number: number | null;
  publicationConsent: boolean;
};

function storageKey(matchId: string) {
  return `lcs-live-queue:${matchId}`;
}

function loadQueue(matchId: string): QueuedCommand[] {
  try {
    const raw = localStorage.getItem(storageKey(matchId));
    return raw ? (JSON.parse(raw) as QueuedCommand[]) : [];
  } catch {
    return [];
  }
}

function playerLabel(player: Player) {
  if (player.publicationConsent) return player.name;
  return player.number != null ? `#${player.number}` : "N";
}

export function LiveBoard({
  matchId,
  homeName,
  awayName,
  homeTeamId,
  awayTeamId,
  players,
  isAdmin,
  initialSnapshot,
}: {
  matchId: string;
  homeName: string;
  awayName: string;
  homeTeamId: string | null;
  awayTeamId: string | null;
  players: Player[];
  isAdmin: boolean;
  initialSnapshot: LiveSnapshot | null;
}) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [receivedAt, setReceivedAt] = useState(initialSnapshot?.serverNow ?? 0);
  const [now, setNow] = useState(initialSnapshot?.serverNow ?? 0);
  const [queue, setQueue] = useState<QueuedCommand[]>([]);
  const [online, setOnline] = useState(true);
  const [teamId, setTeamId] = useState(homeTeamId);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [assistId, setAssistId] = useState<string | null>(null);
  const [shirt, setShirt] = useState("");
  const [note, setNote] = useState("");
  const sendingRef = useRef(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setQueue(loadQueue(matchId));
      setOnline(navigator.onLine);
    });
    const on = () => setOnline(true);
    const off = () => {
      setOnline(false);
      setQueue((current) => markOffline(current));
    };
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, [matchId]);

  useEffect(() => {
    localStorage.setItem(storageKey(matchId), JSON.stringify(queue));
  }, [matchId, queue]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const sub = defaultLiveSubscriber();
    return sub.subscribe(`/api/live/snapshot/${matchId}`, (data) => {
      const next = data as LiveSnapshot;
      if (next?.matchId) {
        setSnapshot(next);
        setReceivedAt(Date.now());
      }
    });
  }, [matchId]);

  const enqueue = useCallback(
    (kind: QueuedCommand["kind"], payload: Record<string, unknown> = {}) => {
      setQueue((current) =>
        enqueueCommand(current, createQueuedCommand({ matchId, kind, payload })),
      );
    },
    [matchId],
  );

  useEffect(() => {
    if (!online) return;
    if (sendingRef.current) return;
    const next = nextToSend(queue);
    if (!next) return;
    sendingRef.current = true;
    const timer = window.setTimeout(() => {
      setQueue((current) => markSending(current, next.clientId));
    }, 0);
    void fetch("/api/live/commands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: next.clientId,
        matchId: next.matchId,
        kind: next.kind,
        payload: next.payload,
      }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("fail");
        const body = (await response.json()) as { snapshot?: LiveSnapshot };
        if (body.snapshot) {
          setSnapshot(body.snapshot);
          setReceivedAt(Date.now());
        }
        setQueue((current) => markSynced(current, next.clientId));
      })
      .catch(() => {
        setQueue((current) => markOffline(current));
      })
      .finally(() => {
        sendingRef.current = false;
      });
    return () => window.clearTimeout(timer);
  }, [queue, online]);

  const clockNow = snapshot
    ? estimatedServerNow(snapshot.serverNow, receivedAt, now)
    : now;
  const minute = snapshot ? displayMinute(snapshot.clock, clockNow) : { label: "—" };
  const period = snapshot?.clock.period ?? "idle";
  const sync = syncLabel(queue, online);
  const roster = players.filter((player) => player.teamId === teamId);
  const pending = pendingCount(queue);

  const addEvent = (
    type: "goal" | "yellow_card" | "red_card" | "substitution" | "note",
    extra: Record<string, unknown> = {},
  ) => {
    enqueue("event.add", {
      type,
      teamId,
      playerId,
      assistPlayerId: assistId,
      shirtNumber: shirt ? Number(shirt) : null,
      note: note || null,
      ...extra,
    });
    setNote("");
  };

  const labels = useMemo(
    () => ({
      queued: `In coda (${pending})`,
      sending: "Invio…",
      offline: "Offline, in coda",
      synced: "Sincronizzato",
    }),
    [pending],
  );

  return (
    <section className={styles.board}>
      <Link className={styles.back} href="/admin/live">
        ← Elenco dirette
      </Link>
      <div className={styles.scorebox}>
        <p>
          {homeName} — {awayName}
        </p>
        <p className={styles.score}>
          {snapshot?.homeScore ?? 0} — {snapshot?.awayScore ?? 0}
          {snapshot && (snapshot.homePenaltyScore > 0 || snapshot.awayPenaltyScore > 0)
            ? `  (${snapshot.homePenaltyScore}–${snapshot.awayPenaltyScore} dcr)`
            : ""}
        </p>
        <p className={styles.minute}>{minute.label}</p>
        <p
          className={`${styles.sync} ${
            sync === "offline"
              ? styles.syncOffline
              : sync === "synced"
                ? styles.syncOk
                : styles.syncQueued
          }`}
        >
          {labels[sync]}
        </p>
      </div>

      <div className={styles.actions}>
        <button className={styles.big} type="button" onClick={() => enqueue("clock.start")}>
          Avvio
        </button>
        <button className={styles.big} type="button" onClick={() => enqueue("clock.interval")}>
          Intervallo
        </button>
        <button className={styles.big} type="button" onClick={() => enqueue("clock.resume")}>
          Ripresa
        </button>
        {snapshot?.allowExtraTime ? (
          <button className={styles.ghost} type="button" onClick={() => enqueue("clock.extra")}>
            Supplementari
          </button>
        ) : null}
        {snapshot?.allowPenalties ? (
          <button className={styles.ghost} type="button" onClick={() => enqueue("clock.penalties")}>
            Rigori
          </button>
        ) : null}
        <button
          className={`${styles.danger} ${styles.wide}`}
          type="button"
          onClick={() => enqueue("clock.finish")}
        >
          Fine partita
        </button>
        {isAdmin ? (
          <button className={`${styles.ghost} ${styles.wide}`} type="button" onClick={() => enqueue("clock.reopen")}>
            Riapri (admin)
          </button>
        ) : null}
      </div>

      <div className={styles.teams}>
        <button
          className={teamId === homeTeamId ? styles.teamBtnOn : styles.teamBtn}
          type="button"
          onClick={() => {
            setTeamId(homeTeamId);
            setPlayerId(null);
          }}
        >
          {homeName}
        </button>
        <button
          className={teamId === awayTeamId ? styles.teamBtnOn : styles.teamBtn}
          type="button"
          onClick={() => {
            setTeamId(awayTeamId);
            setPlayerId(null);
          }}
        >
          {awayName}
        </button>
      </div>

      <div className={styles.roster}>
        {roster.map((player) => (
          <button
            key={player.id}
            className={playerId === player.id ? styles.playerOn : styles.player}
            type="button"
            onClick={() => setPlayerId(player.id)}
          >
            {playerLabel(player)}
          </button>
        ))}
      </div>
      <label>
        Numero libero
        <input
          className={styles.input}
          inputMode="numeric"
          value={shirt}
          onChange={(event) => setShirt(event.target.value)}
        />
      </label>
      <label>
        Nota / cronaca
        <input className={styles.input} value={note} onChange={(event) => setNote(event.target.value)} />
      </label>
      <div className={styles.actions}>
        <button className={styles.big} type="button" onClick={() => addEvent("goal", { goalKind: "regular" })}>
          Gol
        </button>
        <button className={styles.ghost} type="button" onClick={() => addEvent("goal", { goalKind: "own_goal" })}>
          Autogol
        </button>
        <button className={styles.ghost} type="button" onClick={() => addEvent("goal", { goalKind: "penalty" })}>
          Rigore
        </button>
        <button className={styles.ghost} type="button" onClick={() => addEvent("yellow_card")}>
          Giallo
        </button>
        <button className={styles.ghost} type="button" onClick={() => addEvent("red_card")}>
          Rosso
        </button>
        <button className={styles.ghost} type="button" onClick={() => addEvent("substitution")}>
          Cambio
        </button>
        <button className={styles.ghost} type="button" onClick={() => addEvent("note")}>
          Nota
        </button>
        <button className={`${styles.danger} ${styles.wide}`} type="button" onClick={() => enqueue("event.undo")}>
          Annulla ultimo
        </button>
      </div>
      <p className={styles.minute}>Assist (facoltativo)</p>
      <div className={styles.roster}>
        {roster.map((player) => (
          <button
            key={`a-${player.id}`}
            className={assistId === player.id ? styles.playerOn : styles.player}
            type="button"
            onClick={() => setAssistId(assistId === player.id ? null : player.id)}
          >
            {playerLabel(player)}
          </button>
        ))}
      </div>

      <ol className={styles.events}>
        {(snapshot?.events ?? []).map((event) => (
          <li key={event.id} className={styles.event}>
            <span>
              {event.minute != null ? `${event.minute}' ` : ""}
              {event.type}
              {event.goalKind && event.goalKind !== "regular" ? ` ${event.goalKind}` : ""}{" "}
              {event.playerName}
            </span>
            <button
              className={styles.ghost}
              type="button"
              onClick={() => enqueue("event.delete", { id: event.id })}
            >
              Elimina
            </button>
          </li>
        ))}
      </ol>
      {snapshot?.status === "finished" ? (
        <a className={styles.back} href={`/partite/${matchId}/opengraph-image`} download>
          Scarica card risultato
        </a>
      ) : null}
      <p className={styles.sync}>Periodo: {period}</p>
    </section>
  );
}
