import type { DocumentData } from "firebase-admin/firestore";
import { getAdminDb, isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import type { Opponent, ScheduleGame } from "@/types/firestore";
import { docToOpponent } from "@/lib/data/opponents";

function docToGame(
  id: string,
  data: DocumentData,
  opponent?: Opponent,
): ScheduleGame {
  return {
    id,
    opponentId: data.opponentId ? String(data.opponentId) : undefined,
    opponent:
      opponent?.shortName ||
      opponent?.schoolName ||
      String(data.opponent ?? ""),
    opponentMascot: opponent?.mascot,
    opponentLogoUrl: opponent?.logoUrl,
    opponentPrimaryColor: opponent?.primaryColor,
    opponentSecondaryColor: opponent?.secondaryColor,
    dateISO: String(data.dateISO ?? ""),
    location: String(data.location ?? ""),
    isHome: Boolean(data.isHome),
    address: Boolean(data.isHome)
      ? undefined
      : opponent?.address || (data.address ? String(data.address) : undefined),
    result: data.result ? String(data.result) : undefined,
    notes: data.notes ? String(data.notes) : undefined,
    sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 0,
  };
}

export async function getScheduleGames(): Promise<ScheduleGame[]> {
  if (!isFirebaseAdminConfigured()) {
    return [];
  }
  const db = getAdminDb();
  const [scheduleSnap, opponentsSnap] = await Promise.all([
    db.collection("scheduleGames").get(),
    db.collection("opponents").get(),
  ]);
  const opponents = new Map(
    opponentsSnap.docs.map((doc) => [doc.id, docToOpponent(doc.id, doc.data())]),
  );
  const games = scheduleSnap.docs.map((d) => {
    const data = d.data();
    const opponentId = data.opponentId ? String(data.opponentId) : undefined;
    return docToGame(d.id, data, opponentId ? opponents.get(opponentId) : undefined);
  });
  return games.sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
    return a.dateISO.localeCompare(b.dateISO);
  });
}
