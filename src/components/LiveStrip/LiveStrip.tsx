"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { displayMinute, estimatedServerNow } from "@/lib/live/clock";
import { defaultLiveSubscriber } from "@/lib/live/subscriber";
import type { LiveActiveItem } from "@/lib/live/types";
import styles from "./LiveStrip.module.css";

export function LiveStrip({
  competitionId,
}: {
  competitionId?: string | null;
}) {
  const [items, setItems] = useState<LiveActiveItem[]>([]);
  const [receivedAt, setReceivedAt] = useState(0);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const sub = defaultLiveSubscriber();
    return sub.subscribe("/api/live/active", (data) => {
      const payload = data as { matches?: LiveActiveItem[] };
      setItems(payload.matches ?? []);
      setReceivedAt(Date.now());
    });
  }, []);

  const visible = competitionId
    ? items.filter((item) => item.competitionId === competitionId)
    : items;
  if (visible.length === 0) return null;

  return (
    <section className={styles.strip} aria-label="In diretta">
      <p className={styles.label}>In diretta</p>
      <div className={styles.list}>
        {visible.map((item) => {
          const minute = displayMinute(
            item.clock,
            estimatedServerNow(item.serverNow, receivedAt, now),
          );
          return (
            <Link key={item.matchId} href={`/partite/${item.matchId}`} className={styles.card}>
              <p>
                {item.homeName} — {item.awayName}
              </p>
              <p className={styles.score}>
                {item.homeScore} — {item.awayScore}
              </p>
              <p className={styles.meta}>
                {minute.label}
                {competitionId ? "" : ` · ${item.competitionName}`}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
