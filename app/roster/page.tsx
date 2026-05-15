import type { Metadata } from "next";
import Image from "next/image";
import { getRosterPlayers, type Prospect as RosterPlayer } from "@/lib/data/prospects";

export const metadata: Metadata = {
  title: "Roster",
  description: "Timpanogos football roster.",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function PlayerCard({ player }: { player: RosterPlayer }) {
  const measurables = [player.height, player.weight].filter(Boolean).join(" / ");

  return (
    <article className="group relative aspect-[4/5] overflow-hidden border border-white/10 bg-white/[0.055] shadow-xl shadow-black/20">
      {player.photoUrl ? (
        <Image
          src={player.photoUrl}
          alt=""
          fill
          sizes="(max-width: 768px) 50vw, 300px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--tf-navy),#101827)] font-display text-4xl font-bold text-white">
          {getInitials(player.name)}
        </div>
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,9,23,0.08)_0%,rgba(2,9,23,0.18)_38%,rgba(2,9,23,0.92)_100%)]" />
      {player.jerseyNumber ? (
        <p className="absolute left-4 top-4 font-display text-5xl font-bold leading-none text-white/85">
          #{player.jerseyNumber}
        </p>
      ) : null}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h2 className="font-display text-2xl font-bold uppercase leading-none text-white">
          {player.name}
        </h2>
        <p className="mt-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--tf-neon)]">
          {player.positions.join(" / ")} · Class of {player.classYear}
        </p>
        {measurables ? (
          <p className="mt-3 font-mono text-xs font-bold uppercase text-zinc-300">
            {measurables}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export default async function RosterPage() {
  const players = await getRosterPlayers();

  return (
    <main className="bg-[var(--tf-black)] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[var(--tf-navy)] px-4 py-14 md:px-6 lg:py-20">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:84px_84px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(57,255,20,0.14),transparent_30%),linear-gradient(90deg,rgba(2,9,23,0.98)_0%,rgba(2,9,23,0.82)_100%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.36em] text-[var(--tf-neon)]">
            Team
          </p>
          <h1 className="font-display mt-5 max-w-4xl text-6xl font-bold uppercase leading-[0.86] tracking-tight text-white md:text-8xl">
            Roster
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
            Player profiles for the Timpanogos football program.
          </p>
        </div>
      </section>

      <section className="relative isolate overflow-hidden px-4 py-10 md:px-6 lg:py-14">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(57,255,20,0.08),transparent_32%)]" />
        <div className="relative mx-auto max-w-7xl">
          {players.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {players.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-white/20 bg-white/[0.055] p-8 md:p-10">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--tf-neon)]">
                Roster Coming Soon
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold uppercase leading-none text-white">
                Player profiles are being prepared.
              </h2>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
