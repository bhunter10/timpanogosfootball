/**
 * Seeds baseline documents when FIREBASE_SERVICE_ACCOUNT is set.
 * Usage: FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}' npx tsx scripts/seed-firestore.ts
 */

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { ServiceAccount } from "firebase-admin/app";
import { defaultSiteSettings } from "../types/firestore";

function loadAccount(): ServiceAccount {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("Set FIREBASE_SERVICE_ACCOUNT to your service account JSON string.");
  }
  return JSON.parse(raw) as ServiceAccount;
}

async function main() {
  const cred = loadAccount();
  if (!getApps().length) {
    initializeApp({ credential: cert(cred) });
  }
  const db = getFirestore();

  await db
    .collection("siteSettings")
    .doc("main")
    .set(
      {
        ...defaultSiteSettings,
      },
      { merge: true },
    );

  const games = await db.collection("scheduleGames").limit(1).get();
  if (games.empty) {
    await db.collection("scheduleGames").add({
      opponent: "Scrimmage / TBD",
      dateISO: new Date().toISOString(),
      location: "Home/Away",
      address: "1450 N 200 E, Orem, UT 84057",
      isHome: true,
      sortOrder: 0,
      result: null,
      notes: "Example row — replace from admin.",
    });
  }

  const staff = await db.collection("staff").limit(1).get();
  if (staff.empty) {
    await db.collection("staff").add({
      name: "Example Coach",
      role: "Head Coach",
      bio: "Replace with real bios from the admin console.",
      photoUrl: null,
      email: null,
      sortOrder: 0,
    });
  }

  console.log("Seed complete: siteSettings/main + optional sample rows.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
