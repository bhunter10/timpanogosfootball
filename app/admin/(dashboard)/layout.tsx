import Link from "next/link";
import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/auth/session";
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { AdminSignOutButton } from "@/components/admin-sign-out-button";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/settings", label: "Site settings" },
  { href: "/admin/opponents", label: "Opponents" },
  { href: "/admin/schedule", label: "Schedule" },
  { href: "/admin/staff", label: "Staff" },
] as const;

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isFirebaseAdminConfigured()) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="font-display text-2xl font-semibold text-white">
          Admin is not configured
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">
          Add <code className="rounded bg-zinc-900 px-1 py-0.5">FIREBASE_SERVICE_ACCOUNT</code>{" "}
          and Firebase web keys to <code className="rounded bg-zinc-900 px-1 py-0.5">.env.local</code>{" "}
          (and Vercel), then redeploy. See <code className="rounded bg-zinc-900 px-1 py-0.5">.env.example</code>.
        </p>
      </main>
    );
  }

  const session = await verifyAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:py-12">
      <aside className="md:w-56 md:shrink-0">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Admin
          </p>
          <nav className="mt-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-2 text-sm text-zinc-200 hover:bg-white/10"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 border-t border-white/10 pt-4">
            <AdminSignOutButton />
          </div>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
