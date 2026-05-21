import Image from "next/image";
import Link from "next/link";
import { TICKETS_URL } from "@/lib/site-links";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/timpanogosfootball/",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
        <path
          fill="currentColor"
          d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.7 2.4a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm0 2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z"
        />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "https://twitter.com/search?q=Timpanogos%20Football",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
        <path
          fill="currentColor"
          d="M18.9 2.9h3.3l-7.3 8.3 8.5 11.2h-6.7l-5.2-6.8-6 6.8H2.2l7.8-8.9L1.8 2.9h6.9l4.7 6.2 5.5-6.2Zm-1.2 17.5h1.8L7.7 4.8h-2l12 15.6Z"
        />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/search/top?q=timpanogos%20football",
    icon: (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
        <path
          fill="currentColor"
          d="M14 8.4V6.9c0-.7.5-.9 1-.9h2.5V2.2L14.1 2C10.7 2 9 4 9 7.7v.7H6v4.2h3V22h4.5v-9.4h3.4l.6-4.2H14Z"
        />
      </svg>
    ),
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[var(--tf-neon)]/30 bg-[var(--tf-black)] text-zinc-300">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,color-mix(in_srgb,var(--tf-neon)_26%,transparent),transparent_28%),linear-gradient(135deg,rgba(6,24,58,0.92),rgba(5,7,9,0.88)_48%,rgba(45,52,59,0.55))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--tf-neon)] to-transparent" />

      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[1fr_auto] md:items-start md:px-6">
        <div className="flex items-start gap-4">
          <Image
            src="/images/claw-on-blue-footer.webp"
            alt="T-Wolves claw mark"
            width={640}
            height={504}
            className="h-auto w-20 shrink-0"
          />
          <div>
            <p className="font-display text-2xl font-semibold uppercase tracking-wide text-white">
              Timpanogos Football
            </p>
            <p className="mt-1 max-w-md text-sm leading-relaxed">
              Official team pages for schedules, staff, ticket links, and recruiting
              information. Stay connected with the program all season.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Timpanogos Football on ${item.label}`}
                  className="group relative grid size-11 place-items-center overflow-hidden rounded-sm border border-white/10 bg-white/[0.06] text-zinc-100 shadow-lg shadow-black/25 outline-none transition duration-300 hover:-translate-y-1 hover:border-[var(--tf-neon)] hover:bg-[var(--tf-neon)] hover:text-[var(--tf-navy)] hover:shadow-[0_0_24px_rgba(57,255,20,0.32)] focus-visible:border-[var(--tf-neon)] focus-visible:ring-2 focus-visible:ring-[var(--tf-neon)]/60"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition duration-700 group-hover:translate-x-full" />
                  <span className="relative transition duration-300 group-hover:scale-110">
                    {item.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm md:items-end md:text-right">
          <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--tf-neon)]">
            Explore
          </span>
          <Link href="/schedule" className="transition hover:text-white">
            Schedule
          </Link>
          <Link href="/records" className="transition hover:text-white">
            Records
          </Link>
          <Link href="/staff" className="transition hover:text-white">
            Staff
          </Link>
          <a
            href={TICKETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
          >
            Tickets
          </a>
          <Link href="/shop" className="transition hover:text-white">
            Shop
          </Link>
          <Link
            href="/admin/login"
            className="text-zinc-400 transition hover:text-zinc-200"
          >
            Admin
          </Link>
        </div>

      </div>

      <div className="relative border-t border-white/10 bg-black/25 py-4 text-center text-xs text-zinc-400">
        © {new Date().getFullYear()} Timpanogos Football. All rights reserved.
      </div>
    </footer>
  );
}
