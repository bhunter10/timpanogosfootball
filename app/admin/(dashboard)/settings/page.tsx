import { getSiteSettings } from "@/lib/data/site-settings";
import { saveSiteSettings } from "../actions";

export default async function AdminSettingsPage() {
  const s = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white">Site settings</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Updates merge into Firestore document{" "}
        <code className="rounded bg-zinc-900 px-1 py-0.5 text-xs">siteSettings/main</code>.
      </p>

      <form action={saveSiteSettings} className="mt-8 space-y-8">
        <section className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
          <h2 className="text-sm font-semibold text-white">Home hero</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-xs font-medium text-zinc-400">
              Title
              <input
                name="heroTitle"
                defaultValue={s.heroTitle}
                required
                className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block text-xs font-medium text-zinc-400 md:col-span-2">
              Subtitle
              <input
                name="heroSubtitle"
                defaultValue={s.heroSubtitle}
                required
                className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block text-xs font-medium text-zinc-400 md:col-span-2">
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
            <label className="block text-xs font-medium text-zinc-400 md:col-span-2">
              Ticket blurb
              <textarea
                name="ticketBlurb"
                rows={3}
                defaultValue={s.ticketBlurb ?? ""}
                className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block text-xs font-medium text-zinc-400">
              Primary ticket URL
              <input
                name="ticketUrl"
                defaultValue={s.ticketUrl ?? ""}
                className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block text-xs font-medium text-zinc-400">
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
            <label className="block text-xs font-medium text-zinc-400">
              Shop message
              <textarea
                name="shopMessage"
                rows={3}
                defaultValue={s.shopMessage ?? ""}
                className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block text-xs font-medium text-zinc-400">
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
            <label className="block text-xs font-medium text-zinc-400">
              Recruiting blurb
              <textarea
                name="recruitingBlurb"
                rows={4}
                defaultValue={s.recruitingBlurb ?? ""}
                className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
              />
            </label>
            <label className="block text-xs font-medium text-zinc-400">
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
          <h2 className="text-sm font-semibold text-white">Info page</h2>
          <label className="mt-4 block text-xs font-medium text-zinc-400">
            Highlights (one per line)
            <textarea
              name="infoHighlights"
              rows={6}
              defaultValue={(s.infoHighlights ?? []).join("\n")}
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="mt-4 block text-xs font-medium text-zinc-400">
            Footer note (optional)
            <textarea
              name="footerNote"
              rows={2}
              defaultValue={s.footerNote ?? ""}
              className="mt-1 w-full rounded-lg border border-white/15 bg-zinc-950 px-3 py-2 text-sm text-white"
            />
          </label>
        </section>

        <button
          type="submit"
          className="rounded-full bg-[var(--tf-neon)] px-6 py-3 text-sm font-semibold text-[var(--tf-navy)] shadow-sm hover:brightness-110"
        >
          Save settings
        </button>
      </form>
    </div>
  );
}
