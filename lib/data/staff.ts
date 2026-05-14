import type { DocumentData } from "firebase-admin/firestore";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import type { StaffMember } from "@/types/firestore";

function docToStaff(id: string, data: DocumentData): StaffMember {
  return {
    id,
    name: String(data.name ?? ""),
    role: String(data.role ?? ""),
    bio: data.bio ? String(data.bio) : undefined,
    photoUrl: data.photoUrl ? String(data.photoUrl) : undefined,
    email: data.email ? String(data.email) : undefined,
    sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 0,
  };
}

export async function getStaffMembers(): Promise<StaffMember[]> {
  if (!isFirebaseAdminConfigured()) {
    return [];
  }
  const snap = await getAdminDb().collection("staff").get();
  const members = snap.docs.map((d) => docToStaff(d.id, d.data()));
  return members.sort((a, b) => a.sortOrder - b.sortOrder);
}
