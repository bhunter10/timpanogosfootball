"use client";

import { useActionState, useState } from "react";
import type { SiteSettings } from "@/types/firestore";
import {
  saveSiteSettings,
  type SaveSiteSettingsState,
} from "../actions";

const initialState: SaveSiteSettingsState = {
  status: "idle",
  message: "",
};

function formatSavedAt(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

export function SettingsForm({ settings: s }: { settings: SiteSettings }) {
  const [state, formAction, pending] = useActionState(
    saveSiteSettings,
    initialState,
  );
  const [lastEditedAt, setLastEditedAt] = useState(0);
  const [lastSubmittedAt, setLastSubmittedAt] = useState(0);
  const hasUnsavedChanges = lastEditedAt > lastSubmittedAt;
  const savedAt = formatSavedAt(state.savedAt);

  function handleFormAction(formData: FormData) {
    setLastSubmittedAt(Date.now());
    formAction(formData);
  }

  return (
    <form
      action={handleFormAction}
      className="mt-8 space-y-8"
      onChange={() => setLastEditedAt(Date.now())}
    >
      <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
        <h2 className="text-sm font-semibold text-white">Home hero</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-xs font-medium text-zinc-300">
            Title
            <input
              name="heroTitle"
              defaultValue={s.heroTitle}
              required
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="block text-xs font-medium text-zinc-300 md:col-span-2">
            Subtitle
            <input
              name="heroSubtitle"
              defaultValue={s.heroSubtitle}
              required
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="block text-xs font-medium text-zinc-300 md:col-span-2">
            Hero image URL (Firebase Storage or HTTPS CDN)
            <input
              name="heroImageUrl"
              defaultValue={s.heroImageUrl ?? ""}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
        <h2 className="text-sm font-semibold text-white">Tickets</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block text-xs font-medium text-zinc-300 md:col-span-2">
            Ticket blurb
            <textarea
              name="ticketBlurb"
              rows={3}
              defaultValue={s.ticketBlurb ?? ""}
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="block text-xs font-medium text-zinc-300">
            Primary ticket URL
            <input
              name="ticketUrl"
              defaultValue={s.ticketUrl ?? ""}
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="block text-xs font-medium text-zinc-300">
            Secondary URL (optional)
            <input
              name="ticketSecondaryUrl"
              defaultValue={s.ticketSecondaryUrl ?? ""}
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
        <h2 className="text-sm font-semibold text-white">Shop</h2>
        <div className="mt-4 grid gap-4">
          <label className="block text-xs font-medium text-zinc-300">
            Shop message
            <textarea
              name="shopMessage"
              rows={3}
              defaultValue={s.shopMessage ?? ""}
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="block text-xs font-medium text-zinc-300">
            Primary storefront URL (Printify or school store)
            <input
              name="shopPrimaryUrl"
              defaultValue={s.shopPrimaryUrl ?? ""}
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
        <h2 className="text-sm font-semibold text-white">Recruiting</h2>
        <div className="mt-4 grid gap-4">
          <label className="block text-xs font-medium text-zinc-300">
            Recruiting blurb
            <textarea
              name="recruitingBlurb"
              rows={4}
              defaultValue={s.recruitingBlurb ?? ""}
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="block text-xs font-medium text-zinc-300">
            Recruiting form URL
            <input
              name="recruitingFormUrl"
              defaultValue={s.recruitingFormUrl ?? ""}
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
        <h2 className="text-sm font-semibold text-white">Footer</h2>
        <label className="mt-4 block text-xs font-medium text-zinc-300">
          Footer note (optional)
          <textarea
            name="footerNote"
            rows={2}
            defaultValue={s.footerNote ?? ""}
            className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
          />
        </label>
      </section>

      <div className="sticky bottom-0 -mx-4 flex flex-col gap-3 border-t border-white/10 bg-zinc-950/95 px-4 py-4 backdrop-blur md:mx-0 md:flex-row md:items-center md:justify-between md:rounded-xl md:border md:px-5">
        <p
          aria-live="polite"
          className={
            state.status === "error"
              ? "text-sm font-medium text-red-300"
              : state.status === "success"
                ? "text-sm font-medium text-[var(--tf-neon)]"
                : "text-sm text-zinc-300"
          }
        >
          {pending
            ? "Saving settings..."
            : hasUnsavedChanges
              ? "Unsaved changes"
            : state.status === "success" && savedAt
              ? `${state.message} ${savedAt}`
              : state.message || "Changes are saved only after you press the button."}
        </p>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[var(--tf-neon)] px-6 py-3 text-sm font-semibold text-[var(--tf-navy)] shadow-sm transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
        >
          {pending ? "Saving..." : "Save settings"}
        </button>
      </div>
    </form>
  );
}
