"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Prospect } from "@/lib/data/prospects";

const classes = ["2027", "2028", "2029", "2030"];
const positionGroups = ["QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "ST"];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ProspectPhoto({ prospect }: { prospect: Prospect }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-white/[0.06]">
      {prospect.photoUrl ? (
        <Image
          src={prospect.photoUrl}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--tf-navy),#101827)] font-display text-4xl font-bold text-white">
          {getInitials(prospect.name)}
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(0deg,rgba(2,9,23,0.86),transparent)]" />
      <p className="absolute bottom-4 left-4 text-xs font-black uppercase tracking-[0.2em] text-[var(--tf-neon)]">
        Class of {prospect.classYear}
      </p>
    </div>
  );
}

function ProfileIcon({ type }: { type: "hudl" | "instagram" | "x" }) {
  if (type === "hudl") {
    return <span className="text-xs font-black lowercase tracking-tight">hudl</span>;
  }

  if (type === "instagram") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
        <rect
          x="4.5"
          y="4.5"
          width="15"
          height="15"
          rx="4.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="12"
          cy="12"
          r="3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="16.9" cy="7.2" r="1.2" fill="currentColor" />
      </svg>
    );
  }

  if (type === "x") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
        <path
          d="M5 5L19 19M19 5L5 19"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2.6"
        />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M10 9.2L15.2 12L10 14.8V9.2Z" fill="currentColor" />
    </svg>
  );
}

function ProspectCard({ prospect }: { prospect: Prospect }) {
  const measurables = [prospect.height, prospect.weight].filter(Boolean).join(" / ");
  const links = [
    { href: prospect.hudlUrl, label: "Hudl profile", type: "hudl" as const },
    {
      href: prospect.instagramUrl,
      label: "Instagram profile",
      type: "instagram" as const,
    },
    { href: prospect.xUrl, label: "X profile", type: "x" as const },
  ].filter((link) => link.href);

  return (
    <article className="overflow-hidden border border-white/10 bg-white/[0.055] shadow-xl shadow-black/20">
      <ProspectPhoto prospect={prospect} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase leading-none text-white">
              {prospect.name}
            </h2>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--tf-neon)]">
              {prospect.positions.join(" / ")}
            </p>
          </div>
          <span className="border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-wide text-zinc-200">
            {prospect.status}
          </span>
        </div>

        {measurables ? (
          <p className="mt-4 font-mono text-sm font-bold uppercase text-zinc-200">
            {measurables}
          </p>
        ) : null}

        {prospect.stats?.length ? (
          <div className="mt-4 grid gap-px bg-white/10 text-sm font-bold text-white">
            {prospect.stats.map((stat) => (
              <p key={stat} className="bg-[var(--tf-black)] px-3 py-2">
                {stat}
              </p>
            ))}
          </div>
        ) : null}

        {prospect.honors?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {prospect.honors.map((honor) => (
              <span
                key={honor}
                className="bg-white/10 px-2.5 py-1 text-xs font-black uppercase tracking-wide text-zinc-200"
              >
                {honor}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${prospect.name} ${link.label}`}
              className="grid size-9 place-items-center border border-white/15 text-white transition hover:border-[var(--tf-neon)] hover:text-[var(--tf-neon)]"
            >
              <ProfileIcon type={link.type} />
            </a>
          ))}
          {prospect.email ? (
            <a
              href={`mailto:${prospect.email}`}
              className="border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-wide text-white transition hover:border-[var(--tf-neon)] hover:text-[var(--tf-neon)]"
            >
              Contact
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ProspectBoard({ prospects }: { prospects: Prospect[] }) {
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");

  const filteredProspects = useMemo(
    () =>
      prospects.filter((prospect) => {
        const classMatches =
          selectedClass === "all" || prospect.classYear === selectedClass;
        const positionMatches =
          selectedPosition === "all" ||
          prospect.positions.some((position) => position === selectedPosition);
        return classMatches && positionMatches;
      }),
    [prospects, selectedClass, selectedPosition],
  );

  const clearFilters = () => {
    setSelectedClass("all");
    setSelectedPosition("all");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <aside className="self-start border border-white/10 bg-white/[0.055] p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-[var(--tf-neon)]">
            Filters
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-black uppercase tracking-wide text-zinc-300 transition hover:text-[var(--tf-neon)]"
          >
            Reset
          </button>
        </div>
        <div className="mt-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
            Class
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["all", ...classes].map((classYear) => {
              const active = selectedClass === classYear;
              return (
                <button
                  key={classYear}
                  type="button"
                  onClick={() => setSelectedClass(classYear)}
                  className={`border px-3 py-2 text-xs font-black uppercase transition ${
                    active
                      ? "border-[var(--tf-neon)] bg-[var(--tf-neon)] text-[var(--tf-navy)]"
                      : "border-white/10 bg-black/25 text-zinc-200 hover:border-[var(--tf-neon)] hover:text-[var(--tf-neon)]"
                  }`}
                >
                  {classYear === "all" ? "All" : classYear}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
            Position
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["all", ...positionGroups].map((position) => {
              const active = selectedPosition === position;
              return (
                <button
                  key={position}
                  type="button"
                  onClick={() => setSelectedPosition(position)}
                  className={`border px-3 py-2 text-xs font-black uppercase transition ${
                    active
                      ? "border-[var(--tf-neon)] bg-[var(--tf-neon)] text-[var(--tf-navy)]"
                      : "border-white/10 bg-black/25 text-zinc-200 hover:border-[var(--tf-neon)] hover:text-[var(--tf-neon)]"
                  }`}
                >
                  {position === "all" ? "All" : position}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-5 text-sm leading-6 text-zinc-300">
          Showing {filteredProspects.length} of {prospects.length} prospects. College
          coaches can use Hudl links and profile contact buttons when available.
        </div>
      </aside>

      {filteredProspects.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProspects.map((prospect) => (
            <ProspectCard key={prospect.id} prospect={prospect} />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-white/20 bg-white/[0.055] p-8 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--tf-neon)]">
            No Matches
          </p>
          <h2 className="font-display mt-4 text-4xl font-bold uppercase leading-none text-white">
            No prospects match those filters.
          </h2>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 inline-flex bg-[var(--tf-neon)] px-5 py-3 text-xs font-black uppercase tracking-wide text-[var(--tf-navy)] transition hover:brightness-110"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
