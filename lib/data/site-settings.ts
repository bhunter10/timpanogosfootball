import type { DocumentData } from "firebase-admin/firestore";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import {
  defaultSiteSettings,
  type SiteSettings,
} from "@/types/firestore";

const DOC_ID = "main";

function mergeSettings(data: DocumentData | undefined): SiteSettings {
  if (!data) return { ...defaultSiteSettings };
  const partial = data as Partial<SiteSettings>;
  return {
    ...defaultSiteSettings,
    ...partial,
    infoHighlights: Array.isArray(data.infoHighlights)
      ? (data.infoHighlights as string[])
      : partial.infoHighlights ?? defaultSiteSettings.infoHighlights,
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isFirebaseAdminConfigured()) {
    return { ...defaultSiteSettings };
  }
  const snap = await getAdminDb().collection("siteSettings").doc(DOC_ID).get();
  return mergeSettings(snap.data());
}
