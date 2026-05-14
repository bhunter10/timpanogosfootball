import type { Metadata } from "next";

const teamCalendarUrl =
  "https://calendar.google.com/calendar/embed?src=69a70935116452d15372c1e271b7d5a8fbfb6c44ffebe572d49bfe2f0cdc0969%40group.calendar.google.com&ctz=America%2FDenver";

const teamCalendarAgendaUrl = `${teamCalendarUrl}&mode=AGENDA&showTitle=0&showPrint=0&showTabs=0&showCalendars=0`;

export const metadata: Metadata = {
  title: "Team Calendar",
  description: "Timpanogos football practice, event, and team calendar.",
};

export default function TeamCalendarPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--tf-neon)]">
          Info
        </p>
        <h1 className="font-display mt-2 text-4xl font-bold text-slate-900">
          Team calendar
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Practice and event times may change. Open the full calendar for Google
          Calendar options and automatic updates.
        </p>
      </div>

      <section className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--tf-neon)]">
              Calendar
            </p>
            <h2 className="font-display mt-2 text-3xl font-bold text-slate-900">
              Timpanogos football
            </h2>
          </div>
          <a
            href={teamCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--tf-navy)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--tf-black)]"
          >
            Open full calendar
          </a>
        </div>
        <iframe
          title="Timpanogos football team calendar"
          src={teamCalendarAgendaUrl}
          className="h-[32rem] w-full border-0"
          loading="lazy"
        />
      </section>
    </main>
  );
}
