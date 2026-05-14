import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { verifyAdminSession } from "@/lib/auth/session";
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import { isFirebaseClientConfigured } from "@/lib/firebase/config";

export default async function AdminLoginPage() {
  if (isFirebaseAdminConfigured()) {
    const session = await verifyAdminSession();
    if (session) {
      redirect("/admin");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <Link
        href="/"
        className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-[var(--tf-neon)] hover:underline"
      >
        ← Back to site
      </Link>
      <h1 className="font-display mt-6 text-center text-3xl font-bold text-white">
        Admin sign-in
      </h1>
      <p className="mt-3 text-center text-sm text-zinc-400">
        Coaches and authorized staff can manage schedule, staff, and site content.
      </p>

      {!isFirebaseAdminConfigured() ? (
        <div className="mt-8 rounded-xl border border-[var(--tf-neon)]/30 bg-[var(--tf-neon)]/10 p-4 text-sm text-zinc-100">
          Set{" "}
          <code className="rounded bg-black/30 px-1 py-0.5 text-xs">
            FIREBASE_SERVICE_ACCOUNT
          </code>{" "}
          on the server and Firebase web keys for the browser. See{" "}
          <code className="rounded bg-black/30 px-1 py-0.5 text-xs">.env.example</code>.
        </div>
      ) : null}

      {!isFirebaseClientConfigured() ? (
        <div className="mt-6 rounded-xl border border-white/15 bg-zinc-900/80 p-4 text-sm text-zinc-300">
          Client Firebase keys are missing — add{" "}
          <code className="rounded bg-black/30 px-1 py-0.5 text-xs">
            NEXT_PUBLIC_FIREBASE_*{" "}
          </code>
          variables so Authentication can run in the browser.
        </div>
      ) : null}

      <AdminLoginForm />
    </main>
  );
}
