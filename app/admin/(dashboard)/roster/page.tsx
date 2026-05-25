import { getRosterPlayers } from "@/lib/data/prospects";
import { createRosterPlayer } from "../actions";
import { PlayerFields, RosterDirectory } from "./roster-directory";

type AdminRosterPageProps = {
  searchParams: Promise<{ rosterError?: string | string[] }>;
};

export default async function AdminRosterPage({ searchParams }: AdminRosterPageProps) {
  const { rosterError } = await searchParams;
  const uploadError = Array.isArray(rosterError) ? rosterError[0] : rosterError;
  const players = await getRosterPlayers();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white">Roster</h1>
      <p className="mt-2 text-sm text-zinc-300">
        Manage player profiles. Check “Show on prospects page” to publish a player to the
        college recruiting board.
      </p>

      {uploadError ? (
        <div className="mt-6 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">
          {uploadError}
        </div>
      ) : null}

      <section className="mt-10 rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
        <h2 className="text-sm font-semibold text-white">Add player</h2>
        <form action={createRosterPlayer} className="mt-4 grid gap-4 md:grid-cols-2">
          <PlayerFields />
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-white/10 px-5 py-2 text-sm font-semibold text-white hover:bg-white/15"
            >
              Add player
            </button>
          </div>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-white">Players</h2>
        <RosterDirectory
          key={players
            .map((player) =>
              [
                player.id,
                player.sortOrder,
                player.name,
                player.jerseyNumber,
                player.classYear,
                player.positions.join("/"),
                player.height,
                player.weight,
                player.photoUrl,
                player.hudlUrl,
                player.xUrl,
                player.instagramUrl,
                player.email,
                player.status,
                player.honors?.join("/"),
                player.stats?.join("/"),
                player.isProspect,
              ].join(":"),
            )
            .join("|")}
          players={players}
        />
      </section>
    </div>
  );
}
