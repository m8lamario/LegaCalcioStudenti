"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export function CheckEmail() {
  const router = useRouter();
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      const response = await fetch("/api/auth/status", { cache: "no-store" });
      const data = (await response.json()) as { status?: string };
      if (cancelled) return;
      setStatus(data.status ?? "unknown");
      if (data.status === "confirmed") {
        const complete = await fetch("/api/auth/complete", { method: "POST" });
        if (complete.redirected || complete.ok) {
          router.replace("/admin");
          router.refresh();
        }
      }
    };

    void poll();
    const id = window.setInterval(() => {
      void poll();
    }, 2000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [router]);

  return (
    <p className={styles.note}>
      {status === "expired"
        ? "Il link è scaduto. Richiedi un nuovo accesso."
        : "Controlla la tua email. Questa scheda si aggiornerà automaticamente dopo la conferma."}
    </p>
  );
}
