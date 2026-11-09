import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckEmail } from "./CheckEmail";
import styles from "./login.module.css";

export const metadata: Metadata = {
  title: "Accesso gestionale — Lega Calcio Studenti",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  return (
    <Suspense fallback={<p className={styles.note}>Caricamento…</p>}>
      <LoginForm searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string }>;
}) {
  const { sent } = await searchParams;

  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Gestionale</p>
        <h1 className={styles.title}>Accesso</h1>
        {sent ? (
          <CheckEmail />
        ) : (
          <form className={styles.form} action="/api/auth/login" method="post">
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className={styles.input}
              type="email"
              name="email"
              autoComplete="email"
              required
            />
            <button className={styles.button} type="submit">
              Invia link di accesso
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
