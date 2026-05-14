"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getFirebaseAuth } from "@/lib/firebase/client-app";
import { isFirebaseClientConfigured } from "@/lib/firebase/config";

export function AdminSignOutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    if (!isFirebaseClientConfigured()) {
      await fetch("/api/admin/session", { method: "DELETE" });
      router.replace("/admin/login");
      router.refresh();
      return;
    }
    setPending(true);
    try {
      await fetch("/api/admin/session", { method: "DELETE" });
      await signOut(getFirebaseAuth());
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleSignOut()}
      disabled={pending}
      className="w-full rounded-md border border-white/15 px-3 py-2 text-left text-sm text-zinc-200 transition hover:bg-white/10 disabled:opacity-50"
    >
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
