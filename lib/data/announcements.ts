import type { DocumentData } from "firebase-admin/firestore";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import type { Announcement } from "@/types/firestore";

function docToAnnouncement(id: string, data: DocumentData): Announcement {
  return {
    id,
    title: String(data.title ?? ""),
    body: String(data.body ?? ""),
    label: data.label ? String(data.label) : undefined,
    dateISO: data.dateISO ? String(data.dateISO) : undefined,
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
      return dateValue(b.dateISO) - dateValue(a.dateISO);
    });

  return typeof options?.limit === "number"
    ? announcements.slice(0, options.limit)
    : announcements;
}
