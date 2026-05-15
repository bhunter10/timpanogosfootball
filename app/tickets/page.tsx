import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/site-settings";

export const metadata: Metadata = {
  title: "Tickets",
  description: "Purchase tickets and learn about game-day policies for Timpanogos football.",
};

export default async function TicketsPage() {
  const settings = await getSiteSettings();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--tf-neon)]">
        Tickets
      </p>
      <h1 className="font-display mt-2 text-4xl font-bold text-slate-900">
        Game tickets
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-600">
        {settings.ticketBlurb}
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        {settings.ticketUrl ? (
          <a
            href={settings.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[var(--tf-navy)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--tf-black)]"
          >
            Buy tickets
          </a>
        ) : (
          <span className="inline-flex items-center justify-center rounded-full border border-dashed border-slate-300 px-6 py-3 text-sm text-slate-500">
            Ticket link coming soon — check with the athletic office.
          </span>
        )}
        {settings.ticketSecondaryUrl ? (
          <a
            href={settings.ticketSecondaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
          >
            Additional ticket info
          </a>
        ) : null}
      </div>
      <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-600 shadow-sm">
        <p className="font-medium text-slate-900">Need help?</p>
        <p className="mt-2">
          Contact the school athletic office for passes, seating questions, and visitor
          policies. Links on this page are managed by the program and open in a new tab.
        </p>
      </div>
    </main>
  );
}
