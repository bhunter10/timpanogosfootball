import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "@/components/mobile-nav";

type NavItem = {
  href: string;
  label: string;
  external?: boolean;
  children?: readonly NavItem[];
};

const nav: readonly NavItem[] = [
  { href: "/schedule", label: "Schedule" },
  { href: "/roster", label: "Roster" },
  { href: "/staff", label: "Staff" },
  {
    href: "info",
    label: "Info",
    children: [
      { href: "/team-calendar", label: "Team Calendar" },
      { href: "/records", label: "Records" },
    ],
  },
  { href: "/prospects", label: "Prospects" },
  { href: "/shop", label: "Shop" },
];

export function SiteHeader() {
  return (
    <header className="relative sticky top-0 z-50 border-b border-[var(--tf-neon)]/20 bg-[var(--tf-black)] text-white shadow-lg shadow-black/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
        <Link href="/" className="flex items-center gap-3 leading-tight">
          <Image
            src="/images/twolves-wolf.svg"
            alt="Timpanogos Timberwolves"
            width={443}
            height={492}
            className="h-12 w-auto shrink-0 md:h-16"
            priority
          />
          <span className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--tf-neon)]">
              Timpanogos
            </span>
            <span className="font-display text-xl font-bold uppercase tracking-tight md:text-xl">
              Football
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) =>
            item.children ? (
              <div key={item.href} className="group relative">
                <button
                  type="button"
                  className="rounded-sm px-3 py-2 text-sm font-bold uppercase tracking-wide text-white/85 transition hover:bg-[var(--tf-neon)] hover:text-[var(--tf-navy)] group-focus-within:bg-[var(--tf-neon)] group-focus-within:text-[var(--tf-navy)]"
                  aria-haspopup="menu"
                >
                  {item.label}
                </button>
                <div className="invisible absolute left-0 top-full min-w-44 pt-3 opacity-0 transition duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div
                    className="border border-[var(--tf-neon)]/25 bg-[var(--tf-black)] p-1 shadow-xl shadow-black/30"
                    role="menu"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        role="menuitem"
                        className="block rounded-sm px-3 py-2 text-sm font-bold uppercase tracking-wide text-white/85 transition hover:bg-[var(--tf-neon)] hover:text-[var(--tf-navy)] focus:bg-[var(--tf-neon)] focus:text-[var(--tf-navy)]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm px-3 py-2 text-sm font-bold uppercase tracking-wide text-white/85 transition hover:bg-[var(--tf-neon)] hover:text-[var(--tf-navy)]"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-sm px-3 py-2 text-sm font-bold uppercase tracking-wide text-white/85 transition hover:bg-[var(--tf-neon)] hover:text-[var(--tf-navy)]"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <MobileNav items={nav} />
      </div>
    </header>
  );
}
