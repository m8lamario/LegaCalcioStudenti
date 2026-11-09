import type { Metadata } from "next";
import { Suspense } from "react";
import { confirmLoginToken } from "@/lib/auth/login";
import styles from "../login.module.css";

export const metadata: Metadata = {
  title: "Conferma accesso — Lega Calcio Studenti",
  robots: { index: false, follow: false },
};

export default function ConfirmLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return (
    <Suspense fallback={<p className={styles.note}>Verifica del link…</p>}>
      <Confirm searchParams={searchParams} />
    </Suspense>
  );
}

async function Confirm({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token ? await confirmLoginToken(token) : { ok: false, reason: "invalid" };

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Gestionale</p>
        <h1 className={styles.title}>
          {result.ok ? "Accesso confermato" : "Link non valido"}
        </h1>
        <p className={styles.note}>
          {result.ok
            ? "Accesso confermato, puoi chiudere questa pagina."
            : "Questo link è scaduto o è già stato usato."}
        </p>
        {result.ok ? <AutoClose /> : null}
      </div>
    </section>
  );
}

function AutoClose() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: "window.setTimeout(function(){window.close();}, 400);",
      }}
    />
  );
}
