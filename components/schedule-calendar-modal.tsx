"use client";

import { useEffect, useId, useState } from "react";

type ScheduleCalendarModalProps = {
  appleHref: string;
  downloadHref: string;
  googleHref: string;
  teamLabel: string;
};

function CalendarPlusIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M12 14v5" />
      <path d="M9.5 16.5h5" />
    </svg>
  );
}

export function ScheduleCalendarModal({
  appleHref,
  downloadHref,
  googleHref,
  teamLabel,
}: ScheduleCalendarModalProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--tf-neon)] px-4 py-3 text-xs font-black uppercase tracking-wide text-[var(--tf-navy)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--tf-neon)] focus:ring-offset-2 focus:ring-offset-[var(--tf-black)]"
      >
        <CalendarPlusIcon />
        Add to calendar
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
          role="presentation"
          onMouseDown={() => setOpen(false)}
        >
          <section
            aria-describedby={descriptionId}
            aria-labelledby={titleId}
            aria-modal="true"
            role="dialog"
            className="w-full max-w-lg border border-[var(--tf-neon)]/30 bg-zinc-950 p-5 text-white shadow-2xl shadow-black/40"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--tf-neon)]">
                  Schedule Sync
                </p>
                <h2
                  id={titleId}
                  className="font-display mt-2 text-3xl font-bold uppercase leading-none"
                >
                  Add {teamLabel} to calendar
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/15 text-xl leading-none text-zinc-300 transition hover:border-[var(--tf-neon)] hover:text-[var(--tf-neon)]"
                aria-label="Close calendar options"
              >
                &times;
              </button>
            </div>

            <p id={descriptionId} className="mt-4 text-sm leading-6 text-zinc-300">
              Subscribe to the Timpanogos {teamLabel} football schedule. Game dates,
              kickoff times, locations, and future schedule changes will update in
              your calendar app from this team feed.
            </p>

            <div className="mt-6 grid gap-3">
              <a
                href={appleHref}
                className="block border border-white/15 bg-white/[0.04] p-4 transition hover:border-[var(--tf-neon)] hover:bg-white/[0.07]"
              >
                <span className="text-sm font-black uppercase tracking-wide text-white">
                  Apple Calendar
                </span>
                <span className="mt-1 block text-sm leading-6 text-zinc-400">
                  Best for iPhone, iPad, and Mac. Opens a calendar subscription prompt.
                </span>
              </a>
              <a
                href={googleHref}
                target="_blank"
                rel="noreferrer"
                className="block border border-white/15 bg-white/[0.04] p-4 transition hover:border-[var(--tf-neon)] hover:bg-white/[0.07]"
              >
                <span className="text-sm font-black uppercase tracking-wide text-white">
                  Android / Google
                </span>
                <span className="mt-1 block text-sm leading-6 text-zinc-400">
                  Best for Android phones and Google Calendar accounts.
                </span>
              </a>
              <a
                href={downloadHref}
                className="block border border-white/15 bg-white/[0.04] p-4 transition hover:border-[var(--tf-neon)] hover:bg-white/[0.07]"
              >
                <span className="text-sm font-black uppercase tracking-wide text-white">
                  Other Calendar App
                </span>
                <span className="mt-1 block text-sm leading-6 text-zinc-400">
                  Download or open the ICS feed for Outlook and other calendar apps.
                </span>
              </a>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
