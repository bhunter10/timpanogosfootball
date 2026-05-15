"use client";

import type { ReactNode } from "react";
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

function AppleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor">
      <path d="M17.2 12.8c0-2.5 2-3.7 2.1-3.8-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.6.9-.8 0-1.9-.9-3.1-.8-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3.1 2.4 1.2-.1 1.7-.8 3.2-.8s1.9.8 3.2.8 2.2-1.2 3-2.4c.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.9-1.1-3-3.7Z" />
      <path d="M14.8 5.5c.7-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.9-1 2.9 1 .1 2-.5 2.7-1.3Z" />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
    >
      <path
        d="M8.3 6.2 6.9 3.8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
      <path
        d="m15.7 6.2 1.4-2.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
      />
      <path
        d="M6.4 8.4a5.6 5.6 0 0 1 11.2 0v.4H6.4v-.4Z"
        fill="currentColor"
      />
      <circle cx="9.9" cy="6.9" r=".45" fill="#111827" />
      <circle cx="14.1" cy="6.9" r=".45" fill="#111827" />
      <rect width="11.2" height="8.3" x="6.4" y="9.6" rx=".5" fill="currentColor" />
      <rect width="2.5" height="7.5" x="3.5" y="9.7" rx="1.25" fill="currentColor" />
      <rect width="2.5" height="7.5" x="18" y="9.7" rx="1.25" fill="currentColor" />
      <rect width="2.5" height="4.1" x="8.4" y="17.1" rx="1.25" fill="currentColor" />
      <rect width="2.5" height="4.1" x="13.1" y="17.1" rx="1.25" fill="currentColor" />
    </svg>
  );
}

function OtherCalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
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
      <path d="M8 15h8" />
      <path d="M8 18h5" />
    </svg>
  );
}

function PlatformIconShell({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[var(--tf-navy)]">
      {children}
    </span>
  );
}

function formatTeamLabelForButton(teamLabel: string) {
  return teamLabel === "JV" ? teamLabel : teamLabel.toLowerCase();
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
  const buttonTeamLabel = formatTeamLabelForButton(teamLabel);

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
        className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[var(--tf-neon)] px-4 py-3 text-xs font-black uppercase tracking-wide text-[var(--tf-navy)] transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[var(--tf-neon)] focus:ring-offset-2 focus:ring-offset-[var(--tf-black)]"
      >
        <CalendarPlusIcon />
        Add {buttonTeamLabel} games to calendar
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
                className="flex gap-3 border border-white/15 bg-white/[0.04] p-4 transition hover:border-[var(--tf-neon)] hover:bg-white/[0.07]"
              >
                <PlatformIconShell>
                  <AppleIcon />
                </PlatformIconShell>
                <span>
                  <span className="text-sm font-black uppercase tracking-wide text-white">
                    Apple Calendar
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-zinc-400">
                    Best for iPhone, iPad, and Mac. Opens a calendar subscription prompt.
                  </span>
                </span>
              </a>
              <a
                href={googleHref}
                target="_blank"
                rel="noreferrer"
                className="flex gap-3 border border-white/15 bg-white/[0.04] p-4 transition hover:border-[var(--tf-neon)] hover:bg-white/[0.07]"
              >
                <PlatformIconShell>
                  <AndroidIcon />
                </PlatformIconShell>
                <span>
                  <span className="text-sm font-black uppercase tracking-wide text-white">
                    Android / Google
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-zinc-400">
                    Best for Android phones and Google Calendar accounts.
                  </span>
                </span>
              </a>
              <a
                href={downloadHref}
                className="flex gap-3 border border-white/15 bg-white/[0.04] p-4 transition hover:border-[var(--tf-neon)] hover:bg-white/[0.07]"
              >
                <PlatformIconShell>
                  <OtherCalendarIcon />
                </PlatformIconShell>
                <span>
                  <span className="text-sm font-black uppercase tracking-wide text-white">
                    Other Calendar App
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-zinc-400">
                    Download or open the ICS feed for Outlook and other calendar apps.
                  </span>
                </span>
              </a>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
