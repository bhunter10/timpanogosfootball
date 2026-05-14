import { getOpponents } from "@/lib/data/opponents";
import { getScheduleGames } from "@/lib/data/schedule";
import {
  createScheduleGame,
  deleteScheduleGame,
  updateScheduleGame,
} from "../actions";

export const dynamic = "force-dynamic";

function toDatetimeLocalValue(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function AdminSchedulePage() {
  const [games, opponents] = await Promise.all([getScheduleGames(), getOpponents()]);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white">Schedule</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Store ISO timestamps for kickoff (local time). The public site formats them for
        readers. Opponent addresses are managed on the opponents page.
      </p>

      <section className="mt-10 rounded-2xl border border-[var(--tf-neon)]/20 bg-[var(--tf-black)]/70 p-6 shadow-lg shadow-black/20">
        <h2 className="text-sm font-semibold text-white">Add game</h2>
        <form action={createScheduleGame} className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-xs font-medium text-zinc-400">
            Opponent from master list
            <select
              name="opponentId"
              defaultValue=""
              className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none ring-[var(--tf-neon)] focus:ring-2"
            >
              <option value="">Manual opponent</option>
              {opponents.map((opponent) => (
                <option key={opponent.id} value={opponent.id}>
                  {opponent.schoolName}
                  {opponent.mascot ? ` ${opponent.mascot}` : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs font-medium text-zinc-400">
            Manual opponent fallback
            <input
              name="opponent"
              placeholder="e.g. Maple Mountain"
              className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none ring-[var(--tf-neon)] focus:ring-2"
            />
          </label>
          <label className="text-xs font-medium text-zinc-400">
            Kickoff date & time
            <input
              name="kickoffLocal"
              type="datetime-local"
              required
              className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none ring-[var(--tf-neon)] focus:ring-2"
            />
          </label>
          <label className="text-xs font-medium text-zinc-400 md:col-span-2">
            Location
            <input
              name="location"
              required
              placeholder="Timpanogos Stadium"
              className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none ring-[var(--tf-neon)] focus:ring-2"
            />
          </label>
          <label className="text-xs font-medium text-zinc-400">
            Home / Away
            <select
              name="isHome"
              defaultValue="true"
              className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none ring-[var(--tf-neon)] focus:ring-2"
            >
              <option value="true">Home</option>
              <option value="false">Away</option>
            </select>
          </label>
          <label className="text-xs font-medium text-zinc-400">
            Sort order
            <input
              name="sortOrder"
              type="number"
              defaultValue={0}
              className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none ring-[var(--tf-neon)] focus:ring-2"
            />
          </label>
          <label className="text-xs font-medium text-zinc-400 md:col-span-2">
            Result (optional)
            <input
              name="result"
              placeholder="W 28-14"
              className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none ring-[var(--tf-neon)] focus:ring-2"
            />
          </label>
          <label className="text-xs font-medium text-zinc-400 md:col-span-2">
            Notes (optional)
            <input
              name="notes"
              className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none ring-[var(--tf-neon)] focus:ring-2"
            />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-[var(--tf-neon)] px-5 py-2 text-sm font-semibold text-[var(--tf-navy)] shadow-sm shadow-[var(--tf-neon)]/20 hover:brightness-110"
            >
              Add game
            </button>
          </div>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-white">Season games</h2>
        {games.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">No games yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {games.map((g) => (
              <li
                key={g.id}
                className="rounded-xl border border-white/10 bg-zinc-900/40 p-4 text-sm text-zinc-200"
              >
                <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
                  <div className="md:col-start-1 md:row-start-1">
                    <p className="font-medium text-white">
                      {g.isHome ? "vs" : "@"} {g.opponent}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {g.dateISO} · {g.location}
                    </p>
                  </div>

                  <details className="md:contents">
                    <summary className="w-fit cursor-pointer list-none rounded-full border border-[var(--tf-neon)]/50 px-4 py-1.5 text-xs font-semibold text-[var(--tf-neon)] hover:bg-[var(--tf-neon)]/10 md:col-start-2 md:row-start-1">
                      Edit
                    </summary>
                    <form
                      action={updateScheduleGame}
                      className="mt-4 grid gap-4 md:col-span-3 md:grid-cols-2"
                    >
                      <input type="hidden" name="id" value={g.id} />
                      <label className="text-xs font-medium text-zinc-400">
                        Opponent from master list
                        <select
                          name="opponentId"
                          defaultValue={g.opponentId ?? ""}
                          className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none ring-[var(--tf-neon)] focus:ring-2"
                        >
                          <option value="">Manual opponent</option>
                          {opponents.map((opponent) => (
                            <option key={opponent.id} value={opponent.id}>
                              {opponent.schoolName}
                              {opponent.mascot ? ` ${opponent.mascot}` : ""}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="text-xs font-medium text-zinc-400">
                        Manual opponent fallback
                        <input
                          name="opponent"
                          defaultValue={g.opponent}
                          className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none ring-[var(--tf-neon)] focus:ring-2"
                        />
                      </label>
                      <label className="text-xs font-medium text-zinc-400">
                        Kickoff date & time
                        <input
                          name="kickoffLocal"
                          type="datetime-local"
                          required
                          defaultValue={toDatetimeLocalValue(g.dateISO)}
                          className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none ring-[var(--tf-neon)] focus:ring-2"
                        />
                      </label>
                      <label className="text-xs font-medium text-zinc-400 md:col-span-2">
                        Location
                        <input
                          name="location"
                          required
                          defaultValue={g.location}
                          className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none ring-[var(--tf-neon)] focus:ring-2"
                        />
                      </label>
                      <label className="text-xs font-medium text-zinc-400">
                        Home / Away
                        <select
                          name="isHome"
                          defaultValue={String(g.isHome)}
                          className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none ring-[var(--tf-neon)] focus:ring-2"
                        >
                          <option value="true">Home</option>
                          <option value="false">Away</option>
                        </select>
                      </label>
                      <label className="text-xs font-medium text-zinc-400">
                        Sort order
                        <input
                          name="sortOrder"
                          type="number"
                          defaultValue={g.sortOrder}
                          className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none ring-[var(--tf-neon)] focus:ring-2"
                        />
                      </label>
                      <label className="text-xs font-medium text-zinc-400 md:col-span-2">
                        Result (optional)
                        <input
                          name="result"
                          defaultValue={g.result ?? ""}
                          placeholder="W 28-14"
                          className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none ring-[var(--tf-neon)] focus:ring-2"
                        />
                      </label>
                      <label className="text-xs font-medium text-zinc-400 md:col-span-2">
                        Notes (optional)
                        <input
                          name="notes"
                          defaultValue={g.notes ?? ""}
                          className="mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none ring-[var(--tf-neon)] focus:ring-2"
                        />
                      </label>
                      <button
                        type="submit"
                        className="rounded-full bg-[var(--tf-neon)] px-5 py-2 text-sm font-semibold text-[var(--tf-navy)] shadow-sm shadow-[var(--tf-neon)]/20 hover:brightness-110 md:col-span-2 md:w-fit"
                      >
                        Save changes
                      </button>
                    </form>
                  </details>

                  <form action={deleteScheduleGame} className="md:col-start-3 md:row-start-1">
                    <input type="hidden" name="id" value={g.id} />
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
