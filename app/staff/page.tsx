import type { Metadata } from "next";
import Image from "next/image";
import { getStaffMembers } from "@/lib/data/staff";
import type { StaffMember } from "@/types/firestore";

export const metadata: Metadata = {
  title: "Staff",
  description: "Coaching staff and program leadership for Timpanogos football.",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StaffPortrait({
  member,
  className = "",
  sizes = "96px",
  priority = false,
}: {
  member: StaffMember;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative shrink-0 overflow-hidden bg-slate-100 ${className}`}>
      {member.photoUrl ? (
        <Image
          src={member.photoUrl}
          alt=""
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,var(--tf-navy),#101827)] font-display text-3xl font-bold text-white">
          {getInitials(member.name)}
        </div>
      )}
    </div>
  );
}

function ProfileCard({ member }: { member: StaffMember }) {
  return (
    <article className="group relative aspect-[4/5] overflow-hidden border border-white/10 bg-slate-900 shadow-sm shadow-black/20 transition hover:-translate-y-1 hover:border-[var(--tf-neon)]/50 hover:shadow-xl hover:shadow-black/30">
      <StaffPortrait
        member={member}
        className="absolute inset-0 h-full w-full transition duration-500 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 300px"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,9,23,0.02)_0%,rgba(2,9,23,0.14)_38%,rgba(2,9,23,0.9)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase leading-none text-white">
              {member.name}
            </h2>
            <p className="mt-2 text-[11px] font-black uppercase tracking-[0.16em] text-[var(--tf-neon)]">
              {member.role}
            </p>
          </div>
          {member.email ? (
            <a
              href={`mailto:${member.email}`}
              className="shrink-0 border border-white/25 bg-black/35 px-3 py-2 text-[10px] font-black uppercase tracking-wide text-white backdrop-blur transition hover:border-[var(--tf-neon)] hover:text-[var(--tf-neon)]"
            >
              Email
            </a>
          ) : null}
        </div>
        {member.bio ? (
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-zinc-300">{member.bio}</p>
        ) : null}
      </div>
    </article>
  );
}

function HeadCoachCard({ member }: { member: StaffMember }) {
  return (
    <aside className="border border-white/15 bg-black/50 p-5 shadow-2xl shadow-black/35 backdrop-blur-md">
      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--tf-neon)]">
        Head Coach
      </p>
      <div className="mt-5 grid gap-5 sm:grid-cols-[170px_1fr]">
        <StaffPortrait
          member={member}
          className="aspect-[4/5] w-full border border-white/15 bg-white/10"
          sizes="170px"
          priority
        />
        <div>
          <h2 className="font-display text-4xl font-bold uppercase leading-none text-white">
            {member.name}
          </h2>
          <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-zinc-300">
            {member.role}
          </p>
          {member.bio ? (
            <p className="mt-4 line-clamp-4 text-sm leading-6 text-zinc-300">
              {member.bio}
            </p>
          ) : null}
          {member.email ? (
            <a
              href={`mailto:${member.email}`}
              className="mt-4 inline-flex border border-[var(--tf-neon)] bg-[var(--tf-neon)] px-4 py-3 text-xs font-black uppercase tracking-wide text-[var(--tf-navy)] transition hover:brightness-110"
            >
              Contact Coach Nielsen
            </a>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

export default async function StaffPage() {
  const staff = await getStaffMembers();
  const headCoach =
    staff.find((member) => member.name.toLowerCase() === "nolan nielsen") ?? staff[0];

  return (
    <main className="bg-[var(--tf-black)] text-white">
      <section className="relative isolate min-h-[420px] overflow-hidden bg-[var(--tf-black)] text-white md:min-h-[500px]">
        <Image
          src="/images/staff-playbook-hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,9,23,0.96)_0%,rgba(2,9,23,0.78)_42%,rgba(2,9,23,0.42)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(0deg,var(--tf-black),transparent)]" />

        <div className="relative mx-auto flex min-h-[420px] max-w-7xl flex-col justify-center px-4 py-10 md:min-h-[500px] md:px-6 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_460px] lg:items-center">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.36em] text-[var(--tf-neon)]">
                Coaches & Staff
              </p>
              <h1 className="font-display mt-4 text-5xl font-bold uppercase leading-[0.86] tracking-tight text-white md:text-7xl lg:text-8xl">
                Staff
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
                The people leading the preparation, culture, and Friday-night standard
                for Timpanogos football.
              </p>
            </div>

            {headCoach ? <HeadCoachCard member={headCoach} /> : null}
          </div>
        </div>
      </section>

      {staff.length > 0 ? (
        <section className="relative isolate overflow-hidden border-t border-white/10 bg-[var(--tf-black)] px-4 py-10 md:px-6 lg:py-14">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(57,255,20,0.08),transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {staff.map((member) => (
                <ProfileCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
