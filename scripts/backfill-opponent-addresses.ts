/**
 * Copies legacy scheduleGames.address values onto linked opponents.
 *
 * Usage: npx tsx scripts/backfill-opponent-addresses.ts
 */

import { loadEnvConfig } from "@next/env";
import { getAdminDb } from "../lib/firebase/admin";

loadEnvConfig(process.cwd());

type Candidate = {
  address: string;
  gameId: string;
  opponentName: string;
};

function clean(value: unknown): string | undefined {
  const text = String(value ?? "").trim();
  return text || undefined;
}

async function main() {
  const db = getAdminDb();
  const scheduleSnap = await db.collection("scheduleGames").get();
  const candidatesByOpponent = new Map<string, Candidate[]>();

  for (const doc of scheduleSnap.docs) {
    const data = doc.data();
    const opponentId = clean(data.opponentId);
    const address = clean(data.address);
    if (!opponentId || !address) continue;

    const candidates = candidatesByOpponent.get(opponentId) ?? [];
    candidates.push({
      address,
      gameId: doc.id,
      opponentName: clean(data.opponent) ?? "Unknown opponent",
    });
    candidatesByOpponent.set(opponentId, candidates);
  }

  let updated = 0;
  let skippedExisting = 0;
  let skippedConflicts = 0;
  let missingOpponents = 0;

  for (const [opponentId, candidates] of candidatesByOpponent) {
    const opponentRef = db.collection("opponents").doc(opponentId);
    const opponentSnap = await opponentRef.get();
    if (!opponentSnap.exists) {
      missingOpponents += 1;
      console.warn(`Missing opponent ${opponentId}; schedule games: ${candidates.map((c) => c.gameId).join(", ")}`);
      continue;
    }

    const existingAddress = clean(opponentSnap.data()?.address);
    const opponentName = clean(opponentSnap.data()?.schoolName) ?? candidates[0].opponentName;
    if (existingAddress) {
      skippedExisting += 1;
      console.log(`Skipped ${opponentName}: already has address "${existingAddress}".`);
      continue;
    }

    const uniqueAddresses = [...new Set(candidates.map((candidate) => candidate.address))];
    if (uniqueAddresses.length > 1) {
      skippedConflicts += 1;
      console.warn(
        `Skipped ${opponentName}: multiple legacy addresses found: ${uniqueAddresses.join(" | ")}`,
      );
      continue;
    }

    await opponentRef.set({ address: uniqueAddresses[0] }, { merge: true });
    updated += 1;
    console.log(`Updated ${opponentName}: ${uniqueAddresses[0]}`);
  }

  console.log(
    `Backfill complete. Updated ${updated}; skipped existing ${skippedExisting}; skipped conflicts ${skippedConflicts}; missing opponents ${missingOpponents}.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
