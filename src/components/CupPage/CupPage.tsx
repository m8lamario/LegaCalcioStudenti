import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/RevealOnScroll/RevealOnScroll";
import { SponsorSlot } from "@/components/SponsorSlot/SponsorSlot";
import { LiveStrip } from "@/components/LiveStrip/LiveStrip";
import { CUP_PREP } from "@/data/cupAwaiting";
import type { CupPageData } from "@/lib/cup-types";
import banner from "@/components/LocalCompetitionPage/LocalCompetitionPage.module.css";
import { hasStandingsResults } from "./CupAwaiting";
import { CupSubnav } from "./CupSubnav";
import { MatchCard } from "./MatchCard";
import { StandingsTable } from "./StandingsTable";
import styles from "./CupPage.module.css";

function socialEntries(social: Record<string, string>) {
  return Object.entries(social).filter(([, href]) => Boolean(href));
}

function formatDay(value: string | null) {
  if (!value) return null;
  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function phaseWindow(data: CupPageData) {
  const dated = data.phases.find((phase) => phase.startsOn || phase.endsOn);
  if (!dated) return null;
  const start = formatDay(dated.startsOn);
  const end = formatDay(dated.endsOn);
  if (start && end && start !== end) return `${dated.name}: ${start} — ${end}`;
  return `${dated.name}: ${start ?? end}`;
}

export function CupPage({ data }: { data: CupPageData }) {
  const { competition, visibleBlocks } = data;
  const place = [competition.city, competition.regionTag].filter(Boolean).join(" · ");
  const socials = socialEntries(competition.social);
  const standingsLive = hasStandingsResults(data.standings);
  const seasonOpen =
    data.liveMatches.length > 0 ||
    data.lastResults.length > 0 ||
    data.upcoming.length > 0 ||
    standingsLive ||
    data.schools.length > 0 ||
    data.posts.length > 0 ||
    data.scorers.length > 0;
  const windowLabel = phaseWindow(data);
  const showStrip = visibleBlocks.match_strip && (data.nextMatch || data.lastResults.length > 0);
  const liveOrNext = data.nextMatch ? [data.nextMatch] : data.lastResults.slice(0, 3);

  return (
    <article className={styles.page}>
      {visibleBlocks.title_sponsor ? (
        <div className={`lcs-container ${styles.optional}`}>
          <SponsorSlot placement="title_coppa" competitionId={competition.dbId} />
        </div>
      ) : null}

      {visibleBlocks.hero ? (
        <header className={banner.banner}>
          {competition.image ? (
            <Image
              src={competition.image}
              alt={competition.imageAlt ?? ""}
              fill
              priority
              sizes="100vw"
              className={banner.bannerImage}
            />
          ) : null}
          <div className={banner.bannerScrim} aria-hidden="true" />
          <div className={`lcs-container ${banner.bannerContent}`}>
            {competition.logo ? (
              <Image
                src={competition.logo}
                alt=""
                width={72}
                height={72}
                className={banner.logo}
              />
            ) : null}
            <p className={banner.eyebrow}>Competizione locale</p>
            <h1 className={banner.title}>{competition.name}</h1>
            {place ? <p className={banner.place}>{place}</p> : null}
            <p className={styles.heroExtra}>
              {[competition.season, competition.stageLabel].filter(Boolean).join(" · ")}
            </p>
            {competition.ticketsActive && competition.ticketsUrl ? (
              <div className={styles.ctaRow}>
                <a className={styles.cta} href={competition.ticketsUrl}>
                  Abbonamenti
                </a>
              </div>
            ) : null}
          </div>
        </header>
      ) : null}

      {visibleBlocks.match_strip ? (
        <div className={`lcs-container ${styles.optional}`}>
          <LiveStrip competitionId={competition.dbId} />
          <SponsorSlot placement="live" competitionId={competition.dbId} />
          {showStrip ? (
            <>
              <p className={styles.stripLabel}>
                {data.nextMatch ? "Prossima partita" : "Ultimi risultati"}
              </p>
              <div className={styles.grid}>
                {liveOrNext.map((match) => (
                  <MatchCard key={match.id} match={match} countdown={Boolean(data.nextMatch)} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      {seasonOpen ? (
        <>
          {visibleBlocks.tabs ? (
            <div className={`lcs-container ${styles.block}`}>
              <CupSubnav slug={competition.slug} />
            </div>
          ) : null}

          {visibleBlocks.results_upcoming &&
          (data.lastResults.length > 0 || data.upcoming.length > 0) ? (
            <RevealOnScroll>
              <section className={`lcs-container ${styles.block} ${styles.twoCol}`}>
                {data.lastResults.length > 0 ? (
                  <div>
                    <p className={styles.eyebrow}>Campo</p>
                    <h2 className={styles.sectionTitle}>Ultimi risultati</h2>
                    <div className={styles.grid}>
                      {data.lastResults.map((match) => (
                        <MatchCard key={match.id} match={match} />
                      ))}
                    </div>
                  </div>
                ) : null}
                {data.upcoming.length > 0 ? (
                  <div>
                    <p className={styles.eyebrow}>Calendario</p>
                    <h2 className={styles.sectionTitle}>Prossime</h2>
                    <div className={styles.grid}>
                      {data.upcoming.map((match) => (
                        <MatchCard key={match.id} match={match} countdown />
                      ))}
                    </div>
                  </div>
                ) : null}
              </section>
            </RevealOnScroll>
          ) : null}

          {visibleBlocks.standings && standingsLive ? (
            <RevealOnScroll>
              <section className={`lcs-container ${styles.block}`}>
                <p className={styles.eyebrow}>Gironi</p>
                <h2 className={styles.sectionTitle}>Classifica</h2>
                {data.standings.map((group) => (
                  <div key={group.groupId}>
                    <p className={styles.muted}>{group.groupName}</p>
                    <StandingsTable rows={group.rows} compact />
                  </div>
                ))}
                <Link className={styles.ctaGhost} href={`/competizioni/${competition.slug}/classifica`}>
                  Classifica completa
                </Link>
              </section>
            </RevealOnScroll>
          ) : null}

          {visibleBlocks.schools && data.schools.length > 0 ? (
            <RevealOnScroll>
              <section className={`lcs-container ${styles.block}`}>
                <p className={styles.eyebrow}>Istituti</p>
                <h2 className={styles.sectionTitle}>Scuole</h2>
                <div className={styles.schoolGrid}>
                  {data.schools.map((school) => (
                    <Link key={school.slug} href={`/scuole/${school.slug}`} className={styles.card}>
                      {school.logo ? (
                        <Image src={school.logo} alt="" width={48} height={48} />
                      ) : null}
                      <p className={styles.cardTitle}>{school.name}</p>
                    </Link>
                  ))}
                </div>
              </section>
            </RevealOnScroll>
          ) : null}

          {visibleBlocks.news && data.posts.length > 0 ? (
            <RevealOnScroll>
              <section className={`lcs-container ${styles.block}`}>
                <p className={styles.eyebrow}>Cronache</p>
                <h2 className={styles.sectionTitle}>News</h2>
                <div className={styles.newsGrid}>
                  {data.posts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/competizioni/${competition.slug}/blog/${post.slug}`}
                      className={styles.card}
                    >
                      <p className={styles.muted}>{post.dateLabel}</p>
                      <p className={styles.cardTitle}>{post.title}</p>
                    </Link>
                  ))}
                </div>
              </section>
            </RevealOnScroll>
          ) : null}
        </>
      ) : (
        <section className={`lcs-container ${styles.prep}`} aria-labelledby="prep-heading">
          <p className={styles.eyebrow}>In preparazione</p>
          <h2 id="prep-heading" className={styles.prepTitle}>
            Il fischio d&apos;inizio si avvicina
          </h2>
          {competition.description ? (
            <p className={styles.description}>{competition.description}</p>
          ) : (
            <p className={styles.description}>
              La {competition.name} è pronta ad accogliere gli istituti. Squadre, calendario e
              classifica compariranno qui appena la stagione si apre.
            </p>
          )}
          {windowLabel ? <p className={styles.muted}>{windowLabel}</p> : null}
          <div className={styles.prepGrid}>
            {CUP_PREP.map((item) => (
              <Link key={item.key} href={item.href(competition.slug)} className={styles.prepCard}>
                <span className={styles.prepCardTitle}>{item.title}</span>
                <span className={styles.prepCardLead}>{item.lead}</span>
                <span className={styles.prepCardAction}>Apri</span>
              </Link>
            ))}
          </div>
          <nav className={styles.quietLinks} aria-label="Altre sezioni">
            <Link href={`/competizioni/${competition.slug}/info`}>Info</Link>
            <Link href={`/competizioni/${competition.slug}/staff`}>Staff</Link>
            <Link href={`/competizioni/${competition.slug}/blog`}>Cronache</Link>
            {competition.regulationsUrl ? (
              <a href={competition.regulationsUrl}>Regolamento</a>
            ) : null}
            {socials.map(([network, href]) => (
              <a key={network} href={href}>
                {network}
              </a>
            ))}
          </nav>
        </section>
      )}

      {visibleBlocks.local_partners ? (
        <div className={`lcs-container ${styles.optional} ${styles.twoCol}`}>
          <SponsorSlot placement="gold_locale" competitionId={competition.dbId} />
          <SponsorSlot placement="silver_locale" competitionId={competition.dbId} />
        </div>
      ) : null}

      {visibleBlocks.national_partners ? (
        <div className={`lcs-container ${styles.optional}`}>
          <SponsorSlot placement="nazionale" />
        </div>
      ) : null}
    </article>
  );
}
