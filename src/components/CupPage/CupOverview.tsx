import type { CupCompetition, CupPhaseInfo } from "@/lib/cup-types";
import styles from "./CupPage.module.css";

function formatCupDate(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatPhaseDates(phase: CupPhaseInfo) {
  const start = formatCupDate(phase.startsOn);
  const end = formatCupDate(phase.endsOn);
  if (start && end && start !== end) return `${start} — ${end}`;
  return start ?? end;
}

export function hasCupOverview(
  competition: CupCompetition,
  phases: CupPhaseInfo[] = [],
) {
  return Boolean(
    competition.description ||
      competition.city ||
      competition.regionTag ||
      competition.season ||
      competition.stageLabel ||
      competition.regulationsUrl ||
      phases.some((phase) => phase.startsOn || phase.endsOn),
  );
}

export function CupOverview({
  competition,
  phases = [],
  heading = "La coppa",
  compact = false,
}: {
  competition: CupCompetition;
  phases?: CupPhaseInfo[];
  heading?: string;
  compact?: boolean;
}) {
  const facts = [
    competition.city ? { label: "Città", value: competition.city } : null,
    competition.regionTag ? { label: "Area", value: competition.regionTag } : null,
    competition.season ? { label: "Stagione", value: competition.season } : null,
    competition.stageLabel ? { label: "Formato", value: competition.stageLabel } : null,
    ...phases.flatMap((phase) => {
      const dates = formatPhaseDates(phase);
      return dates ? [{ label: phase.name, value: dates }] : [];
    }),
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  if (!hasCupOverview(competition, phases)) {
    return null;
  }

  return (
    <section className={styles.overview} aria-label={`Informazioni sulla ${competition.name}`}>
      <p className={styles.eyebrow}>{heading}</p>
      {compact ? null : <h2 className={styles.sectionTitle}>Identità e formato</h2>}
      {competition.description ? (
        <p className={styles.description}>{competition.description}</p>
      ) : null}
      {facts.length > 0 ? (
        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={`${fact.label}-${fact.value}`} className={styles.fact}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {competition.regulationsUrl ? (
        <a className={styles.ctaGhost} href={competition.regulationsUrl}>
          Regolamento
        </a>
      ) : null}
    </section>
  );
}
