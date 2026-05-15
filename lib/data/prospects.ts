import type { DocumentData } from "firebase-admin/firestore";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";

export type ProspectStatus = "available" | "committed";

export type Prospect = {
  id: string;
  jerseyNumber?: string;
  name: string;
  classYear: string;
  positions: string[];
  height?: string;
  weight?: string;
  photoUrl?: string;
  hudlUrl?: string;
  xUrl?: string;
  instagramUrl?: string;
  email?: string;
  status: ProspectStatus;
  honors?: string[];
  stats?: string[];
  isProspect: boolean;
  sortOrder: number;
};

function toStringArray(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    const values = value.map((item) => String(item).trim()).filter(Boolean);
    return values.length ? values : undefined;
  }
  if (typeof value === "string") {
    const values = value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
    return values.length ? values : undefined;
  }
  return undefined;
}

function docToProspect(id: string, data: DocumentData): Prospect {
  const status = String(data.status ?? "available");

  return {
    id,
    jerseyNumber: data.jerseyNumber ? String(data.jerseyNumber) : undefined,
    name: String(data.name ?? ""),
    classYear: String(data.classYear ?? ""),
    positions: toStringArray(data.positions) ?? [],
    height: data.height ? String(data.height) : undefined,
    weight: data.weight ? String(data.weight) : undefined,
    photoUrl: data.photoUrl ? String(data.photoUrl) : undefined,
    hudlUrl: data.hudlUrl ? String(data.hudlUrl) : undefined,
    xUrl: data.xUrl ? String(data.xUrl) : undefined,
    instagramUrl: data.instagramUrl ? String(data.instagramUrl) : undefined,
    email: data.email ? String(data.email) : undefined,
    status: status === "committed" ? "committed" : "available",
    honors: toStringArray(data.honors),
    stats: toStringArray(data.stats),
    isProspect: Boolean(data.isProspect),
    sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 0,
  };
}

export async function getRosterPlayers(): Promise<Prospect[]> {
  if (!isFirebaseAdminConfigured()) {
    return [];
  }
  const snap = await getAdminDb().collection("roster").get();
  const players = snap.docs.map((doc) => docToProspect(doc.id, doc.data()));
  return players.sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getProspects(): Promise<Prospect[]> {
  const players = await getRosterPlayers();
  return players.filter((player) => player.isProspect);
}
