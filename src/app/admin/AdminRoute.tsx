import { Suspense } from "react";
import styles from "./admin.module.css";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<p className={styles.message}>Caricamento…</p>}>{children}</Suspense>;
}
