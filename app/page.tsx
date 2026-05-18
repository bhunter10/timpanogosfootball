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
  const upcomingGames = games.slice(0, 5);
  const nextGameDate = formatGameDate(nextGame.dateISO);
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
    { title: "Schedule", href: "/schedule" },
    { title: "Roster", href: "/roster" },
    { title: "Staff", href: "/staff" },
  ];

  return (
    <main className="bg-[var(--tf-black)] text-white">
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
            <p className="mt-5 max-w-[21rem] text-base leading-7 text-zinc-300 md:max-w-2xl md:text-lg">
              {settings.heroSubtitle}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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

          <div className="mt-8 flex justify-start">
            <div className="w-full overflow-hidden rounded-lg border border-[var(--tf-neon)]/45 bg-[var(--tf-navy-deep)]/90 text-white shadow-2xl shadow-black/35 backdrop-blur sm:max-w-3xl">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3">
                <p className="text-xs font-black uppercase tracking-[0.26em] text-[var(--tf-neon)]">
                  Next Game
                </p>
                <p className="rounded-sm border border-[var(--tf-neon)]/35 bg-[var(--tf-neon)]/10 px-2.5 py-1 font-mono text-[11px] font-black uppercase text-[var(--tf-neon)]">
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
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
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
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--tf-neon)]">
                      Date
                    </p>
                    <p className="mt-1 text-white">
                      {nextGameDate.month} {nextGameDate.day || "TBD"}
                    </p>
                  </div>
                  <div className="border-t border-white/10 p-3.5 sm:border-l sm:border-t-0 md:border-l-0 md:border-t">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--tf-neon)]">
                      Time
                    </p>
                    <p className="mt-1 text-white">{nextGameDate.time}</p>
                  </div>
                  <div className="border-t border-white/10 p-3.5 sm:border-l sm:border-t-0 md:border-l-0 md:border-t">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--tf-neon)]">
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
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
                  Varsity Football
                </p>
                {nextGameAction.external ? (
                  <a
                    href={nextGameAction.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center rounded-sm bg-[var(--tf-neon)] px-4 py-2.5 text-xs font-black uppercase tracking-wide text-[var(--tf-navy)] transition hover:brightness-110 sm:w-auto"
                  >
                    {nextGameAction.label}
                  </a>
                ) : (
                  <Link
                    href={nextGameAction.href}
                    className="inline-flex w-full items-center justify-center rounded-sm bg-[var(--tf-neon)] px-4 py-2.5 text-xs font-black uppercase tracking-wide text-[var(--tf-navy)] transition hover:brightness-110 sm:w-auto"
                  >
                    {nextGameAction.label}
                  </Link>
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

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 lg:py-20">
        <div>
          <div className="border-b border-white/15 pb-5">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-[var(--tf-neon)]">
                Season
              </p>
              <h2 className="font-display mt-2 text-4xl font-bold uppercase leading-none text-white md:text-5xl">
                Schedule Snapshot
              </h2>
            </div>
          </div>

          <div className="divide-y divide-white/10">
            {(upcomingGames.length ? upcomingGames : [nextGame]).map((game) => {
              const date = formatGameDate(game.dateISO);
              const mapHref = getMapHref(game.address);
              return (
                <div
                  key={game.id}
                  className="grid grid-cols-[44px_minmax(0,1fr)] gap-x-3 gap-y-2 overflow-hidden py-4 md:grid-cols-[80px_1fr_auto] md:items-center md:gap-4 md:py-5"
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
                        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--tf-neon)] md:text-xs md:tracking-[0.18em]">
                          {game.opponentMascot}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="col-start-2 min-w-0 md:col-span-1 md:col-start-2">
                    <p className="break-words text-sm text-zinc-400 [overflow-wrap:anywhere] md:mt-2">
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
                    <span className="col-start-2 w-fit rounded-sm border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-wide text-zinc-300 md:col-start-auto">
                      {game.result}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="border-t border-white/10 pt-5">
            <Link
              href="/schedule"
              className="text-sm font-black uppercase tracking-wide text-[var(--tf-neon)] hover:text-white"
            >
              View full schedule
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
