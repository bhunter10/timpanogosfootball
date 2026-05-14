import Image from "next/image";
import { getOpponents } from "@/lib/data/opponents";
import { createOpponent, deleteOpponent, updateOpponent } from "../actions";

type AdminOpponentsPageProps = {
  searchParams: Promise<{ opponentError?: string | string[] }>;
};

const inputClass =
  "mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white";

export default async function AdminOpponentsPage({
  searchParams,
}: AdminOpponentsPageProps) {
  const { opponentError } = await searchParams;
  const uploadError = Array.isArray(opponentError)
    ? opponentError[0]
    : opponentError;
  const opponents = await getOpponents();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white">Opponents</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Maintain school logos and opponent details once, then select them when creating
        schedule games. Logos can be JPG, PNG, or WebP up to 2 MB; uploads are resized
        to fit within 400x400 and saved as WebP.
      </p>

      {uploadError ? (
        <div className="mt-6 rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-100">
          {uploadError}
        </div>
      ) : null}

      <section className="mt-10 rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
        <h2 className="text-sm font-semibold text-white">Add opponent</h2>
        <form action={createOpponent} className="mt-4 grid gap-4 md:grid-cols-2">
          <OpponentFields />
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-[var(--tf-neon)] px-5 py-2 text-sm font-semibold text-[var(--tf-navy)] hover:brightness-110"
            >
              Add opponent
            </button>
          </div>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-white">Master list</h2>
        {opponents.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">No opponents yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {opponents.map((opponent) => (
              <li
                key={opponent.id}
                className="rounded-xl border border-white/10 bg-zinc-900/40 p-4 text-sm text-zinc-200"
              >
                <div className="flex items-start gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white">
                    {opponent.logoUrl ? (
                      <Image
                        src={opponent.logoUrl}
                        alt=""
                        fill
                        unoptimized
                        sizes="56px"
                        className="object-contain p-1.5"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-bold text-zinc-500">
                        Logo
                      </div>
                    )}
                  </div>
                  <details className="min-w-0 flex-1">
                    <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-white">
                          {opponent.schoolName}
                        </span>
                        <span className="block truncate text-xs text-zinc-500">
                          {[opponent.mascot, opponent.address, opponent.city, opponent.state]
                            .filter(Boolean)
                            .join(" · ") || "No extra details"}
                        </span>
                      </span>
                      <span className="rounded-full border border-[var(--tf-neon)]/40 px-4 py-1.5 text-xs font-semibold text-[var(--tf-neon)] hover:bg-[var(--tf-neon)]/10">
                        Edit
                      </span>
                    </summary>
                    <form action={updateOpponent} className="mt-4 grid gap-3 md:grid-cols-2">
                      <input type="hidden" name="id" value={opponent.id} />
                      <OpponentFields opponent={opponent} />
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
                  <form action={deleteOpponent} className="shrink-0">
                    <input type="hidden" name="id" value={opponent.id} />
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

function OpponentFields({
  opponent,
}: {
  opponent?: Awaited<ReturnType<typeof getOpponents>>[number];
}) {
  return (
    <>
      <label className="text-xs font-medium text-zinc-400">
        School name
        <input
          name="schoolName"
          required
          defaultValue={opponent?.schoolName ?? ""}
          placeholder="Jordan High School"
          className={inputClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        Short name
        <input
          name="shortName"
          defaultValue={opponent?.shortName ?? ""}
          placeholder="Jordan"
          className={inputClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        Mascot
        <input
          name="mascot"
          defaultValue={opponent?.mascot ?? ""}
          placeholder="Beetdiggers"
          className={inputClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        Sort order
        <input
          name="sortOrder"
          type="number"
          defaultValue={opponent?.sortOrder ?? 0}
          className={inputClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        Primary color
        <input
          name="primaryColor"
          defaultValue={opponent?.primaryColor ?? ""}
          placeholder="#0f172a"
          className={inputClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        Secondary color
        <input
          name="secondaryColor"
          defaultValue={opponent?.secondaryColor ?? ""}
          placeholder="#ffffff"
          className={inputClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-400 md:col-span-2">
        Address
        <input
          name="address"
          defaultValue={opponent?.address ?? ""}
          placeholder="1450 N 200 E, Orem, UT 84057"
          className={inputClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        City
        <input
          name="city"
          defaultValue={opponent?.city ?? ""}
          placeholder="Sandy"
          className={inputClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-400">
        State
        <input
          name="state"
          defaultValue={opponent?.state ?? "UT"}
          className={inputClass}
        />
      </label>
      <label className="text-xs font-medium text-zinc-400 md:col-span-2">
        Logo upload
        <input
          name="logoFile"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/15"
        />
      </label>
      <label className="text-xs font-medium text-zinc-400 md:col-span-2">
        Logo URL override
        <input
          name="logoUrl"
          defaultValue={opponent?.logoUrl ?? ""}
          placeholder="https://firebasestorage.googleapis.com/..."
          className={inputClass}
        />
      </label>
    </>
  );
}
