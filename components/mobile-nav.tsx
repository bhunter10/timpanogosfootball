"use client";

import Link from "next/link";
import { useState } from "react";

type NavItem = {
  href: string;
  label: string;
  external?: boolean;
  children?: readonly NavItem[];
};

export function MobileNav({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="rounded-sm border border-[var(--tf-neon)]/50 px-3 py-2 text-sm font-bold uppercase tracking-wide text-white"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((v) => !v)}
      >
        Menu
      </button>
      {open ? (
        <div
          id="mobile-nav-panel"
          className="absolute left-0 right-0 top-full border-b border-[var(--tf-neon)]/20 bg-[var(--tf-navy)] px-4 py-3 shadow-xl"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {items.map((item) =>
              item.children ? (
                <div key={item.href}>
                  <div className="rounded-sm px-3 py-2 text-sm font-bold uppercase tracking-wide text-white/95">
                    {item.label}
                  </div>
                  <div className="ml-3 border-l border-[var(--tf-neon)]/30 pl-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-sm px-3 py-2 text-sm font-bold uppercase tracking-wide text-white/80 hover:bg-[var(--tf-neon)] hover:text-[var(--tf-navy)]"
                        onClick={() => setOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-sm px-3 py-2 text-sm font-bold uppercase tracking-wide text-white/95 hover:bg-[var(--tf-neon)] hover:text-[var(--tf-navy)]"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-sm px-3 py-2 text-sm font-bold uppercase tracking-wide text-white/95 hover:bg-[var(--tf-neon)] hover:text-[var(--tf-navy)]"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
