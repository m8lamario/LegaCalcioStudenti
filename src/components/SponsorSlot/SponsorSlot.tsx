import Image from "next/image";
import { getActiveSponsorSlots } from "@/lib/queries/sponsors";
import type { SponsorPlacement } from "@/db/schema";
import { SponsorImpressionBeacon } from "./SponsorImpressionBeacon";
import styles from "./SponsorSlot.module.css";

const LABELS: Partial<Record<SponsorPlacement | string, string>> = {
  title_coppa: "Presentato da",
  nazionale: "Partner nazionali",
  gold_locale: "Gold",
  silver_locale: "Silver",
  live: "Live",
  mvp: "MVP",
  tecnico: "Partner tecnico",
};

export async function SponsorSlot({
  placement,
  competitionId,
  label,
}: {
  placement: SponsorPlacement | string;
  competitionId?: string | null;
  label?: string;
}) {
  const slots = await getActiveSponsorSlots(placement, competitionId);
  if (slots.length === 0) return null;

  const heading = label ?? LABELS[placement] ?? "Partner";
  const variant =
    placement === "title_coppa"
      ? styles.titleSlot
      : placement === "gold_locale"
        ? styles.gold
        : placement === "silver_locale"
          ? styles.silver
          : "";

  return (
    <aside className={`${styles.slot} ${variant}`} aria-label={heading}>
      <p className={styles.title}>{heading}</p>
      <div className={styles.list}>
        {slots.map((slot) => {
          const content = slot.logo ? (
            <Image
              src={slot.logo}
              alt={slot.name}
              width={160}
              height={56}
              className={styles.logo}
            />
          ) : (
            <span className={styles.name}>{slot.name}</span>
          );
          return (
            <a
              key={slot.slotId}
              href={`/api/sponsor/click?id=${slot.slotId}`}
              rel="sponsored noopener"
              className={styles.card}
            >
              {content}
            </a>
          );
        })}
      </div>
      <SponsorImpressionBeacon slotIds={slots.map((slot) => slot.slotId)} />
    </aside>
  );
}
