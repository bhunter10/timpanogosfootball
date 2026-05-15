import { readFileSync, existsSync } from "node:fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { ServiceAccount } from "firebase-admin/app";

type RosterRow = {
  jerseyNumber: string;
  name: string;
  positions: string[];
  grade: "Sr." | "Jr." | "So." | "Fr.";
  height?: string;
  weight?: string;
};

const sourceUrl =
  "https://www.maxpreps.com/ut/orem/timpanogos-timberwolves/football/roster/print/?print=1";

const rows: RosterRow[] = [
  { jerseyNumber: "1", name: "Noah Torgersen", positions: ["DB"], grade: "Sr.", height: "6'1\"", weight: "175 lbs" },
  { jerseyNumber: "2", name: "Kyle Lapray", positions: ["WR"], grade: "Sr.", height: "6'5\"", weight: "170 lbs" },
  { jerseyNumber: "3", name: "Ian Longhurst", positions: ["WR"], grade: "Jr.", height: "6'2\"", weight: "182 lbs" },
  { jerseyNumber: "4", name: "Tevita Mounga", positions: ["WR"], grade: "Jr.", height: "6'1\"", weight: "210 lbs" },
  { jerseyNumber: "5", name: "Marlee Iosefo", positions: ["LB", "RB"], grade: "Sr.", height: "6'1\"", weight: "211 lbs" },
  { jerseyNumber: "6", name: "Sam Stewart", positions: ["DB"], grade: "Sr.", height: "5'10\"", weight: "162 lbs" },
  { jerseyNumber: "7", name: "Andrew Hillstead", positions: ["QB"], grade: "Sr.", height: "6'1\"", weight: "205 lbs" },
  { jerseyNumber: "8", name: "Jesse King", positions: ["DL"], grade: "Sr.", height: "6'4\"", weight: "253 lbs" },
  { jerseyNumber: "9", name: "Kendall Hansen", positions: ["DB"], grade: "Sr.", height: "5'11\"", weight: "174 lbs" },
  { jerseyNumber: "10", name: "Zack McCann", positions: ["SB", "RB"], grade: "Jr.", height: "5'8\"", weight: "155 lbs" },
  { jerseyNumber: "11", name: "Cade Whimpey", positions: ["DB"], grade: "Sr.", height: "5'10\"", weight: "164 lbs" },
  { jerseyNumber: "12", name: "Tyson Knapp", positions: ["WR", "QB"], grade: "Jr.", height: "5'11\"", weight: "163 lbs" },
  { jerseyNumber: "13", name: "Tristan Faatoafe", positions: ["DB"], grade: "Sr.", height: "6'0\"", weight: "175 lbs" },
  { jerseyNumber: "17", name: "Logan Holloway", positions: ["QB", "RB"], grade: "So.", height: "5'9\"", weight: "170 lbs" },
  { jerseyNumber: "18", name: "Luke Warner", positions: ["DB", "WR"], grade: "So.", height: "6'0\"", weight: "155 lbs" },
  { jerseyNumber: "19", name: "Noah Sibbett", positions: ["WR"], grade: "Sr.", height: "5'8\"", weight: "155 lbs" },
  { jerseyNumber: "20", name: "Wyatt Yancey", positions: ["LB"], grade: "Jr.", height: "6'1\"", weight: "175 lbs" },
  { jerseyNumber: "21", name: "Luke Bergin", positions: ["DB", "K"], grade: "Jr.", height: "6'1\"", weight: "176 lbs" },
  { jerseyNumber: "22", name: "Wilder Peterson", positions: ["WR"], grade: "Jr.", height: "5'10\"", weight: "155 lbs" },
  { jerseyNumber: "23", name: "Daxton Allen", positions: ["RB"], grade: "Sr.", height: "5'8\"", weight: "179 lbs" },
  { jerseyNumber: "24", name: "Stockton Sondrup", positions: ["DL"], grade: "Sr.", height: "6'4\"", weight: "203 lbs" },
  { jerseyNumber: "25", name: "Donovan Holloway", positions: ["RB"], grade: "Sr.", height: "5'8\"", weight: "157 lbs" },
  { jerseyNumber: "30", name: "Cody Bilbao", positions: ["WR"], grade: "Jr.", height: "6'0\"", weight: "155 lbs" },
  { jerseyNumber: "31", name: "Giovanny Baca", positions: ["K"], grade: "Sr.", height: "5'10\"", weight: "161 lbs" },
  { jerseyNumber: "32", name: "Garrett Haymore", positions: ["WR", "DB"], grade: "Jr.", height: "6'3\"", weight: "173 lbs" },
  { jerseyNumber: "34", name: "Shane Eaquinto", positions: ["WR"], grade: "Jr.", height: "6'2\"", weight: "194 lbs" },
  { jerseyNumber: "35", name: "Bennett Shumaker", positions: ["RB"], grade: "Jr.", height: "5'9\"", weight: "165 lbs" },
  { jerseyNumber: "36", name: "Ryker Palmer", positions: ["K"], grade: "Sr.", height: "6'3\"" },
  { jerseyNumber: "37", name: "Logan Lee", positions: ["WR"], grade: "So.", height: "6'1\"", weight: "180 lbs" },
  { jerseyNumber: "38", name: "Zayne Laidler", positions: ["DB"], grade: "Jr.", height: "5'7\"", weight: "142 lbs" },
  { jerseyNumber: "39", name: "Jace Spencer", positions: ["WR"], grade: "So.", height: "5'9\"", weight: "155 lbs" },
  { jerseyNumber: "40", name: "Bronco Blackhurst", positions: ["WR", "QB"], grade: "So.", height: "5'9\"", weight: "147 lbs" },
  { jerseyNumber: "41", name: "Ezra Escalante", positions: ["QB"], grade: "Fr.", height: "5'10\"" },
  { jerseyNumber: "42", name: "Iveni Mounga", positions: ["LB"], grade: "Fr.", height: "5'7\"", weight: "140 lbs" },
  { jerseyNumber: "43", name: "Matthew Iosefo", positions: ["LB"], grade: "Fr.", height: "5'8\"", weight: "145 lbs" },
  { jerseyNumber: "44", name: "Lucas Da Silva", positions: ["DB"], grade: "Jr.", height: "5'9\"", weight: "171 lbs" },
  { jerseyNumber: "45", name: "Taysom Larsen", positions: ["LB"], grade: "Jr.", height: "5'11\"" },
  { jerseyNumber: "46", name: "Nainoa Manley", positions: ["LB"], grade: "Fr.", height: "5'7\"", weight: "150 lbs" },
  { jerseyNumber: "47", name: "Tuli Leuga", positions: ["DB"], grade: "Sr.", height: "6'0\"", weight: "160 lbs" },
  { jerseyNumber: "49", name: "McCord Hall", positions: ["DB"], grade: "Sr.", height: "5'11\"", weight: "168 lbs" },
  { jerseyNumber: "50", name: "Richard Afoa", positions: ["DL", "OL"], grade: "So.", height: "5'10\"", weight: "225 lbs" },
  { jerseyNumber: "51", name: "Benjamin Haslam", positions: ["OL", "DL"], grade: "Jr.", height: "5'10\"", weight: "203 lbs" },
  { jerseyNumber: "52", name: "Crew Clegg", positions: ["OL", "DL"], grade: "Jr.", height: "5'9\"", weight: "181 lbs" },
  { jerseyNumber: "53", name: "Kapplann Nukaya", positions: ["LB"], grade: "So.", height: "6'0\"", weight: "175 lbs" },
  { jerseyNumber: "54", name: "Andrew Sanders", positions: ["OL", "DL"], grade: "Jr.", height: "6'4\"", weight: "278 lbs" },
  { jerseyNumber: "55", name: "Wes Hall", positions: ["OL", "DL"], grade: "Sr.", height: "6'3\"", weight: "286 lbs" },
  { jerseyNumber: "60", name: "Bode Bambl", positions: ["DL", "OL"], grade: "So.", height: "5'1\"", weight: "230 lbs" },
  { jerseyNumber: "63", name: "Scott Martin", positions: ["OL", "DL"], grade: "Sr.", height: "6'3\"", weight: "251 lbs" },
  { jerseyNumber: "64", name: "Matthew Riding", positions: ["DB"], grade: "So.", height: "5'11\"", weight: "160 lbs" },
  { jerseyNumber: "65", name: "Matsuo Okamura", positions: ["LB", "DL"], grade: "Jr.", height: "5'8\"", weight: "200 lbs" },
  { jerseyNumber: "70", name: "Achilles Magelle", positions: ["DL"], grade: "Jr.", height: "6'1\"", weight: "204 lbs" },
  { jerseyNumber: "71", name: "Simote Afu", positions: ["OL"], grade: "So.", height: "6'4\"", weight: "330 lbs" },
  { jerseyNumber: "72", name: "Filimone Afu", positions: ["OL"], grade: "Sr.", height: "6'4\"", weight: "363 lbs" },
  { jerseyNumber: "74", name: "Lucas Turner", positions: ["K"], grade: "Sr.", height: "6'3\"", weight: "185 lbs" },
  { jerseyNumber: "75", name: "Kevini Afu", positions: ["OL"], grade: "Sr.", height: "6'2\"", weight: "341 lbs" },
  { jerseyNumber: "76", name: "Inti Perez-Catron", positions: ["DL", "OL"], grade: "Fr.", height: "5'7\"", weight: "190 lbs" },
  { jerseyNumber: "77", name: "Cyrus Guereca", positions: ["DL"], grade: "Sr.", height: "5'9\"", weight: "223 lbs" },
  { jerseyNumber: "78", name: "Joseph Alisa", positions: ["OL", "DL"], grade: "Jr.", height: "6'1\"", weight: "315 lbs" },
  { jerseyNumber: "82", name: "Owen Garfield", positions: ["WR"], grade: "Fr.", height: "5'10\"", weight: "145 lbs" },
  { jerseyNumber: "83", name: "Tyce Eaquinto", positions: ["LB"], grade: "Fr.", height: "5'9\"", weight: "205 lbs" },
  { jerseyNumber: "84", name: "Ethan Brown", positions: ["DB"], grade: "So.", height: "6'2\"", weight: "178 lbs" },
  { jerseyNumber: "88", name: "Lincoln Lewis", positions: ["WR"], grade: "Fr.", height: "5'10\"", weight: "148 lbs" },
  { jerseyNumber: "89", name: "Cole Taylor", positions: ["K"], grade: "Sr.", height: "6'4\"", weight: "172 lbs" },
];

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

function classYearForGrade(grade: RosterRow["grade"]) {
  if (grade === "Sr.") return "2026";
  if (grade === "Jr.") return "2027";
  if (grade === "So.") return "2028";
  return "2029";
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
  const batch = db.batch();

  const activeRows = rows.filter((row) => row.grade !== "Sr.");

  activeRows.forEach((row, index) => {
    const docId = `maxpreps-2025-${row.jerseyNumber}-${slugify(row.name)}`;
    const ref = db.collection("roster").doc(docId);
    batch.set(
      ref,
      {
        jerseyNumber: row.jerseyNumber,
        name: row.name,
        classYear: classYearForGrade(row.grade),
        positions: row.positions,
        height: row.height ?? null,
        weight: row.weight ?? null,
        photoUrl: null,
        hudlUrl: null,
        xUrl: null,
        email: null,
        status: "available",
        honors: [],
        stats: [],
        isProspect: false,
        sortOrder: index,
        source: {
          provider: "MaxPreps",
          season: "2025-26",
          url: sourceUrl,
          importedAt: new Date().toISOString(),
        },
      },
      { merge: true },
    );
  });

  await batch.commit();
  console.log(
    `Imported ${activeRows.length} non-senior roster players from MaxPreps 2025-26 roster.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
