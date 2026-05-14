import type { Metadata } from "next";
import Image from "next/image";
import { getScheduleGames } from "@/lib/data/schedule";
import type { ScheduleGame } from "@/types/firestore";

export const metadata: Metadata = {
  title: "Schedule",
  description: "Timpanogos football schedule, opponents, and locations.",
};

function formatGameDate(iso: string) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) {
      return { month: "TBD", day: "--", weekday: "", time: "Time TBD" };
    }
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
    return { month: "TBD", day: "--", weekday: "", time: iso || "Time TBD" };
  }
}

function getMapHref(address?: string) {
  if (!address) return undefined;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
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

function OpponentLogo({
  game,
  size = "md",
}: {
  game: ScheduleGame;
  size?: "md" | "lg";
}) {
  const box = size === "lg" ? "h-20 w-20" : "h-16 w-16";
  const imageSize = size === "lg" ? "80px" : "64px";

  return (
    <div
      className={`relative flex ${box} shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] shadow-lg shadow-black/20`}
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
  const date = formatGameDate(game.dateISO);
  const mapHref = getMapHref(game.address);

  return (
    <article className="group rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-white shadow-lg shadow-black/10 backdrop-blur transition hover:border-[var(--tf-neon)]/50 hover:bg-white/[0.09]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <OpponentLogo game={game} />
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--tf-neon)]">
              {game.isHome ? "Home" : "Away"}
            </p>
            <h2 className="font-display mt-1 truncate text-3xl font-bold uppercase leading-none">
              {game.isHome ? "vs " : "@ "}
              {game.opponent}
            </h2>
            {game.opponentMascot ? (
              <p className="mt-1 truncate text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                {game.opponentMascot}
              </p>
            ) : null}
          </div>
        </div>
        <div className="rounded-xl bg-[var(--tf-neon)] px-3 py-2 text-center text-[var(--tf-navy)]">
          <p className="text-[10px] font-black uppercase tracking-widest">
            {date.month}
          </p>
          <p className="font-display text-3xl font-bold leading-none">{date.day}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-white/10 pt-4 text-sm text-zinc-300 sm:grid-cols-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
            Kickoff
          </p>
          <p className="mt-1 font-semibold text-white">{date.time}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
            Location
          </p>
          {mapHref ? (
            <a
              href={mapHref}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block font-semibold text-white underline decoration-white/25 underline-offset-4 hover:text-[var(--tf-neon)]"
            >
              {game.location || "Location TBD"}
            </a>
          ) : (
            <p className="mt-1 font-semibold text-white">
              {game.location || "Location TBD"}
            </p>
          )}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
            Status
          </p>
          <p className="mt-1 font-semibold text-white">{game.result ?? "Preview"}</p>
        </div>
      </div>
    </article>
  );
}

export default async function SchedulePage() {
  const games = await getScheduleGames();
  const nextGame = games.find((game) => !game.result) ?? games[0];
  const nextGameDate = nextGame ? formatGameDate(nextGame.dateISO) : null;
  const nextGameMapHref = nextGame ? getMapHref(nextGame.address) : undefined;

  return (
    <main className="bg-[var(--tf-black)] text-white">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.4fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--tf-neon)]">
              2026 Varsity
            </p>
            <h1 className="font-display mt-4 text-6xl font-bold uppercase leading-[0.88] text-white md:text-8xl">
              Schedule
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-400 md:text-base">
              Game dates and times are maintained by the program. Check back for late
              changes, results, and matchup details throughout the season.
            </p>
          </div>

          {nextGame ? (
            <section className="overflow-hidden rounded-3xl border border-[var(--tf-neon)]/40 bg-[var(--tf-neon)] text-[var(--tf-navy)] shadow-2xl shadow-[var(--tf-neon)]/15">
              <div className="grid gap-px bg-[var(--tf-navy)]/20 md:grid-cols-[1fr_220px]">
                <div className="bg-[var(--tf-neon)] p-5 md:p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em]">
                    Next Game
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <OpponentLogo game={nextGame} size="lg" />
                    <div>
                      <h2 className="font-display text-4xl font-bold uppercase leading-none md:text-5xl">
                        {nextGame.isHome ? "vs " : "@ "}
                        {nextGame.opponent}
                      </h2>
                      {nextGame.opponentMascot ? (
                        <p className="mt-1 text-xs font-black uppercase tracking-[0.18em]">
                          {nextGame.opponentMascot}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 bg-[var(--tf-navy)] text-white md:grid-cols-1">
                  <div className="p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--tf-neon)]">
                      Date
                    </p>
                    <p className="font-display mt-1 text-2xl font-bold md:text-3xl">
                      {nextGameDate?.month} {nextGameDate?.day}
                    </p>
                  </div>
                  <div className="border-l border-white/10 p-4 md:border-l-0 md:border-t">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--tf-neon)]">
                      Time
                    </p>
                    <p className="font-display mt-1 text-2xl font-bold md:text-3xl">
                      {nextGameDate?.time}
                    </p>
                  </div>
                  <div className="border-l border-white/10 p-4 md:border-l-0 md:border-t">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--tf-neon)]">
                      Site
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
          <div className="mt-10 rounded-3xl border border-dashed border-white/20 bg-white/[0.04] p-10 text-center text-zinc-400">
            The schedule has not been published yet. Check back soon.
          </div>
        ) : (
          <section className="mt-10">
            <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[var(--tf-neon)]">
                  Matchups
                </p>
                <h2 className="font-display mt-1 text-4xl font-bold uppercase leading-none">
                  Season Games
                </h2>
              </div>
              <span className="rounded-full border border-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-zinc-300">
                {games.length} Games
              </span>
            </div>
            <div className="mt-5 grid gap-4 xl:grid-cols-2">
              {games.map((game) => (
                <GameTile key={game.id} game={game} />
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
