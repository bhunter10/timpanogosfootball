import { getOpponents } from "@/lib/data/opponents";
import { getScheduleGames } from "@/lib/data/schedule";
import {
  createScheduleGame,
  deleteScheduleGame,
  updateScheduleGame,
} from "../actions";
import {
  scheduleTeamLevels,
  type Opponent,
  type ScheduleGame,
  type ScheduleTeamLevel,
} from "@/types/firestore";

export const dynamic = "force-dynamic";

const fieldClass =
  "mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none ring-[var(--tf-neon)] focus:ring-2";

function toDatetimeLocalValue(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatAdminGameDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Date TBD";
  const datePart = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
  return `${datePart} at ${timePart}`;
}

function getTeamLevelLabel(teamLevel: ScheduleTeamLevel) {
  return (
    scheduleTeamLevels.find((level) => level.value === teamLevel)?.label ?? "Varsity"
  );
}

function TeamLevelSelect({
  defaultValue = "varsity",
}: {
  defaultValue?: ScheduleTeamLevel;
}) {
  return (
    <label className="text-xs font-medium text-zinc-400">
      Team
      <select name="teamLevel" defaultValue={defaultValue} className={fieldClass}>
        {scheduleTeamLevels.map((level) => (
          <option key={level.value} value={level.value}>
            {level.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ScheduleGameFields({
  game,
  opponents,
}: {
  game?: ScheduleGame;
  opponents: Opponent[];
}) {
  return (
    <>
      <TeamLevelSelect defaultValue={game?.teamLevel ?? "varsity"} />
      <label className="text-xs font-medium text-zinc-400">
        Opponent from master list
        <select
          name="opponentId"
          defaultValue={game?.opponentId ?? ""}
          className={fieldClass}
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
          defaultValue={game?.opponent ?? ""}
          placeholder="e.g. Maple Mountain"
          className={fieldClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        Kickoff date & time
        <input
          name="kickoffLocal"
          type="datetime-local"
          required
          defaultValue={game ? toDatetimeLocalValue(game.dateISO) : ""}
          className={fieldClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-400 md:col-span-2">
        Location
        <input
          name="location"
          required
          defaultValue={game?.location ?? ""}
          placeholder="Timpanogos Stadium"
          className={fieldClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        Home / Away
        <select
          name="isHome"
          defaultValue={String(game?.isHome ?? true)}
          className={fieldClass}
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
          defaultValue={game?.sortOrder ?? 0}
          className={fieldClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-400 md:col-span-2">
        Result (optional)
        <input
          name="result"
          defaultValue={game?.result ?? ""}
          placeholder="W 28-14"
          className={fieldClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-400 md:col-span-2">
        Notes (optional)
        <input
          name="notes"
          defaultValue={game?.notes ?? ""}
          className={fieldClass}
        />
      </label>
    </>
  );
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
          <ScheduleGameFields opponents={opponents} />
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
          <div className="mt-4 space-y-8">
            {scheduleTeamLevels.map((level) => {
              const levelGames = games.filter((game) => game.teamLevel === level.value);
              return (
                <div key={level.value}>
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2">
                    <h3 className="text-xs font-black uppercase tracking-[0.22em] text-[var(--tf-neon)]">
                      {level.label}
                    </h3>
                    <span className="text-xs font-semibold text-zinc-500">
                      {levelGames.length} {levelGames.length === 1 ? "game" : "games"}
                    </span>
                  </div>

                  {levelGames.length === 0 ? (
                    <p className="mt-3 text-sm text-zinc-500">
                      No {level.label} games yet.
                    </p>
                  ) : (
                    <ul className="mt-3 space-y-3">
                      {levelGames.map((game) => (
                        <li
                          key={game.id}
                          className="rounded-xl border border-white/10 bg-zinc-900/40 p-4 text-sm text-zinc-200"
                        >
                          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
                            <div className="md:col-start-1 md:row-start-1">
                              <p className="font-medium text-white">
                                <span className="mr-2 rounded-full border border-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                                  {getTeamLevelLabel(game.teamLevel)}
                                </span>
                                {game.isHome ? "vs" : "@"} {game.opponent}
                              </p>
                              <p className="mt-1 text-sm text-zinc-400">
                                {formatAdminGameDate(game.dateISO)} · {game.location}
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
                                <input type="hidden" name="id" value={game.id} />
                                <ScheduleGameFields game={game} opponents={opponents} />
                                <button
                                  type="submit"
                                  className="rounded-full bg-[var(--tf-neon)] px-5 py-2 text-sm font-semibold text-[var(--tf-navy)] shadow-sm shadow-[var(--tf-neon)]/20 hover:brightness-110 md:col-span-2 md:w-fit"
                                >
                                  Save changes
                                </button>
                              </form>
                            </details>

                            <form
                              action={deleteScheduleGame}
                              className="md:col-start-3 md:row-start-1"
                            >
                              <input type="hidden" name="id" value={game.id} />
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
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
