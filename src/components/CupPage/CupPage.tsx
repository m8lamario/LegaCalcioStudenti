import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "@/components/RevealOnScroll/RevealOnScroll";
import { SponsorSlot } from "@/components/SponsorSlot/SponsorSlot";
import type { CupPageData } from "@/lib/cup-types";
import banner from "@/components/LocalCompetitionPage/LocalCompetitionPage.module.css";
import { CupSubnav } from "./CupSubnav";
import { MatchCard } from "./MatchCard";
import { StandingsTable } from "./StandingsTable";
import styles from "./CupPage.module.css";

function socialEntries(social: Record<string, string>) {
  return Object.entries(social).filter(([, href]) => Boolean(href));
}

export function CupPage({ data }: { data: CupPageData }) {
  const { competition, visibleBlocks } = data;
  const place = [competition.city, competition.regionTag].filter(Boolean).join(" · ");
  const liveOrNext = data.liveMatches.length > 0
    ? data.liveMatches
    : data.nextMatch
      ? [data.nextMatch]
      : data.lastResults.slice(0, 3);
  const showStrip = visibleBlocks.match_strip && liveOrNext.length > 0;
  const showResults =
    visibleBlocks.results_upcoming &&
    (data.lastResults.length > 0 || data.upcoming.length > 0);
  const showStandings = visibleBlocks.standings && data.standings.length > 0;
  const showScorers =
    visibleBlocks.scorers && (data.scorers.length > 0 || data.mvp);
  const showNews = visibleBlocks.news && data.posts.length > 0;
  const showSchools = visibleBlocks.schools && data.schools.length > 0;
  const showInfo =
    visibleBlocks.info &&
    (socialEntries(competition.social).length > 0 ||
      data.venues.length > 0 ||
      Boolean(competition.contacts?.email || competition.contacts?.phone) ||
      Boolean(competition.regulationsUrl));

  return (
    <article className={styles.page}>
      {visibleBlocks.title_sponsor ? (
        <div className={`lcs-container ${styles.block}`}>
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
            <div className={styles.ctaRow}>
              {competition.ticketsActive && competition.ticketsUrl ? (
                <a className={styles.cta} href={competition.ticketsUrl}>
                  Abbonamenti
                </a>
              ) : null}
              <Link className={styles.ctaGhost} href={`/competizioni/${competition.slug}/partite`}>
                Calendario
              </Link>
              {socialEntries(competition.social).map(([network, href]) => (
                <a key={network} className={styles.ctaGhost} href={href}>
                  {network}
                </a>
              ))}
            </div>
          </div>
        </header>
      ) : null}

      {showStrip ? (
        <RevealOnScroll>
          <section className={`lcs-container ${styles.block}`} aria-label="Partite in evidenza">
            <p className={styles.stripLabel}>
              {data.liveMatches.length > 0
                ? "Live"
                : data.nextMatch
                  ? "Prossima partita"
                  : "Ultimi risultati"}
            </p>
            <div className={styles.grid}>
              {liveOrNext.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  countdown={Boolean(data.nextMatch && data.liveMatches.length === 0)}
                />
              ))}
            </div>
          </section>
        </RevealOnScroll>
      ) : null}

      {visibleBlocks.tabs ? (
        <div className={`lcs-container ${styles.block}`}>
          <CupSubnav slug={competition.slug} />
        </div>
      ) : null}

      {showResults ? (
        <RevealOnScroll>
          <section className={`lcs-container ${styles.block} ${styles.twoCol}`}>
            <div>
              <p className={styles.eyebrow}>Campo</p>
              <h2 className={styles.sectionTitle}>Ultimi risultati</h2>
              <div className={styles.grid}>
                {data.lastResults.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
            <div>
              <p className={styles.eyebrow}>Calendario</p>
              <h2 className={styles.sectionTitle}>Prossime</h2>
              <div className={styles.grid}>
                {data.upcoming.map((match) => (
                  <MatchCard key={match.id} match={match} countdown />
                ))}
              </div>
            </div>
          </section>
        </RevealOnScroll>
      ) : null}

      {showStandings ? (
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

      {showScorers ? (
        <RevealOnScroll>
          <section className={`lcs-container ${styles.block} ${styles.twoCol}`}>
            <div>
              <p className={styles.eyebrow}>Numeri</p>
              <h2 className={styles.sectionTitle}>Marcatori</h2>
              <ol className={styles.list}>
                {data.scorers.map((row) => (
                  <li key={row.playerId}>
                    {row.name} · {row.goals}
                  </li>
                ))}
              </ol>
            </div>
            {data.mvp ? (
              <div>
                <SponsorSlot placement="mvp" competitionId={competition.dbId} />
                <p className={styles.eyebrow}>MVP</p>
                <h2 className={styles.sectionTitle}>{data.mvp.name}</h2>
                <p className={styles.muted}>
                  {data.mvp.roundLabel}
                  {data.mvp.note ? ` · ${data.mvp.note}` : ""}
                </p>
              </div>
            ) : null}
          </section>
        </RevealOnScroll>
      ) : null}

      {showNews ? (
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
                  <p className={styles.muted}>{post.dek}</p>
                </Link>
              ))}
            </div>
          </section>
        </RevealOnScroll>
      ) : null}

      {showSchools ? (
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

      {visibleBlocks.local_partners ? (
        <RevealOnScroll>
          <section className={`lcs-container ${styles.block} ${styles.twoCol}`}>
            <SponsorSlot placement="gold_locale" competitionId={competition.dbId} />
            <SponsorSlot placement="silver_locale" competitionId={competition.dbId} />
          </section>
        </RevealOnScroll>
      ) : null}

      {showInfo ? (
        <RevealOnScroll>
          <section className={`lcs-container ${styles.block}`}>
            <p className={styles.eyebrow}>Info</p>
            <h2 className={styles.sectionTitle}>La coppa</h2>
            <div className={styles.infoList}>
              {socialEntries(competition.social).map(([network, href]) => (
                <a key={network} href={href}>
                  {network}
                </a>
              ))}
              {data.venues.map((venue) => (
                <p key={venue.id}>
                  {venue.mapsUrl ? (
                    <a href={venue.mapsUrl}>{venue.name}</a>
                  ) : (
                    venue.name
                  )}
                  {venue.address ? ` · ${venue.address}` : ""}
                </p>
              ))}
              {competition.contacts?.email ? (
                <a href={`mailto:${competition.contacts.email}`}>{competition.contacts.email}</a>
              ) : null}
              {competition.contacts?.phone ? (
                <a href={`tel:${competition.contacts.phone}`}>{competition.contacts.phone}</a>
              ) : null}
              {competition.regulationsUrl ? (
                <a href={competition.regulationsUrl}>Regolamento</a>
              ) : null}
            </div>
          </section>
        </RevealOnScroll>
      ) : null}

      {visibleBlocks.national_partners ? (
        <div className={`lcs-container ${styles.block}`}>
          <SponsorSlot placement="nazionale" />
        </div>
      ) : null}
    </article>
  );
}
