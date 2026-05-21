import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data/site-settings";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "Recruiting",
    description:
      "Recruiting information, questionnaire links, and prospect resources for Timpanogos High School football players.",
    path: "/recruiting",
  }),
};

export default async function RecruitingPage() {
  const settings = await getSiteSettings();

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--tf-neon)]">
        Recruiting
      </p>
      <h1 className="font-display mt-4 max-w-4xl text-6xl font-bold leading-[0.88] text-slate-900 md:text-8xl">
        Prospects
      </h1>
      <p className="mt-5 max-w-xl text-sm leading-6 text-slate-600 md:text-base">
        {settings.recruitingBlurb ??
          "Interested student-athletes should work through the athletic office and official school recruiting policies. Questionnaire and camp links will appear here when published."}
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        {settings.recruitingFormUrl ? (
          <a
            href={settings.recruitingFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-[var(--tf-navy)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--tf-black)]"
          >
            Open recruiting form
          </a>
        ) : (
          <span className="inline-flex items-center justify-center rounded-full border border-dashed border-slate-300 px-6 py-3 text-sm text-slate-500">
            Recruiting questionnaire link will be posted here.
          </span>
        )}
      </div>
      <div className="mt-12 rounded-2xl border border-[var(--tf-neon)]/30 bg-[var(--tf-neon)]/10 p-6 text-sm leading-relaxed text-slate-800">
        <p className="font-semibold">Compliance reminder</p>
        <p className="mt-2">
          Follow NCAA, NFHS, and Utah High School Activities Association rules for contact
          periods and eligibility. This site provides general information only.
        </p>
      </div>
    </main>
  );
}
