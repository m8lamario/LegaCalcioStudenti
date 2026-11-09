"use client";

import { useEffect, useState } from "react";

function formatRemaining(iso: string) {
  const diff = Date.parse(iso) - Date.now();
  if (Number.isNaN(diff) || diff <= 0) return "In campo";
  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  if (days > 0) return `${days}g ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

export function MatchCountdown({ iso }: { iso: string }) {
  const [label, setLabel] = useState("Prossima");

  useEffect(() => {
    const tick = () => setLabel(formatRemaining(iso));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [iso]);

  return <time dateTime={iso}>{label}</time>;
}
