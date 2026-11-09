import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import styles from "./admin.module.css";

export const metadata: Metadata = {
  title: "Gestionale — Lega Calcio Studenti",
  robots: { index: false, follow: false },
};

const LINKS = [
  { href: "/admin", label: "Panoramica" },
  { href: "/admin/coppe", label: "Coppe e città" },
  { href: "/admin/fasi", label: "Fasi" },
  { href: "/admin/campi", label: "Campi" },
  { href: "/admin/scuole", label: "Scuole" },
  { href: "/admin/squadre", label: "Squadre" },
  { href: "/admin/giocatori", label: "Giocatori" },
  { href: "/admin/partite", label: "Partite" },
  { href: "/admin/gironi", label: "Gironi" },
  { href: "/admin/mvp", label: "MVP" },
  { href: "/admin/staff", label: "Staff" },
  { href: "/admin/blocchi", label: "Blocchi coppa" },
  { href: "/admin/blog", label: "News / Blog" },
  { href: "/admin/sponsor", label: "Sponsor" },
  { href: "/admin/home", label: "Home" },
  { href: "/admin/impostazioni", label: "Impostazioni" },
  { href: "/admin/utenti", label: "Utenti" },
  { href: "/admin/registro", label: "Registro" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<p className={styles.main}>Caricamento gestionale…</p>}>
      <AuthedShell>{children}</AuthedShell>
    </Suspense>
  );
}

async function AuthedShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    return children;
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.nav}>
        <Link href="/admin" className={styles.brand}>
          Gestionale LCS
        </Link>
        <ul className={styles.list}>
          {LINKS.filter((link) => {
            if (user.role === "refertista") {
              return ["/admin", "/admin/partite", "/admin/mvp"].includes(link.href);
            }
            if (user.role === "staff_citta") {
              return !["/admin/utenti", "/admin/impostazioni"].includes(link.href);
            }
            return true;
          }).map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.link}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className={styles.user}>
          {user.name}
          <br />
          {user.role}
        </p>
        <form action="/api/auth/logout" method="post">
          <button className={styles.logout} type="submit">
            Esci
          </button>
        </form>
      </aside>
      <div className={styles.main}>{children}</div>
    </div>
  );
}
