import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--tf-neon)]/20 bg-[var(--tf-black)] text-zinc-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-white">
            Timpanogos Football
          </p>
          <p className="mt-1 max-w-md text-sm leading-relaxed">
            Official team pages for schedules, staff, ticket links, and recruiting
            information. Stay connected with the program all season.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-zinc-300">Explore</span>
          <Link href="/schedule" className="hover:text-white">
            Schedule
          </Link>
          <Link href="/staff" className="hover:text-white">
            Staff
          </Link>
          <Link href="/shop" className="hover:text-white">
            Shop
          </Link>
          <Link href="/admin/login" className="text-zinc-500 hover:text-zinc-300">
            Admin
          </Link>
        </div>
      </div>
      <div className="border-t border-white/5 py-4 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} Timpanogos Football. All rights reserved.
      </div>
    </footer>
  );
}
