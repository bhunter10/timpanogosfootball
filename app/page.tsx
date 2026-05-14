import Image from "next/image";
import Link from "next/link";
import { getScheduleGames } from "@/lib/data/schedule";
import { getSiteSettings } from "@/lib/data/site-settings";
import { TICKETS_URL } from "@/lib/site-links";

const heroImage = "/images/timpanogos-football-hero-option1.jpg";

type QuickLink = { title: string; href: string; external?: boolean };

function formatGameDate(iso: string) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return { month: "TBD", day: "", time: "Time TBD" };
    return {
      month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(d),
      day: new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(d),
      weekday: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(d),
      time: new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }).format(d),
    };
  } catch {
    return { month: "TBD", day: "", weekday: "", time: iso || "Time TBD" };
  }
}

function getRecord(games: Awaited<ReturnType<typeof getScheduleGames>>) {
  return games.reduce(
    (record, game) => {
      const result = game.result?.trim().toLowerCase();
      if (result?.startsWith("w")) record.wins += 1;
      if (result?.startsWith("l")) record.losses += 1;
      return record;
    },
    { wins: 0, losses: 0 },
  );
}

function getMapHref(address?: string) {
  if (!address) return undefined;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export default async function Home() {
  const settings = await getSiteSettings();
  const allGames = await getScheduleGames();
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
  const upcomingGames = games.slice(0, 4);
  const record = getRecord(games);
  const nextGameDate = formatGameDate(nextGame.dateISO);
  const nextGameMapHref = getMapHref(nextGame.address);

  const quickLinks: readonly QuickLink[] = [
    { title: "Tickets", href: TICKETS_URL, external: true },
    { title: "Schedule", href: "/schedule" },
    { title: "Staff", href: "/staff" },
    { title: "Recruiting", href: "/recruiting" },
  ];

  return (
    <main className="bg-[var(--tf-black)] text-white">
      <section className="relative isolate min-h-[calc(100svh-73px)] overflow-hidden md:min-h-[calc(100vh-73px)]">
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
        <div className="relative mx-auto flex min-h-[calc(100svh-73px)] max-w-7xl flex-col justify-between px-4 py-8 md:min-h-[calc(100vh-73px)] md:px-6 lg:py-12">
          <div className="max-w-3xl pt-8 md:pt-14">
            <p className="text-xs font-black uppercase tracking-[0.38em] text-[var(--tf-neon)]">
              Football
            </p>
            <h1 className="font-display mt-5 max-w-4xl text-6xl font-bold uppercase leading-[0.86] tracking-tight text-white md:text-8xl lg:text-9xl">
              {settings.heroTitle}
            </h1>
            <p className="mt-6 max-w-[21rem] text-base leading-7 text-zinc-300 md:max-w-2xl md:text-lg">
              {settings.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/schedule"
                className="inline-flex items-center justify-center rounded-sm bg-[var(--tf-neon)] px-6 py-3 text-sm font-black uppercase tracking-wide text-[var(--tf-navy)] transition hover:brightness-110"
              >
                View Schedule
              </Link>
              <a
                href={TICKETS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-sm border border-white/30 bg-black/25 px-6 py-3 text-sm font-black uppercase tracking-wide text-white backdrop-blur transition hover:border-[var(--tf-neon)] hover:text-[var(--tf-neon)]"
              >
                Game Tickets
              </a>
            </div>
          </div>

          <div className="grid gap-3 pb-2 lg:grid-cols-[1fr_360px] lg:items-end">
            <div className="grid gap-px overflow-hidden border border-white/15 bg-white/15 backdrop-blur md:grid-cols-3">
              {[
                ["Record", `${record.wins}-${record.losses}`],
                ["Home", "THS"],
                ["Identity", "Navy / Neon"],
              ].map(([label, value]) => (
                <div key={label} className="bg-black/55 px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                    {label}
                  </p>
                  <p className="font-display mt-1 text-3xl font-bold text-white">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="border border-[var(--tf-neon)]/50 bg-[var(--tf-neon)] px-5 py-4 text-[var(--tf-navy)] shadow-2xl shadow-[var(--tf-neon)]/20">
              <p className="text-[10px] font-black uppercase tracking-[0.26em]">
                Next Game
              </p>
              <div className="mt-2 flex items-center gap-3">
                {nextGame.opponentLogoUrl ? (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-white">
                    <Image
                      src={nextGame.opponentLogoUrl}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-contain p-1.5"
                    />
                  </div>
                ) : null}
                <p className="font-display text-3xl font-bold leading-none">
                  {hasSchedule
                    ? `${nextGame.isHome ? "vs" : "@"} ${nextGame.opponent}`
                    : "Schedule Coming Soon"}
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold">
                <span>
                  {nextGameDate.month} {nextGameDate.day}
                </span>
                <span>{nextGameDate.time}</span>
                {nextGameMapHref ? (
                  <a
                    href={nextGameMapHref}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-[var(--tf-navy)]/40 underline-offset-4 hover:decoration-[var(--tf-navy)]"
                  >
                    {nextGame.location || "Location TBD"}
                  </a>
                ) : (
                  <span>{nextGame.location || "Location TBD"}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[var(--tf-navy)]">
        <div className="mx-auto grid max-w-7xl gap-px bg-white/10 md:grid-cols-4">
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
                <span className="font-mono text-sm text-[var(--tf-neon)] transition group-hover:translate-x-1">
                  -&gt;
                </span>
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
                <span className="font-mono text-sm text-[var(--tf-neon)] transition group-hover:translate-x-1">
                  -&gt;
                </span>
              </Link>
            ),
          )}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:px-6 lg:grid-cols-[1fr_420px] lg:py-20">
        <div>
          <div className="flex items-end justify-between gap-4 border-b border-white/15 pb-5">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--tf-neon)]">
                Season
              </p>
              <h2 className="font-display mt-2 text-4xl font-bold uppercase leading-none text-white md:text-5xl">
                Schedule Snapshot
              </h2>
            </div>
            <Link
              href="/schedule"
              className="hidden text-sm font-black uppercase tracking-wide text-[var(--tf-neon)] hover:text-white sm:block"
            >
              Full Schedule
            </Link>
          </div>

          <div className="divide-y divide-white/10">
            {(upcomingGames.length ? upcomingGames : [nextGame]).map((game) => {
              const date = formatGameDate(game.dateISO);
              const mapHref = getMapHref(game.address);
              return (
                <div
                  key={game.id}
                  className="grid gap-4 py-5 md:grid-cols-[100px_1fr_auto] md:items-center"
                >
                  <div className="flex items-baseline gap-2 md:block">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--tf-neon)]">
                      {date.month}
                    </p>
                    <p className="font-display text-4xl font-bold leading-none text-white">
                      {date.day || "--"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-sm border border-white/15 bg-white">
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
                    <div>
                      <p className="font-display text-3xl font-bold uppercase leading-none text-white">
                        {game.isHome ? "vs " : "@ "}
                        {game.opponent}
                      </p>
                      {game.opponentMascot ? (
                        <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-[var(--tf-neon)]">
                          {game.opponentMascot}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="md:col-start-2">
                    <p className="mt-2 text-sm text-zinc-400">
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
                  <span className="w-fit rounded-sm border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-wide text-zinc-300">
                    {game.result ?? "Preview"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="self-start border-l-4 border-[var(--tf-neon)] bg-white px-6 py-7 text-[var(--tf-navy)]">
          <p className="text-xs font-black uppercase tracking-[0.26em] text-[var(--tf-green)]">
            Program
          </p>
          <h2 className="font-display mt-3 text-5xl font-bold uppercase leading-none">
            Built for the season
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Schedules, tickets, staff updates, recruiting information, and team gear are
            organized around a bold game-day experience.
          </p>
          <Link
            href="/staff"
            className="mt-6 inline-flex rounded-sm bg-[var(--tf-navy)] px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[var(--tf-black)]"
          >
            Meet the Staff
          </Link>
        </aside>
      </section>
    </main>
  );
}
