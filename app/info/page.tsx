import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Info",
  description: "Facilities, quick facts, and program information for Timpanogos football.",
};

const infoLinks = [
  {
    href: "/team-calendar",
    label: "Team Calendar",
    eyebrow: "Calendar",
    description:
      "Practice, event, and team calendar details with Google Calendar access.",
  },
  {
    href: "/records",
    label: "Records",
    eyebrow: "History",
    description:
      "Known public Timpanogos football records, stat leaders, and source notes.",
  },
] as const;

export default function InfoPage() {
  return (
    <main className="bg-slate-100">
      <section className="bg-[var(--tf-black)] text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--tf-neon)]">
            Info
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-[1fr_0.75fr] md:items-end">
            <h1 className="font-display text-5xl font-bold uppercase leading-[0.9] md:text-7xl">
              Program hub
            </h1>
            <p className="max-w-xl text-base leading-7 text-zinc-300">
              Team calendar access and program history live here, organized for quick
              scans during the season.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-10 md:grid-cols-2 md:px-6 md:py-14">
        {infoLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative overflow-hidden border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[var(--tf-neon)] hover:shadow-xl"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-[var(--tf-neon)] opacity-80" />
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--tf-navy)]">
              {item.eyebrow}
            </p>
            <h2 className="font-display mt-4 text-3xl font-bold uppercase text-slate-950">
              {item.label}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
              {item.description}
            </p>
            <span className="mt-8 inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-[var(--tf-navy)] transition group-hover:gap-3">
              Open
              <span aria-hidden="true">&rarr;</span>
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}
