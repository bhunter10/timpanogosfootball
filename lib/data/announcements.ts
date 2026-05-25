import type { DocumentData } from "firebase-admin/firestore";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import type { Announcement } from "@/types/firestore";

function docToAnnouncement(id: string, data: DocumentData): Announcement {
  const dateISOs = Array.isArray(data.dateISOs)
    ? data.dateISOs.map((date) => String(date)).filter(Boolean)
    : [
        data.dateStartISO ? String(data.dateStartISO) : undefined,
        data.dateEndISO ? String(data.dateEndISO) : undefined,
      ].filter((date): date is string => Boolean(date));
  const fallbackDateISO = data.dateISO ? String(data.dateISO) : undefined;

  return {
    id,
    title: String(data.title ?? ""),
    body: String(data.body ?? ""),
    label: data.label ? String(data.label) : undefined,
    dateISO: fallbackDateISO,
    dateStartISO: data.dateStartISO
      ? String(data.dateStartISO)
      : (dateISOs[0] ?? fallbackDateISO),
    dateEndISO: data.dateEndISO ? String(data.dateEndISO) : undefined,
    dateISOs: dateISOs.length > 0 ? dateISOs : fallbackDateISO ? [fallbackDateISO] : undefined,
    href: data.href ? String(data.href) : undefined,
    linkLabel: data.linkLabel ? String(data.linkLabel) : undefined,
    isPinned: Boolean(data.isPinned),
    isPublished: data.isPublished === false ? false : true,
    sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 0,
  };
}

function dateValue(dateISO?: string) {
  if (!dateISO) return 0;
  const value = Date.parse(`${dateISO}T00:00:00`);
  return Number.isNaN(value) ? 0 : value;
}

export async function getAnnouncements(options?: {
  includeUnpublished?: boolean;
  limit?: number;
}): Promise<Announcement[]> {
  if (!isFirebaseAdminConfigured()) {
    return [];
  }

  const snap = await getAdminDb().collection("announcements").get();
  const announcements = snap.docs
    .map((doc) => docToAnnouncement(doc.id, doc.data()))
    .filter((announcement) => options?.includeUnpublished || announcement.isPublished)
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
      return (
        dateValue(b.dateISOs?.[0] ?? b.dateStartISO ?? b.dateISO) -
        dateValue(a.dateISOs?.[0] ?? a.dateStartISO ?? a.dateISO)
      );
    });

  return typeof options?.limit === "number"
    ? announcements.slice(0, options.limit)
    : announcements;
}
