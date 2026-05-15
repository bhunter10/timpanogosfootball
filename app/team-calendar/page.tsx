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
    <main className="min-h-screen bg-[var(--tf-black)] text-white">
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--tf-neon)]">
            Program
          </p>
          <h1 className="font-display mt-4 text-6xl font-bold uppercase leading-[0.88] text-white md:text-8xl">
            Team Calendar
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-400 md:text-base">
            Practice, team events, and program updates live here. Times may change,
            so open the full calendar for Google Calendar options and automatic
            updates.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={teamCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-[var(--tf-neon)] px-5 py-3 text-sm font-black uppercase tracking-wide text-[var(--tf-navy)] shadow-lg shadow-[var(--tf-neon)]/10 transition hover:brightness-110"
            >
              Open full calendar
            </a>
            <a
              href={`${teamCalendarUrl}&mode=MONTH`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:border-[var(--tf-neon)]/60 hover:text-[var(--tf-neon)]"
            >
              Month view
            </a>
          </div>
        </div>

        <section className="mt-10 overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl shadow-black/25">
          <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[var(--tf-neon)]">
                Calendar
              </p>
              <h2 className="font-display mt-1 text-4xl font-bold uppercase leading-none text-white">
                Timpanogos Football
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-zinc-400 sm:text-right">
              Embedded agenda view for quick scanning. Use the buttons above for Google
              Calendar controls.
            </p>
          </div>
          <div className="bg-white">
            <iframe
              title="Timpanogos football team calendar"
              src={teamCalendarAgendaUrl}
              className="h-[34rem] w-full border-0 md:h-[40rem]"
              loading="lazy"
            />
          </div>
        </section>
      </section>
    </main>
  );
}
