import { readFileSync, existsSync } from "node:fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { ServiceAccount } from "firebase-admin/app";

function loadEnvFile() {
  if (!existsSync(".env.local")) return;
  const contents = readFileSync(".env.local", "utf8");
  for (const line of contents.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

async function main() {
  loadEnvFile();
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("Set FIREBASE_SERVICE_ACCOUNT in the environment or .env.local.");
  }

  if (!getApps().length) {
    initializeApp({ credential: cert(JSON.parse(raw) as ServiceAccount) });
  }

  const db = getFirestore();
  const snap = await db
    .collection("roster")
    .where("classYear", "==", "2026")
    .where("source.provider", "==", "MaxPreps")
    .where("source.season", "==", "2025-26")
    .get();

  if (snap.empty) {
    console.log("No imported 2026 seniors found.");
    return;
  }

  const batch = db.batch();
  snap.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  console.log(`Removed ${snap.size} imported 2026 seniors from roster.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
