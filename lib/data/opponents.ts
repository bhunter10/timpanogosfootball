import type { DocumentData } from "firebase-admin/firestore";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import type { Opponent } from "@/types/firestore";

export function docToOpponent(id: string, data: DocumentData): Opponent {
  return {
    id,
    schoolName: String(data.schoolName ?? ""),
    shortName: data.shortName ? String(data.shortName) : undefined,
    mascot: data.mascot ? String(data.mascot) : undefined,
    logoUrl: data.logoUrl ? String(data.logoUrl) : undefined,
    primaryColor: data.primaryColor ? String(data.primaryColor) : undefined,
    secondaryColor: data.secondaryColor ? String(data.secondaryColor) : undefined,
    address: data.address ? String(data.address) : undefined,
    city: data.city ? String(data.city) : undefined,
    state: data.state ? String(data.state) : undefined,
    sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 0,
  };
}

export async function getOpponents(): Promise<Opponent[]> {
  if (!isFirebaseAdminConfigured()) {
    return [];
  }

  const snap = await getAdminDb().collection("opponents").get();
  const opponents = snap.docs.map((doc) => docToOpponent(doc.id, doc.data()));
  return opponents.sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.schoolName.localeCompare(b.schoolName);
  });
}
