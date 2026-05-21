import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white">Overview</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-300">
        Edit site copy, ticket links, schedule rows, and staff cards. Changes sync to the
        public site after you save (Firestore + Next.js revalidation).
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/settings"
          className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 transition hover:border-[var(--tf-neon)]/40"
        >
          <p className="text-sm font-semibold text-white">Site settings</p>
          <p className="mt-2 text-xs text-zinc-300">
            Hero, tickets, shop CTA, recruiting copy.
          </p>
        </Link>
        <Link
          href="/admin/opponents"
          className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 transition hover:border-[var(--tf-neon)]/40"
        >
          <p className="text-sm font-semibold text-white">Opponents</p>
          <p className="mt-2 text-xs text-zinc-300">
            Master list of schools, logos, mascots, and colors.
          </p>
        </Link>
        <Link
          href="/admin/announcements"
          className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 transition hover:border-[var(--tf-neon)]/40"
        >
          <p className="text-sm font-semibold text-white">Announcements</p>
          <p className="mt-2 text-xs text-zinc-300">
            Home page news, reminders, links, and pinned updates.
          </p>
        </Link>
        <Link
          href="/admin/schedule"
          className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 transition hover:border-[var(--tf-neon)]/40"
        >
          <p className="text-sm font-semibold text-white">Schedule</p>
          <p className="mt-2 text-xs text-zinc-300">Add or remove games for the season.</p>
        </Link>
        <Link
          href="/admin/staff"
          className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 transition hover:border-[var(--tf-neon)]/40"
        >
          <p className="text-sm font-semibold text-white">Staff</p>
          <p className="mt-2 text-xs text-zinc-300">Coaches, roles, photos, and bios.</p>
        </Link>
        <Link
          href="/admin/roster"
          className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 transition hover:border-[var(--tf-neon)]/40"
        >
          <p className="text-sm font-semibold text-white">Roster</p>
          <p className="mt-2 text-xs text-zinc-300">
            Player profiles, photos, measurables, Hudl links, and prospect status.
          </p>
        </Link>
        <Link
          href="/shop"
          className="rounded-2xl border border-white/10 bg-zinc-900/70 p-5 transition hover:border-[var(--tf-neon)]/40"
        >
          <p className="text-sm font-semibold text-white">View shop page</p>
          <p className="mt-2 text-xs text-zinc-300">
            Preview the public storefront + Printify catalog.
          </p>
        </Link>
      </div>
    </div>
  );
}
