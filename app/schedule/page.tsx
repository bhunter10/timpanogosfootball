import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { ScheduleCalendarModal } from "@/components/schedule-calendar-modal";
import { getHeadersOrigin } from "@/lib/site-url";
import { getScheduleGames } from "@/lib/data/schedule";
import { formatScheduleGameDate } from "@/lib/date/schedule-time";
import { createPageMetadata, getSiteUrl, JsonLd } from "@/lib/seo";
import {
  scheduleTeamLevels,
  type ScheduleGame,
  type ScheduleTeamLevel,
} from "@/types/firestore";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Schedule",
    description:
      "Timpanogos High School football schedule with varsity, JV, and freshman game dates, kickoff times, locations, and calendar links.",
    path: "/schedule",
  }),
};

function getMapHref(address?: string) {
  if (!address) return undefined;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function getSelectedTeamLevel(value?: string | string[]): ScheduleTeamLevel {
  const teamLevel = Array.isArray(value) ? value[0] : value;
  return scheduleTeamLevels.some((level) => level.value === teamLevel)
    ? (teamLevel as ScheduleTeamLevel)
    : "varsity";
}

function getTeamLevelLabel(teamLevel: ScheduleTeamLevel) {
  return (
    scheduleTeamLevels.find((level) => level.value === teamLevel)?.label ?? "Varsity"
  );
}

function getCalendarSubscribeLinks(teamLevel: ScheduleTeamLevel, origin: string) {
  const feedPath = `/schedule/${teamLevel}/calendar.ics`;
  const feedUrl = `${origin}${feedPath}`;
  const webcalUrl = feedUrl.replace(/^https?:\/\//i, "webcal://");

  return {
    apple: webcalUrl,
    download: feedPath,
    google: `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(feedUrl)}`,
  };
}

function opponentInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getSchedulePath(teamLevel: ScheduleTeamLevel) {
  return teamLevel === "varsity" ? "/schedule" : `/schedule?team=${teamLevel}`;
}

function getGameEventJsonLd(game: ScheduleGame, teamLabel: string) {
  const startDate = new Date(game.dateISO);
  if (Number.isNaN(startDate.getTime())) return undefined;
  const homeName = game.isHome ? "Timpanogos Timberwolves" : game.opponent;
  const awayName = game.isHome ? game.opponent : "Timpanogos Timberwolves";

  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${teamLabel} Football: ${game.isHome ? "Timpanogos vs. " : "Timpanogos at "}${game.opponent}`,
    sport: "American Football",
    startDate: startDate.toISOString(),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: getSiteUrl(getSchedulePath(game.teamLevel)).toString(),
    homeTeam: {
      "@type": "SportsTeam",
      name: homeName,
    },
    awayTeam: {
      "@type": "SportsTeam",
      name: awayName,
    },
    location: {
      "@type": "Place",
      name: game.location || "Location TBD",
      address: game.address || game.location || "Location TBD",
    },
  };
}

function OpponentLogo({
  game,
  size = "md",
  variant = "default",
}: {
  game: ScheduleGame;
  size?: "md" | "lg";
  variant?: "default" | "feature";
}) {
  const box =
    variant === "feature"
      ? "h-32 w-32 md:h-40 md:w-40"
      : size === "lg"
        ? "h-24 w-24"
        : "h-20 w-20";
  const imageSize =
    variant === "feature"
      ? "(min-width: 768px) 160px, 128px"
      : size === "lg"
        ? "96px"
        : "80px";
  const surface =
    variant === "feature"
      ? "border-white/20 bg-white shadow-black/30"
      : "border-white/20 bg-white/[0.12] shadow-black/20";

  return (
    <div
      className={`relative flex ${box} shrink-0 items-center justify-center overflow-hidden rounded-2xl border ${surface} shadow-lg`}
    >
      {game.opponentLogoUrl ? (
        <Image
          src={game.opponentLogoUrl}
          alt=""
          fill
          sizes={imageSize}
          className="object-contain p-2"
        />
      ) : (
        <span className="font-display text-xl font-bold text-[var(--tf-navy)]">
          {opponentInitials(game.opponent)}
        </span>
      )}
    </div>
  );
}

function GameTile({ game }: { game: ScheduleGame }) {
  const date = formatScheduleGameDate(game.dateISO, "--");
  const mapHref = getMapHref(game.address);

  return (
    <article className="group max-w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-white shadow-lg shadow-black/10 backdrop-blur transition hover:border-[var(--tf-neon)]/50 hover:bg-white/[0.09]">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-3">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <OpponentLogo game={game} />
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--tf-neon)]">
              {game.isHome ? "Home" : "Away"}
            </p>
            <h2 className="font-display mt-1 break-words text-2xl font-bold uppercase leading-none [overflow-wrap:anywhere] sm:text-3xl">
              {game.isHome ? "vs " : "@ "}
              {game.opponent}
            </h2>
            {game.opponentMascot ? (
              <p className="mt-1 break-words text-xs font-semibold uppercase tracking-[0.14em] text-zinc-300 [overflow-wrap:anywhere]">
                {game.opponentMascot}
              </p>
            ) : null}
          </div>
        </div>
        <div className="rounded-xl bg-[var(--tf-neon)] px-3 py-2 text-center text-[var(--tf-navy)]">
          <p className="text-xs font-black uppercase tracking-widest">
            {date.month}
          </p>
          <p className="font-display text-3xl font-bold leading-none">{date.day}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-white/10 pt-4 text-sm text-zinc-200 sm:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
            Kickoff
          </p>
          <p className="mt-1 font-semibold text-white">{date.time}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
            Location
          </p>
          {mapHref ? (
            <a
              href={mapHref}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block break-words font-semibold text-white underline decoration-white/25 underline-offset-4 [overflow-wrap:anywhere] hover:text-[var(--tf-neon)]"
            >
              {game.location || "Location TBD"}
            </a>
          ) : (
            <p className="mt-1 font-semibold text-white">
              {game.location || "Location TBD"}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

type SchedulePageProps = {
  searchParams: Promise<{ team?: string | string[] }>;
};

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const [{ team }, allGames, headersList] = await Promise.all([
    searchParams,
    getScheduleGames(),
    headers(),
  ]);
  const selectedTeamLevel = getSelectedTeamLevel(team);
  const selectedTeamLabel = getTeamLevelLabel(selectedTeamLevel);
  const games = allGames.filter((game) => game.teamLevel === selectedTeamLevel);
  const nextGame = games.find((game) => !game.result) ?? games[0];
  const nextGameDate = nextGame
    ? formatScheduleGameDate(nextGame.dateISO, "--")
    : null;
  const nextGameMapHref = nextGame ? getMapHref(nextGame.address) : undefined;
  const calendarLinks = getCalendarSubscribeLinks(
    selectedTeamLevel,
    getHeadersOrigin(headersList),
  );
  const teamCounts = new Map(
    scheduleTeamLevels.map((level) => [
      level.value,
      allGames.filter((game) => game.teamLevel === level.value).length,
    ]),
  );
  const eventJsonLd = games
    .map((game) => getGameEventJsonLd(game, selectedTeamLabel))
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-[var(--tf-black)] text-white">
      {eventJsonLd.length > 0 ? <JsonLd data={eventJsonLd} /> : null}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6">
          <div
            className={
              nextGame
                ? "grid gap-6 lg:grid-cols-[0.9fr_1.4fr] lg:items-start"
                : "max-w-3xl"
            }
          >
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-[var(--tf-neon)]">
                2026 {selectedTeamLabel}
              </p>
              <h1 className="font-display mt-4 text-6xl font-bold uppercase leading-[0.88] text-white md:text-8xl">
                Schedule
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-300 md:text-base">
                Subscribe to the team calendar once. Schedule changes and game details
                will update automatically all season.
              </p>
              <ScheduleSubscribePanel
                appleHref={calendarLinks.apple}
                downloadHref={calendarLinks.download}
                googleHref={calendarLinks.google}
                teamLabel={selectedTeamLabel}
              />
            </div>

            {nextGame ? (
              <section className="overflow-hidden rounded-3xl border border-[var(--tf-neon)]/35 bg-zinc-950 text-white shadow-2xl shadow-black/25">
                <div className="grid md:grid-cols-[1fr_220px]">
                  <div className="p-5 md:p-6">
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--tf-neon)]">
                      Next Game
                    </p>
                    <div className="mt-4 flex items-center gap-5 md:gap-6">
                      <OpponentLogo game={nextGame} size="lg" variant="feature" />
                      <div className="min-w-0">
                        <h2 className="font-display text-4xl font-bold uppercase leading-none md:text-5xl">
                          {nextGame.isHome ? "vs " : "@ "}
                          {nextGame.opponent}
                        </h2>
                        {nextGame.opponentMascot ? (
                          <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-zinc-300">
                            {nextGame.opponentMascot}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 border-t border-white/10 bg-white/[0.04] text-white md:grid-cols-1 md:border-l md:border-t-0">
                    <div className="p-4">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--tf-neon)]">
                        Date
                      </p>
                      <p className="font-display mt-1 text-2xl font-bold md:text-3xl">
                        {nextGameDate?.month} {nextGameDate?.day}
                      </p>
                    </div>
                    <div className="border-l border-white/10 p-4 md:border-l-0 md:border-t">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--tf-neon)]">
                        Time
                      </p>
                      <p className="font-display mt-1 text-2xl font-bold md:text-3xl">
                        {nextGameDate?.time}
                      </p>
                    </div>
                    <div className="border-l border-white/10 p-4 md:border-l-0 md:border-t">
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--tf-neon)]">
                        Location
                      </p>
                      {nextGameMapHref ? (
                        <a
                          href={nextGameMapHref}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 block truncate text-sm font-bold underline decoration-white/25 underline-offset-4 hover:text-[var(--tf-neon)]"
                        >
                          {nextGame.location || "TBD"}
                        </a>
                      ) : (
                        <p className="mt-1 truncate text-sm font-bold">
                          {nextGame.location || "TBD"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            ) : null}
          </div>

          {games.length === 0 ? (
            <section className="mt-10">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--tf-neon)]">
                    Matchups
                  </p>
                  <h2 className="font-display mt-1 text-4xl font-bold uppercase leading-none">
                    {selectedTeamLabel} Games
                  </h2>
                </div>
                <TeamLevelTabs
                  selectedTeamLevel={selectedTeamLevel}
                  teamCounts={teamCounts}
                />
              </div>
              <div className="mt-5 border border-dashed border-white/20 bg-zinc-950/70 px-5 py-6 text-sm text-zinc-300">
                The {selectedTeamLabel} schedule has not been published yet.
              </div>
            </section>
          ) : (
            <section className="mt-10">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.25em] text-[var(--tf-neon)]">
                    Matchups
                  </p>
                  <h2 className="font-display mt-1 text-4xl font-bold uppercase leading-none">
                    {selectedTeamLabel} Games
                  </h2>
                </div>
                <TeamLevelTabs
                  selectedTeamLevel={selectedTeamLevel}
                  teamCounts={teamCounts}
                />
              </div>
              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                {games.map((game) => (
                  <GameTile key={game.id} game={game} />
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}

function ScheduleSubscribePanel({
  appleHref,
  downloadHref,
  googleHref,
  teamLabel,
}: {
  appleHref: string;
  downloadHref: string;
  googleHref: string;
  teamLabel: string;
}) {
  return (
    <ScheduleCalendarModal
      appleHref={appleHref}
      downloadHref={downloadHref}
      googleHref={googleHref}
      teamLabel={teamLabel}
    />
  );
}

function TeamLevelTabs({
  selectedTeamLevel,
  teamCounts,
}: {
  selectedTeamLevel: ScheduleTeamLevel;
  teamCounts: Map<ScheduleTeamLevel, number>;
}) {
  return (
    <nav
      aria-label="Schedule team"
      className="grid overflow-hidden rounded-lg border border-white/15 bg-white/[0.04] sm:grid-cols-3"
    >
      {scheduleTeamLevels.map((level) => {
        const isSelected = level.value === selectedTeamLevel;
        return (
          <Link
            key={level.value}
            href={getSchedulePath(level.value)}
            aria-current={isSelected ? "page" : undefined}
            className={`px-4 py-3 text-center text-xs font-black uppercase tracking-wide transition ${
              isSelected
                ? "bg-[var(--tf-neon)] text-[var(--tf-navy)]"
                : "text-zinc-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            {level.label}
            <span className="ml-2 opacity-70">{teamCounts.get(level.value) ?? 0}</span>
          </Link>
        );
      })}
    </nav>
  );
}
