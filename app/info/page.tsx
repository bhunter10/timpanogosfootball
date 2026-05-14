import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/site-settings";

export const metadata: Metadata = {
  title: "Info",
  description: "Facilities, quick facts, and program information for Timpanogos football.",
};

export default async function InfoPage() {
  const settings = await getSiteSettings();
  const highlights = settings.infoHighlights ?? [
    "Practice and game updates are shared through official school channels.",
    "Student-athletes must remain eligible through the athletic department and region.",
    "Visitor guides and facility maps can be added here when available.",
  ];

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--tf-neon)]">
        Info
      </p>
      <h1 className="font-display mt-2 text-4xl font-bold text-slate-900">
        Program information
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-600">
        Use this page for quick facts, facility notes, and policies that stay consistent
        all season. Detailed items can be edited from the admin console when Firebase is
        connected.
      </p>

      <ul className="mt-10 space-y-4">
        {highlights.map((line) => (
          <li
            key={line}
            className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4 text-slate-700 shadow-sm"
          >
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--tf-neon)]" />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      {settings.footerNote ? (
        <p className="mt-10 text-sm leading-relaxed text-slate-500">{settings.footerNote}</p>
      ) : null}
    </main>
  );
}
