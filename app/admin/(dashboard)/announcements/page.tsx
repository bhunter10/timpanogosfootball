import { getAnnouncements } from "@/lib/data/announcements";
import { createAnnouncement } from "../actions";
import { AnnouncementFields, AnnouncementList } from "./announcement-list";

export default async function AdminAnnouncementsPage() {
  const announcements = await getAnnouncements({ includeUnpublished: true });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white">Announcements</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Publish short home page updates for camp dates, parent meetings, fundraisers,
        schedule notes, and game week reminders. Pinned items stay first.
      </p>

      <section className="mt-10 rounded-2xl border border-white/10 bg-zinc-900/60 p-6">
        <h2 className="text-sm font-semibold text-white">Add announcement</h2>
        <form action={createAnnouncement} className="mt-4 grid gap-4 md:grid-cols-2">
          <AnnouncementFields />
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-[var(--tf-neon)] px-5 py-2 text-sm font-semibold text-[var(--tf-navy)] hover:brightness-110"
            >
              Publish announcement
            </button>
          </div>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold text-white">Current updates</h2>
        <AnnouncementList
          key={announcements
            .map((announcement) => `${announcement.id}:${announcement.sortOrder}`)
            .join("|")}
          announcements={announcements}
        />
      </section>
    </div>
  );
}
