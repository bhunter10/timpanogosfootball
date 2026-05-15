import { getRosterPlayers } from "@/lib/data/prospects";
import { createRosterPlayer, deleteRosterPlayer, updateRosterPlayer } from "../actions";

type AdminRosterPageProps = {
  searchParams: Promise<{ rosterError?: string | string[] }>;
};

function listValue(values?: string[]) {
  return values?.join("\n") ?? "";
}

export default async function AdminRosterPage({ searchParams }: AdminRosterPageProps) {
  const { rosterError } = await searchParams;
  const uploadError = Array.isArray(rosterError) ? rosterError[0] : rosterError;
  const players = await getRosterPlayers();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white">Roster</h1>
      <p className="mt-2 text-sm text-zinc-400">
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
        {players.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">No players yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {players.map((player) => (
              <li
                key={player.id}
                className="rounded-xl border border-white/10 bg-zinc-900/40 p-4 text-sm text-zinc-200"
              >
                <div className="flex items-start gap-2">
                  <details className="min-w-0 flex-1">
                    <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-white">
                          {player.jerseyNumber ? `#${player.jerseyNumber} ` : ""}
                          {player.name}
                        </span>
                        <span className="block truncate text-xs text-zinc-500">
                          Class of {player.classYear} - {player.positions.join(" / ")}
                          {player.isProspect ? " - prospect" : ""}
                        </span>
                      </span>
                      <span className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-white/10">
                        Edit
                      </span>
                    </summary>
                    <form action={updateRosterPlayer} className="mt-4 grid gap-3 md:grid-cols-2">
                      <input type="hidden" name="id" value={player.id} />
                      <PlayerFields player={player} />
                      <div className="md:col-span-2">
                        <button
                          type="submit"
                          className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/15"
                        >
                          Save changes
                        </button>
                      </div>
                    </form>
                  </details>
                  <form action={deleteRosterPlayer} className="shrink-0">
                    <input type="hidden" name="id" value={player.id} />
                    <button
                      type="submit"
                      className="rounded-full border border-red-500/40 px-4 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-950/40"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

type PlayerFieldData = Awaited<ReturnType<typeof getRosterPlayers>>[number];

function PlayerFields({ player }: { player?: PlayerFieldData }) {
  return (
    <>
      <label className="text-xs font-medium text-zinc-400">
        Name
        <input
          name="name"
          required
          defaultValue={player?.name ?? ""}
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        Jersey number
        <input
          name="jerseyNumber"
          defaultValue={player?.jerseyNumber ?? ""}
          placeholder="12"
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        Class year
        <input
          name="classYear"
          required
          defaultValue={player?.classYear ?? ""}
          placeholder="2027"
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        Positions
        <input
          name="positions"
          required
          defaultValue={player?.positions.join(", ") ?? ""}
          placeholder="WR, DB"
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        Height
        <input
          name="height"
          defaultValue={player?.height ?? ""}
          placeholder="6'1&quot;"
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        Weight
        <input
          name="weight"
          defaultValue={player?.weight ?? ""}
          placeholder="180"
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-400 md:col-span-2">
        Photo upload
        <input
          name="photoFile"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/15"
        />
      </label>
      <label className="text-xs font-medium text-zinc-400 md:col-span-2">
        Photo URL override
        <input
          name="photoUrl"
          defaultValue={player?.photoUrl ?? ""}
          placeholder="https://firebasestorage.googleapis.com/..."
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        Hudl URL
        <input
          name="hudlUrl"
          type="url"
          defaultValue={player?.hudlUrl ?? ""}
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        X profile URL
        <input
          name="xUrl"
          type="url"
          defaultValue={player?.xUrl ?? ""}
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        Instagram profile URL
        <input
          name="instagramUrl"
          type="url"
          defaultValue={player?.instagramUrl ?? ""}
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        Public contact email
        <input
          name="email"
          type="email"
          defaultValue={player?.email ?? ""}
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        Recruiting status
        <select
          name="status"
          defaultValue={player?.status ?? "available"}
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        >
          <option value="available">Available</option>
          <option value="committed">Committed</option>
        </select>
      </label>
      <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-zinc-950 px-3 py-2 text-xs font-medium text-zinc-300 md:col-span-2">
        <input
          name="isProspect"
          type="checkbox"
          defaultChecked={player?.isProspect ?? false}
          className="size-4"
        />
        Show on prospects page
      </label>
      <label className="text-xs font-medium text-zinc-400 md:col-span-2">
        Honors
        <textarea
          name="honors"
          rows={2}
          defaultValue={listValue(player?.honors)}
          placeholder="One per line, or comma-separated"
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-400 md:col-span-2">
        Stats
        <textarea
          name="stats"
          rows={2}
          defaultValue={listValue(player?.stats)}
          placeholder="One per line, or comma-separated"
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        Sort order
        <input
          name="sortOrder"
          type="number"
          defaultValue={player?.sortOrder ?? 0}
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
        />
      </label>
    </>
  );
}
