import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAnnouncements } from "@/lib/data/announcements";
import { getScheduleGames } from "@/lib/data/schedule";
import { formatScheduleGameDate } from "@/lib/date/schedule-time";
import { getSiteSettings } from "@/lib/data/site-settings";
import { createPageMetadata, getSiteUrl, JsonLd } from "@/lib/seo";
import { DONATE_URL, TICKETS_URL } from "@/lib/site-links";

const heroImage = "/images/timpanogos-football-hero-option1.webp";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Timpanogos Football",
    description:
      "Timpanogos High School Timberwolves football in Orem, Utah: varsity schedule, tickets, roster, staff, recruiting, records, and team gear.",
    path: "/",
    image: heroImage,
  }),
};

type QuickLink = { title: string; href: string; external?: boolean };

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
    >
      <path
        d="M5 12h13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="m13 6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ButtonArrow({
  variant = "outline",
}: {
  variant?: "solid" | "outline";
}) {
  const colorClass = variant === "solid" ? "text-[var(--tf-navy)]" : "";

  return (
    <ArrowIcon
      className={`ml-3 size-5 shrink-0 transition duration-200 group-hover:translate-x-1 ${colorClass}`}
    />
  );
}

function getMapHref(address?: string) {
  if (!address) return undefined;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function formatAnnouncementDate(dateISO?: string) {
  if (!dateISO) return undefined;
  const date = new Date(`${dateISO}T12:00:00`);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatAnnouncementDates(dateISOs?: string[], fallbackISO?: string) {
  const dates = (dateISOs?.length ? dateISOs : fallbackISO ? [fallbackISO] : [])
    .map(formatAnnouncementDate)
    .filter((date): date is string => Boolean(date));

  if (dates.length <= 2) return dates.join(" & ") || undefined;
  return `${dates.slice(0, -1).join(", ")} & ${dates[dates.length - 1]}`;
}

function isInternalHref(href: string) {
  return href.startsWith("/");
}

export default async function Home() {
  const [settings, allGames, announcements] = await Promise.all([
    getSiteSettings(),
    getScheduleGames(),
    getAnnouncements({ limit: 3 }),
  ]);
  const games = allGames.filter((game) => game.teamLevel === "varsity");
  const hasSchedule = games.length > 0;
  const nextGame =
    games.find((game) => !game.result) ?? games[0] ?? {
      id: "placeholder",
      opponent: "Schedule Coming Soon",
      dateISO: "",
      location: "Timpanogos High School",
      isHome: true,
      teamLevel: "varsity" as const,
      sortOrder: 0,
  };
  const upcomingGames = games.slice(0, 5);
  const nextGameDate = formatScheduleGameDate(nextGame.dateISO);
  const nextGameMapHref = getMapHref(nextGame.address);
  const nextGameAction = !hasSchedule
    ? { label: "View Schedule", href: "/schedule", external: false }
    : nextGame.isHome
      ? { label: "Get Tickets", href: TICKETS_URL, external: true }
      : nextGameMapHref
        ? { label: "Get Directions", href: nextGameMapHref, external: true }
        : { label: "View Schedule", href: "/schedule", external: false };

  const quickLinks: readonly QuickLink[] = [
    { title: "Tickets", href: TICKETS_URL, external: true },
    { title: "Donate", href: DONATE_URL, external: true },
    { title: "Schedule", href: "/schedule" },
    { title: "Roster", href: "/roster" },
    { title: "Staff", href: "/staff" },
  ];
  const teamJsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: "Timpanogos Football",
    alternateName: "Timpanogos Timberwolves Football",
    sport: "American Football",
    url: getSiteUrl("/").toString(),
    logo: getSiteUrl("/images/twolves-wolf.svg").toString(),
    image: getSiteUrl(heroImage).toString(),
    memberOf: {
      "@type": "SportsOrganization",
      name: "Utah High School Activities Association",
    },
    location: {
      "@type": "Place",
      name: "Timpanogos High School",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Orem",
        addressRegion: "UT",
        addressCountry: "US",
      },
    },
    sameAs: [
      "https://www.instagram.com/timpanogosfootball/",
      "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/football/",
    ],
  };

  return (
    <main className="bg-[var(--tf-black)] text-white">
      <JsonLd data={teamJsonLd} />
      <section className="relative isolate min-h-[680px] overflow-hidden md:min-h-[760px]">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[62%_center] saturate-110 md:object-center md:saturate-100"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,9,23,0.88)_0%,rgba(2,9,23,0.42)_42%,rgba(2,9,23,0.94)_100%)] md:bg-[linear-gradient(90deg,rgba(2,9,23,0.98)_0%,rgba(2,9,23,0.88)_30%,rgba(2,9,23,0.48)_58%,rgba(2,9,23,0.1)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(0deg,var(--tf-black),transparent)]" />
        <div className="relative mx-auto flex min-h-[680px] max-w-7xl flex-col justify-center px-4 py-8 md:min-h-[760px] md:px-6 lg:py-10">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.38em] text-[var(--tf-neon)]">
              Football
            </p>
            <h1 className="font-display mt-4 max-w-4xl text-5xl font-bold uppercase leading-[0.88] tracking-tight text-white md:text-7xl lg:text-8xl">
              {settings.heroTitle}
            </h1>
            <p className="mt-5 max-w-[21rem] text-base leading-7 text-zinc-200 md:max-w-2xl md:text-lg">
              {settings.heroSubtitle}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/schedule"
                className="group inline-flex items-center justify-center rounded-sm bg-[var(--tf-neon)] px-6 py-3 text-sm font-black uppercase tracking-wide text-[var(--tf-navy)] transition hover:brightness-110"
              >
                <span>View Schedule</span>
                <ButtonArrow variant="solid" />
              </Link>
              <a
                href={TICKETS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center rounded-sm border border-[var(--tf-neon)] bg-[var(--tf-neon)]/10 px-6 py-3 text-sm font-black uppercase tracking-wide text-[var(--tf-neon)] backdrop-blur transition hover:bg-[var(--tf-neon)] hover:text-[var(--tf-navy)]"
              >
                <span>Game Tickets</span>
                <ButtonArrow />
              </a>
              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center rounded-sm border border-[var(--tf-neon)] bg-[var(--tf-neon)]/10 px-6 py-3 text-sm font-black uppercase tracking-wide text-[var(--tf-neon)] backdrop-blur transition hover:bg-[var(--tf-neon)] hover:text-[var(--tf-navy)]"
              >
                <span>Donate</span>
                <ButtonArrow />
              </a>
            </div>
          </div>

          <div className="mt-8 flex justify-start">
            <div className="w-full overflow-hidden rounded-lg border border-[var(--tf-neon)]/45 bg-[var(--tf-navy-deep)]/90 text-white shadow-2xl shadow-black/35 backdrop-blur sm:max-w-3xl">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3">
                <p className="text-xs font-black uppercase tracking-[0.26em] text-[var(--tf-neon)]">
                  Next Game
                </p>
                <p className="rounded-sm border border-[var(--tf-neon)]/35 bg-[var(--tf-neon)]/10 px-2.5 py-1 font-mono text-xs font-black uppercase text-[var(--tf-neon)]">
                  {hasSchedule ? (nextGame.isHome ? "Home" : "Away") : "TBD"}
                </p>
              </div>
              <div className="grid gap-5 p-4 sm:p-5 md:grid-cols-[1fr_230px]">
                <div className="grid min-w-0 gap-4 sm:flex sm:items-center md:gap-5">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/15 bg-white shadow-xl shadow-black/25 sm:h-24 sm:w-24">
                    {nextGame.opponentLogoUrl ? (
                      <Image
                        src={nextGame.opponentLogoUrl}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-contain p-3"
                      />
                    ) : (
                      <span className="font-display text-3xl font-bold uppercase text-[var(--tf-navy)]">
                        {hasSchedule ? nextGame.opponent.slice(0, 2) : "TF"}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-300">
                      {hasSchedule
                        ? nextGame.isHome
                          ? "Timpanogos vs"
                          : "Timpanogos at"
                        : "Season"}
                    </p>
                    <p className="font-display mt-1 break-words text-3xl font-bold uppercase leading-none text-white sm:text-4xl md:text-5xl">
                      {hasSchedule ? nextGame.opponent : "Schedule Coming Soon"}
                    </p>
                    {nextGame.opponentMascot ? (
                      <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--tf-neon)]">
                        {nextGame.opponentMascot}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid overflow-hidden rounded-md border border-white/10 bg-white/[0.04] text-sm font-black sm:grid-cols-3 md:grid-cols-1">
                  <div className="p-3.5">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--tf-neon)]">
                      Date
                    </p>
                    <p className="mt-1 text-white">
                      {nextGameDate.month} {nextGameDate.day || "TBD"}
                    </p>
                  </div>
                  <div className="border-t border-white/10 p-3.5 sm:border-l sm:border-t-0 md:border-l-0 md:border-t">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--tf-neon)]">
                      Time
                    </p>
                    <p className="mt-1 text-white">{nextGameDate.time}</p>
                  </div>
                  <div className="border-t border-white/10 p-3.5 sm:border-l sm:border-t-0 md:border-l-0 md:border-t">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--tf-neon)]">
                      Location
                    </p>
                    {nextGameMapHref ? (
                      <a
                        href={nextGameMapHref}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block break-words text-white underline decoration-white/25 underline-offset-4 hover:text-[var(--tf-neon)] md:truncate"
                      >
                        {nextGame.location || "TBD"}
                      </a>
                    ) : (
                      <p className="mt-1 break-words text-white md:truncate">
                        {nextGame.location || "TBD"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-300">
                  Varsity Football
                </p>
                {nextGameAction.external ? (
                  <a
                    href={nextGameAction.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex w-full items-center justify-center rounded-sm border border-[var(--tf-neon)] bg-[var(--tf-neon)]/10 px-4 py-2.5 text-xs font-black uppercase tracking-wide text-[var(--tf-neon)] transition hover:bg-[var(--tf-neon)] hover:text-[var(--tf-navy)] sm:w-auto"
                  >
                    <span>{nextGameAction.label}</span>
                    <ButtonArrow />
                  </a>
                ) : (
                  <Link
                    href={nextGameAction.href}
                    className="group inline-flex w-full items-center justify-center rounded-sm border border-[var(--tf-neon)] bg-[var(--tf-neon)]/10 px-4 py-2.5 text-xs font-black uppercase tracking-wide text-[var(--tf-neon)] transition hover:bg-[var(--tf-neon)] hover:text-[var(--tf-navy)] sm:w-auto"
                  >
                    <span>{nextGameAction.label}</span>
                    <ButtonArrow />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[var(--tf-navy)]">
        <div className="mx-auto grid max-w-7xl gap-px bg-white/10 md:grid-cols-5">
          {quickLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between bg-[var(--tf-navy)] px-4 py-5 transition hover:bg-[var(--tf-black)] md:px-6"
              >
                <span className="font-display text-2xl font-bold uppercase text-white">
                  {link.title}
                </span>
                <ArrowIcon className="size-6 shrink-0 text-[var(--tf-neon)] transition duration-200 group-hover:translate-x-1 group-hover:text-white" />
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between bg-[var(--tf-navy)] px-4 py-5 transition hover:bg-[var(--tf-black)] md:px-6"
              >
                <span className="font-display text-2xl font-bold uppercase text-white">
                  {link.title}
                </span>
                <ArrowIcon className="size-6 shrink-0 text-[var(--tf-neon)] transition duration-200 group-hover:translate-x-1 group-hover:text-white" />
              </Link>
            ),
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:py-20">
        <div className="border-b border-white/15 pb-5">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-[var(--tf-neon)]">
            Team Notes
          </p>
          <h2 className="font-display mt-2 text-4xl font-bold uppercase leading-none text-white md:text-5xl">
            Announcements
          </h2>
        </div>

        {announcements.length > 0 ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {announcements.map((announcement) => {
              const date = formatAnnouncementDates(
                announcement.dateISOs,
                announcement.dateStartISO ?? announcement.dateISO,
              );
              const meta = [announcement.label, date].filter(Boolean).join(" / ");
              const href = announcement.href;
              const linkLabel = announcement.linkLabel || "Read More";

              return (
                <article
                  key={announcement.id}
                  className="flex min-h-[230px] flex-col border border-white/10 bg-white/[0.045] p-5 transition hover:border-[var(--tf-neon)]/40 hover:bg-white/[0.065]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--tf-neon)]">
                      {meta || "Update"}
                    </p>
                    {announcement.isPinned ? (
                      <span className="rounded-sm border border-[var(--tf-neon)]/35 px-2 py-1 text-xs font-black uppercase tracking-wide text-[var(--tf-neon)]">
                        Pinned
                      </span>
                    ) : null}
                  </div>
                  <h3 className="font-display mt-4 text-3xl font-bold uppercase leading-none text-white">
                    {announcement.title}
                  </h3>
                  <p className="mt-4 flex-1 text-sm leading-6 text-zinc-300">
                    {announcement.body}
                  </p>
                  {href ? (
                    isInternalHref(href) ? (
                      <Link
                        href={href}
                        className="group mt-6 inline-flex items-center text-xs font-black uppercase tracking-wide text-[var(--tf-neon)] hover:text-white"
                      >
                        <span>{linkLabel}</span>
                        <ArrowIcon className="ml-2 size-4 transition duration-200 group-hover:translate-x-1" />
                      </Link>
                    ) : (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mt-6 inline-flex items-center text-xs font-black uppercase tracking-wide text-[var(--tf-neon)] hover:text-white"
                      >
                        <span>{linkLabel}</span>
                        <ArrowIcon className="ml-2 size-4 transition duration-200 group-hover:translate-x-1" />
                      </a>
                    )
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 border border-dashed border-white/15 bg-white/[0.035] p-6">
            <p className="text-sm leading-6 text-zinc-300">
              Team announcements, parent reminders, and game week updates will appear
              here when they are posted.
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 md:px-6 lg:pb-20">
        <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/20">
          <div className="border-b border-white/15 px-4 py-5 md:px-6">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-[var(--tf-neon)]">
                Season
              </p>
              <h2 className="font-display mt-2 text-4xl font-bold uppercase leading-none text-white md:text-5xl">
                Schedule Snapshot
              </h2>
            </div>
          </div>

          <div className="grid gap-3 p-4 md:p-6">
            {(upcomingGames.length ? upcomingGames : [nextGame]).map((game) => {
              const date = formatScheduleGameDate(game.dateISO);
              const mapHref = getMapHref(game.address);
              return (
                <div
                  key={game.id}
                  className="grid max-w-full grid-cols-[44px_minmax(0,1fr)] gap-x-3 gap-y-2 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] px-3 py-4 md:grid-cols-[80px_1fr_auto] md:items-center md:gap-4 md:px-5 md:py-5"
                >
                  <div className="grid w-11 shrink-0 gap-0.5 rounded-md border border-white/10 bg-[var(--tf-navy)] px-1 py-2 text-center md:block md:w-14 md:px-1.5 md:py-2">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--tf-neon)]">
                      {date.month}
                    </p>
                    <p className="font-display text-4xl font-bold leading-none text-white">
                      {date.day || "--"}
                    </p>
                  </div>
                  <div className="flex min-w-0 items-center gap-3 overflow-hidden md:gap-4">
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-white/15 bg-white md:h-14 md:w-14">
                      {game.opponentLogoUrl ? (
                        <Image
                          src={game.opponentLogoUrl}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-contain p-1.5"
                        />
                      ) : (
                        <span className="text-xs font-black uppercase text-[var(--tf-navy)]">
                          {game.opponent.slice(0, 2)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-display break-words text-2xl font-bold uppercase leading-none text-white [overflow-wrap:anywhere] md:text-3xl">
                        {game.isHome ? "vs " : "@ "}
                        {game.opponent}
                      </p>
                      {game.opponentMascot ? (
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--tf-neon)] md:text-xs md:tracking-[0.18em]">
                          {game.opponentMascot}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-start-2 min-w-0 md:col-span-1 md:col-start-2">
                    <p className="break-words text-sm text-zinc-300 [overflow-wrap:anywhere] md:mt-2">
                      {date.weekday ? `${date.weekday} / ` : ""}
                      {date.time} /{" "}
                      {mapHref ? (
                        <a
                          href={mapHref}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-white/25 underline-offset-4 hover:text-[var(--tf-neon)]"
                        >
                          {game.location || "Location TBD"}
                        </a>
                      ) : (
                        game.location || "Location TBD"
                      )}
                    </p>
                  </div>
                  {game.result ? (
                    <span className="col-start-2 w-fit rounded-sm border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-wide text-zinc-200 md:col-start-auto">
                      {game.result}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="border-t border-white/10 px-4 py-5 md:px-6">
            <Link
              href="/schedule"
              className="group inline-flex items-center text-sm font-black uppercase tracking-wide text-[var(--tf-neon)] hover:text-white"
            >
              <span>View full schedule</span>
              <ArrowIcon className="ml-2 size-4 transition duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
