import type { Metadata } from "next";
import Link from "next/link";
import { ProspectBoard } from "@/components/prospect-board";
import { getProspects } from "@/lib/data/prospects";

export const metadata: Metadata = {
  title: "Prospects",
  description:
    "Timpanogos football prospect profiles for college coaches and recruiters.",
};

const classes = ["2027", "2028", "2029", "2030"];

export default async function ProspectsPage() {
  const prospects = await getProspects();
  const availableCount = prospects.filter((prospect) => prospect.status === "available").length;

  return (
    <main className="bg-[var(--tf-black)] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[var(--tf-navy)]">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:84px_84px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(57,255,20,0.16),transparent_30%),linear-gradient(90deg,rgba(2,9,23,0.98)_0%,rgba(2,9,23,0.88)_48%,rgba(2,9,23,0.68)_100%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 md:px-6 lg:grid-cols-[1fr_390px] lg:items-end lg:py-20">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.36em] text-[var(--tf-neon)]">
              College Recruiting
            </p>
            <h1 className="font-display mt-5 max-w-4xl text-6xl font-bold uppercase leading-[0.86] tracking-tight text-white md:text-8xl">
              Prospects
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
              A public recruiting board for college coaches evaluating Timpanogos
              football athletes.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#prospect-board"
                className="inline-flex items-center justify-center bg-[var(--tf-neon)] px-6 py-3 text-sm font-black uppercase tracking-wide text-[var(--tf-navy)] transition hover:brightness-110"
              >
                View Profiles
              </a>
              <Link
                href="/staff"
                className="inline-flex items-center justify-center border border-white/25 bg-black/20 px-6 py-3 text-sm font-black uppercase tracking-wide text-white backdrop-blur transition hover:border-[var(--tf-neon)] hover:text-[var(--tf-neon)]"
              >
                Contact Staff
              </Link>
            </div>
          </div>

          <aside className="border border-white/10 bg-black/35 p-5 shadow-2xl shadow-black/25 backdrop-blur">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--tf-neon)]">
              Board Snapshot
            </p>
            <div className="mt-5 grid gap-px bg-white/10">
              {[
                ["Published", prospects.length.toString()],
                ["Available", availableCount.toString()],
                ["Classes", classes.join(" / ")],
              ].map(([label, value]) => (
                <div key={label} className="bg-[var(--tf-black)] px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    {label}
                  </p>
                  <p className="font-display mt-1 text-2xl font-bold uppercase text-white">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section
        id="prospect-board"
        className="relative isolate overflow-hidden px-4 py-12 md:px-6 lg:py-16"
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(57,255,20,0.08),transparent_32%)]" />
        <div className="relative mx-auto max-w-7xl">
          {prospects.length > 0 ? (
            <ProspectBoard prospects={prospects} />
          ) : (
            <div className="border border-dashed border-white/20 bg-white/[0.055] p-8 md:p-10">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--tf-neon)]">
                Profiles Coming Soon
              </p>
              <h2 className="font-display mt-4 text-4xl font-bold uppercase leading-none text-white">
                Prospect board is being prepared.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
                This page is ready for player profiles with photos, class year,
                positions, measurables, Hudl links, honors, stats, and public contact
                links. GPA and coach evaluation quotes are intentionally excluded.
              </p>
              <Link
                href="/staff"
                className="mt-6 inline-flex bg-[var(--tf-neon)] px-5 py-3 text-xs font-black uppercase tracking-wide text-[var(--tf-navy)] transition hover:brightness-110"
              >
                Contact Staff
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
