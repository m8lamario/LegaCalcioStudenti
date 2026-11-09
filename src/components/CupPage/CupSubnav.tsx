import Link from "next/link";
import { CUP_TABS, type CupTabKey } from "@/lib/cup-nav";
import styles from "./CupPage.module.css";

export function CupSubnav({
  slug,
  current,
}: {
  slug: string;
  current?: CupTabKey;
}) {
  return (
    <nav className={styles.tabs} aria-label="Sezioni della coppa">
      {CUP_TABS.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href(slug)}
          className={tab.key === current ? styles.tabActive : styles.tab}
          aria-current={tab.key === current ? "page" : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
