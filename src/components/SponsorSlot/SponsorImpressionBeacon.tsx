"use client";

import { useEffect } from "react";

export function SponsorImpressionBeacon({ slotIds }: { slotIds: string[] }) {
  useEffect(() => {
    if (slotIds.length === 0) return;
    const body = JSON.stringify({ slotIds });
    const send = () => {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/sponsor/impression",
          new Blob([body], { type: "application/json" }),
        );
        return;
      }
      void fetch("/api/sponsor/impression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    };
    send();
  }, [slotIds]);

  return null;
}
