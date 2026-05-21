"use server";

import { refresh, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { FieldValue } from "firebase-admin/firestore";
import sharp from "sharp";
import { z } from "zod";
import { verifyAdminSession } from "@/lib/auth/session";
import {
  getAdminDb,
  getAdminStorageBucket,
  isFirebaseAdminConfigured,
} from "@/lib/firebase/admin";
import { scheduleDatetimeLocalToIso } from "@/lib/date/schedule-time";

async function requireAdminSession() {
  if (!isFirebaseAdminConfigured()) {
    throw new Error("Firebase Admin is not configured.");
  }
  const session = await verifyAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
}

const settingsSchema = z.object({
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  heroImageUrl: z.string().optional(),
  ticketUrl: z.string().optional(),
  ticketSecondaryUrl: z.string().optional(),
  ticketBlurb: z.string().optional(),
  shopPrimaryUrl: z.string().optional(),
  shopMessage: z.string().optional(),
  recruitingFormUrl: z.string().optional(),
  recruitingBlurb: z.string().optional(),
  footerNote: z.string().optional(),
});

const optionalSettingFields = [
  "heroImageUrl",
  "ticketUrl",
  "ticketSecondaryUrl",
  "ticketBlurb",
  "shopPrimaryUrl",
  "shopMessage",
  "recruitingFormUrl",
  "recruitingBlurb",
  "footerNote",
] as const;

export type SaveSiteSettingsState = {
  status: "idle" | "success" | "error";
  message: string;
  savedAt?: string;
};

function optStr(v: FormDataEntryValue | null): string | undefined {
  const s = String(v ?? "").trim();
  return s === "" ? undefined : s;
}

function siteSettingsWriteData(settings: z.infer<typeof settingsSchema>) {
  const data: Record<string, unknown> = {
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
  };

  for (const field of optionalSettingFields) {
    data[field] = settings[field] ?? FieldValue.delete();
  }

  return data;
}

export async function saveSiteSettings(
  _prevState: SaveSiteSettingsState,
  formData: FormData,
): Promise<SaveSiteSettingsState> {
  await requireAdminSession();
  const parsed = settingsSchema.safeParse({
    heroTitle: String(formData.get("heroTitle") ?? ""),
    heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
    heroImageUrl: optStr(formData.get("heroImageUrl")),
    ticketUrl: optStr(formData.get("ticketUrl")),
    ticketSecondaryUrl: optStr(formData.get("ticketSecondaryUrl")),
    ticketBlurb: optStr(formData.get("ticketBlurb")),
    shopPrimaryUrl: optStr(formData.get("shopPrimaryUrl")),
    shopMessage: optStr(formData.get("shopMessage")),
    recruitingFormUrl: optStr(formData.get("recruitingFormUrl")),
    recruitingBlurb: optStr(formData.get("recruitingBlurb")),
    footerNote: optStr(formData.get("footerNote")),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Could not save. Hero title and subtitle are required.",
    };
  }

  await getAdminDb()
    .collection("siteSettings")
    .doc("main")
    .set(siteSettingsWriteData(parsed.data), { merge: true });

  revalidatePath("/");
  revalidatePath("/tickets");
  revalidatePath("/shop");
  revalidatePath("/recruiting");

  return {
    status: "success",
    message: "Settings saved.",
    savedAt: new Date().toISOString(),
  };
}

const gameSchema = z.object({
  teamLevel: z.enum(["varsity", "jv", "freshman"]),
  opponentId: z.string().optional(),
  opponent: z.string().optional(),
  dateISO: z.string().min(1),
  location: z.string().min(1),
  isHome: z.enum(["true", "false"]),
  result: z.string().optional(),
  notes: z.string().optional(),
  sortOrder: z.coerce.number().int(),
});

async function getOpponentName(opponentId: string): Promise<string | undefined> {
  const snap = await getAdminDb().collection("opponents").doc(opponentId).get();
  if (!snap.exists) return undefined;
  const data = snap.data();
  return String(data?.shortName || data?.schoolName || "").trim() || undefined;
}

async function parseScheduleGameForm(formData: FormData) {
  const kickoffLocal = String(formData.get("kickoffLocal") ?? "");
  const dateISO = kickoffLocal
    ? scheduleDatetimeLocalToIso(kickoffLocal)
    : String(formData.get("dateISO") ?? "");
  const opponentId = optStr(formData.get("opponentId"));
  const opponent = opponentId
    ? await getOpponentName(opponentId)
    : optStr(formData.get("opponent"));

  return gameSchema.safeParse({
    teamLevel: formData.get("teamLevel") || "varsity",
    opponentId,
    opponent,
    dateISO,
    location: formData.get("location"),
    isHome: formData.get("isHome") === "true" ? "true" : "false",
    result: formData.get("result") || undefined,
    notes: formData.get("notes") || undefined,
    sortOrder: formData.get("sortOrder") || "0",
  });
}

function refreshScheduleViews() {
  revalidatePath("/schedule");
  revalidatePath("/admin/schedule");
  revalidatePath("/");
  refresh();
}

export async function createScheduleGame(formData: FormData) {
  await requireAdminSession();
  const parsed = await parseScheduleGameForm(formData);

  if (!parsed.success || !parsed.data.opponent) {
    return;
  }

  const g = parsed.data;
  await getAdminDb().collection("scheduleGames").add({
    teamLevel: g.teamLevel,
    opponentId: g.opponentId || null,
    opponent: g.opponent,
    dateISO: g.dateISO,
    location: g.location,
    isHome: g.isHome === "true",
    result: g.result || null,
    notes: g.notes || null,
    sortOrder: g.sortOrder,
  });

  refreshScheduleViews();
}

export async function updateScheduleGame(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const parsed = await parseScheduleGameForm(formData);

  if (!parsed.success || !parsed.data.opponent) {
    return;
  }

  const g = parsed.data;
  await getAdminDb().collection("scheduleGames").doc(id).set(
    {
      teamLevel: g.teamLevel,
      opponentId: g.opponentId || null,
      opponent: g.opponent,
      dateISO: g.dateISO,
      location: g.location,
      isHome: g.isHome === "true",
      result: g.result || null,
      notes: g.notes || null,
      sortOrder: g.sortOrder,
    },
    { merge: true },
  );

  refreshScheduleViews();
}

export async function deleteScheduleGame(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await getAdminDb().collection("scheduleGames").doc(id).delete();
  refreshScheduleViews();
}

const staffSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),
  email: z.string().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

const staffOrderSchema = z.array(z.string().min(1));

const prospectSchema = z.object({
  name: z.string().min(1),
  jerseyNumber: z.string().optional(),
  classYear: z.string().min(1),
  positions: z.array(z.string()).min(1),
  height: z.string().optional(),
  weight: z.string().optional(),
  photoUrl: z.string().optional(),
  hudlUrl: z.string().optional(),
  xUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  email: z.string().optional(),
  status: z.enum(["available", "committed"]),
  honors: z.array(z.string()).optional(),
  stats: z.array(z.string()).optional(),
  isProspect: z.boolean(),
  sortOrder: z.coerce.number().int(),
});

const MAX_STAFF_PHOTO_BYTES = 5 * 1024 * 1024;
const allowedStaffPhotoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_PROSPECT_PHOTO_BYTES = 5 * 1024 * 1024;
const allowedProspectPhotoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_OPPONENT_LOGO_BYTES = 2 * 1024 * 1024;
const OPPONENT_LOGO_MAX_DIMENSION = 400;
const allowedOpponentLogoTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function getStaffPhotoFile(formData: FormData): File | undefined {
  const file = formData.get("photoFile");
  if (!(file instanceof File) || file.size === 0) return undefined;
  return file;
}

function getProspectPhotoFile(formData: FormData): File | undefined {
  const file = formData.get("photoFile");
  if (!(file instanceof File) || file.size === 0) return undefined;
  return file;
}

function getOpponentLogoFile(formData: FormData): File | undefined {
  const file = formData.get("logoFile");
  if (!(file instanceof File) || file.size === 0) return undefined;
  return file;
}

function extensionForContentType(contentType: string): string {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}

async function uploadStaffPhoto(file: File, name: string): Promise<string> {
  if (!allowedStaffPhotoTypes.has(file.type)) {
    throw new Error("Staff photos must be JPG, PNG, or WebP images.");
  }
  if (file.size > MAX_STAFF_PHOTO_BYTES) {
    throw new Error("Staff photos must be smaller than 5 MB.");
  }

  const token = randomUUID();
  const ext = extensionForContentType(file.type);
  const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const storagePath = `staff/${safeName || "member"}-${token}.${ext}`;
  const storageFile = getAdminStorageBucket().file(storagePath);
  const buffer = Buffer.from(await file.arrayBuffer());

  const [bucketExists] = await storageFile.bucket.exists();
  if (!bucketExists) {
    throw new Error(
      `Firebase Storage bucket "${storageFile.bucket.name}" does not exist. Create a Storage bucket in Firebase, or set FIREBASE_STORAGE_BUCKET to the existing bucket name.`,
    );
  }

  await storageFile.save(buffer, {
    contentType: file.type,
    resumable: false,
    metadata: {
      cacheControl: "public, max-age=31536000, immutable",
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  return `https://firebasestorage.googleapis.com/v0/b/${storageFile.bucket.name}/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`;
}

async function uploadProspectPhoto(file: File, name: string): Promise<string> {
  if (!allowedProspectPhotoTypes.has(file.type)) {
    throw new Error("Prospect photos must be JPG, PNG, or WebP images.");
  }
  if (file.size > MAX_PROSPECT_PHOTO_BYTES) {
    throw new Error("Prospect photos must be smaller than 5 MB.");
  }

  const token = randomUUID();
  const ext = extensionForContentType(file.type);
  const safeName = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const storagePath = `prospects/${safeName || "prospect"}-${token}.${ext}`;
  const storageFile = getAdminStorageBucket().file(storagePath);
  const buffer = Buffer.from(await file.arrayBuffer());

  const [bucketExists] = await storageFile.bucket.exists();
  if (!bucketExists) {
    throw new Error(
      `Firebase Storage bucket "${storageFile.bucket.name}" does not exist. Create a Storage bucket in Firebase, or set FIREBASE_STORAGE_BUCKET to the existing bucket name.`,
    );
  }

  await storageFile.save(buffer, {
    contentType: file.type,
    resumable: false,
    metadata: {
      cacheControl: "public, max-age=31536000, immutable",
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
    },
  });

  return `https://firebasestorage.googleapis.com/v0/b/${storageFile.bucket.name}/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`;
}

async function uploadOpponentLogo(file: File, schoolName: string): Promise<string> {
  if (!allowedOpponentLogoTypes.has(file.type)) {
    throw new Error("Opponent logos must be JPG, PNG, or WebP images.");
  }
  if (file.size > MAX_OPPONENT_LOGO_BYTES) {
    throw new Error("Opponent logos must be smaller than 2 MB.");
  }

  const token = randomUUID();
  const safeName = schoolName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const storagePath = `opponents/${safeName || "opponent"}-${token}.webp`;
  const storageFile = getAdminStorageBucket().file(storagePath);
  const sourceBuffer = Buffer.from(await file.arrayBuffer());
  const optimizedLogo = await sharp(sourceBuffer, { animated: false })
    .rotate()
    .resize({
      width: OPPONENT_LOGO_MAX_DIMENSION,
      height: OPPONENT_LOGO_MAX_DIMENSION,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 90, effort: 5 })
    .toBuffer();

  try {
    await storageFile.save(optimizedLogo, {
      contentType: "image/webp",
      resumable: false,
      metadata: {
        cacheControl: "public, max-age=31536000, immutable",
        metadata: {
          firebaseStorageDownloadTokens: token,
        },
      },
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Unknown Storage error";
    throw new Error(`Opponent logo upload failed: ${detail}`);
  }

  return `https://firebasestorage.googleapis.com/v0/b/${storageFile.bucket.name}/o/${encodeURIComponent(storagePath)}?alt=media&token=${token}`;
}

function getStoragePathFromDownloadUrl(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    const bucket = getAdminStorageBucket();

    if (parsed.hostname === "firebasestorage.googleapis.com") {
      const match = parsed.pathname.match(/^\/v0\/b\/([^/]+)\/o\/(.+)$/);
      if (!match) return undefined;
      const [, bucketName, encodedPath] = match;
      const storagePath = decodeURIComponent(encodedPath);
      if (bucketName !== bucket.name || !storagePath.startsWith("opponents/")) {
        return undefined;
      }
      return storagePath;
    }

    if (parsed.hostname === "storage.googleapis.com") {
      const parts = parsed.pathname.split("/").filter(Boolean);
      const [bucketName, ...pathParts] = parts;
      const storagePath = pathParts.map(decodeURIComponent).join("/");
      if (bucketName !== bucket.name || !storagePath.startsWith("opponents/")) {
        return undefined;
      }
      return storagePath;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

async function deleteOpponentLogoByUrl(url?: string | null) {
  if (!url) return;
  const storagePath = getStoragePathFromDownloadUrl(url);
  if (!storagePath) return;

  try {
    await getAdminStorageBucket().file(storagePath).delete({ ignoreNotFound: true });
  } catch (error) {
    console.warn("Could not delete old opponent logo", { storagePath, error });
  }
}

function redirectWithStaffUploadError(error: unknown): never {
  const message = error instanceof Error ? error.message : "Staff photo upload failed.";
  redirect(`/admin/staff?staffError=${encodeURIComponent(message)}`);
}

function redirectWithProspectUploadError(error: unknown): never {
  const message = error instanceof Error ? error.message : "Roster photo upload failed.";
  redirect(`/admin/roster?rosterError=${encodeURIComponent(message)}`);
}

function redirectWithOpponentUploadError(error: unknown): never {
  const message = error instanceof Error ? error.message : "Opponent logo upload failed.";
  redirect(`/admin/opponents?opponentError=${encodeURIComponent(message)}`);
}

function parseListField(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

const opponentSchema = z.object({
  schoolName: z.string().min(1),
  shortName: z.string().optional(),
  mascot: z.string().optional(),
  logoUrl: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  sortOrder: z.coerce.number().int(),
});

export async function createOpponent(formData: FormData) {
  await requireAdminSession();
  const uploadedLogo = getOpponentLogoFile(formData);
  const parsed = opponentSchema.safeParse({
    schoolName: formData.get("schoolName"),
    shortName: optStr(formData.get("shortName")),
    mascot: optStr(formData.get("mascot")),
    logoUrl: optStr(formData.get("logoUrl")),
    primaryColor: optStr(formData.get("primaryColor")),
    secondaryColor: optStr(formData.get("secondaryColor")),
    address: optStr(formData.get("address")),
    city: optStr(formData.get("city")),
    state: optStr(formData.get("state")),
    sortOrder: formData.get("sortOrder") || "0",
  });

  if (!parsed.success) {
    return;
  }

  const opponent = parsed.data;
  let logoUrl = opponent.logoUrl;
  if (uploadedLogo) {
    try {
      logoUrl = await uploadOpponentLogo(uploadedLogo, opponent.schoolName);
    } catch (error) {
      redirectWithOpponentUploadError(error);
    }
  }

  await getAdminDb().collection("opponents").add({
    schoolName: opponent.schoolName,
    shortName: opponent.shortName || null,
    mascot: opponent.mascot || null,
    logoUrl: logoUrl || null,
    primaryColor: opponent.primaryColor || null,
    secondaryColor: opponent.secondaryColor || null,
    address: opponent.address || null,
    city: opponent.city || null,
    state: opponent.state || null,
    sortOrder: opponent.sortOrder,
  });

  revalidatePath("/");
  revalidatePath("/schedule");
  revalidatePath("/admin/opponents");
  revalidatePath("/admin/schedule");
}

export async function updateOpponent(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const uploadedLogo = getOpponentLogoFile(formData);
  const existingSnap = await getAdminDb().collection("opponents").doc(id).get();
  const existingLogoUrl = existingSnap.data()?.logoUrl
    ? String(existingSnap.data()?.logoUrl)
    : undefined;
  const parsed = opponentSchema.safeParse({
    schoolName: formData.get("schoolName"),
    shortName: optStr(formData.get("shortName")),
    mascot: optStr(formData.get("mascot")),
    logoUrl: optStr(formData.get("logoUrl")),
    primaryColor: optStr(formData.get("primaryColor")),
    secondaryColor: optStr(formData.get("secondaryColor")),
    address: optStr(formData.get("address")),
    city: optStr(formData.get("city")),
    state: optStr(formData.get("state")),
    sortOrder: formData.get("sortOrder") || "0",
  });

  if (!parsed.success) {
    return;
  }

  const opponent = parsed.data;
  let logoUrl = opponent.logoUrl;
  let oldLogoUrlToDelete: string | undefined;
  if (uploadedLogo) {
    try {
      logoUrl = await uploadOpponentLogo(uploadedLogo, opponent.schoolName);
      oldLogoUrlToDelete = existingLogoUrl;
    } catch (error) {
      redirectWithOpponentUploadError(error);
    }
  } else if (existingLogoUrl && existingLogoUrl !== logoUrl) {
    oldLogoUrlToDelete = existingLogoUrl;
  }

  await getAdminDb().collection("opponents").doc(id).set(
    {
      schoolName: opponent.schoolName,
      shortName: opponent.shortName || null,
      mascot: opponent.mascot || null,
      logoUrl: logoUrl || null,
      primaryColor: opponent.primaryColor || null,
      secondaryColor: opponent.secondaryColor || null,
      address: opponent.address || null,
      city: opponent.city || null,
      state: opponent.state || null,
      sortOrder: opponent.sortOrder,
    },
    { merge: true },
  );
  await deleteOpponentLogoByUrl(oldLogoUrlToDelete);

  revalidatePath("/");
  revalidatePath("/schedule");
  revalidatePath("/admin/opponents");
  revalidatePath("/admin/schedule");
}

export async function deleteOpponent(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const snap = await getAdminDb().collection("opponents").doc(id).get();
  const logoUrl = snap.data()?.logoUrl ? String(snap.data()?.logoUrl) : undefined;
  await getAdminDb().collection("opponents").doc(id).delete();
  await deleteOpponentLogoByUrl(logoUrl);
  revalidatePath("/");
  revalidatePath("/schedule");
  revalidatePath("/admin/opponents");
  revalidatePath("/admin/schedule");
}

export async function createStaffMember(formData: FormData) {
  await requireAdminSession();
  const uploadedPhoto = getStaffPhotoFile(formData);
  const parsed = staffSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    bio: formData.get("bio") || undefined,
    photoUrl: formData.get("photoUrl") || undefined,
    email: formData.get("email") || undefined,
    sortOrder: formData.get("sortOrder") || undefined,
  });

  if (!parsed.success) {
    return;
  }

  const s = parsed.data;
  const sortOrder =
    s.sortOrder ??
    (await getAdminDb()
      .collection("staff")
      .get()
      .then((snap) =>
        snap.docs.reduce((max, doc) => {
          const value = doc.data().sortOrder;
          return typeof value === "number" ? Math.max(max, value) : max;
        }, -1),
      )) + 1;
  let photoUrl = s.photoUrl;
  if (uploadedPhoto) {
    try {
      photoUrl = await uploadStaffPhoto(uploadedPhoto, s.name);
    } catch (error) {
      redirectWithStaffUploadError(error);
    }
  }

  await getAdminDb().collection("staff").add({
    name: s.name,
    role: s.role,
    bio: s.bio || null,
    photoUrl: photoUrl || null,
    email: s.email || null,
    sortOrder,
  });

  revalidatePath("/staff");
  revalidatePath("/admin/staff");
}

export async function updateStaffMember(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const uploadedPhoto = getStaffPhotoFile(formData);

  const parsed = staffSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    bio: formData.get("bio") || undefined,
    photoUrl: formData.get("photoUrl") || undefined,
    email: formData.get("email") || undefined,
    sortOrder: formData.get("sortOrder") || undefined,
  });

  if (!parsed.success) {
    return;
  }

  const s = parsed.data;
  const existingSnap = await getAdminDb().collection("staff").doc(id).get();
  const existingSortOrder = existingSnap.data()?.sortOrder;
  let photoUrl = s.photoUrl;
  if (uploadedPhoto) {
    try {
      photoUrl = await uploadStaffPhoto(uploadedPhoto, s.name);
    } catch (error) {
      redirectWithStaffUploadError(error);
    }
  }

  await getAdminDb().collection("staff").doc(id).set(
    {
      name: s.name,
      role: s.role,
      bio: s.bio || null,
      photoUrl: photoUrl || null,
      email: s.email || null,
      sortOrder: s.sortOrder ?? (typeof existingSortOrder === "number" ? existingSortOrder : 0),
    },
    { merge: true },
  );

  revalidatePath("/staff");
  revalidatePath("/admin/staff");
}

export async function deleteStaffMember(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await getAdminDb().collection("staff").doc(id).delete();
  revalidatePath("/staff");
  revalidatePath("/admin/staff");
}

export async function reorderStaffMembers(ids: string[]) {
  await requireAdminSession();
  const parsed = staffOrderSchema.safeParse(ids);
  if (!parsed.success) return;

  const batch = getAdminDb().batch();
  parsed.data.forEach((id, index) => {
    batch.update(getAdminDb().collection("staff").doc(id), { sortOrder: index });
  });

  await batch.commit();
  revalidatePath("/staff");
  revalidatePath("/admin/staff");
}

function refreshRosterViews() {
  revalidatePath("/roster");
  revalidatePath("/prospects");
  revalidatePath("/admin/roster");
  refresh();
}

export async function createRosterPlayer(formData: FormData) {
  await requireAdminSession();
  const uploadedPhoto = getProspectPhotoFile(formData);
  const parsed = prospectSchema.safeParse({
    name: formData.get("name"),
    jerseyNumber: optStr(formData.get("jerseyNumber")),
    classYear: formData.get("classYear"),
    positions: parseListField(formData.get("positions")),
    height: optStr(formData.get("height")),
    weight: optStr(formData.get("weight")),
    photoUrl: optStr(formData.get("photoUrl")),
    hudlUrl: optStr(formData.get("hudlUrl")),
    xUrl: optStr(formData.get("xUrl")),
    instagramUrl: optStr(formData.get("instagramUrl")),
    email: optStr(formData.get("email")),
    status: formData.get("status") || "available",
    honors: parseListField(formData.get("honors")),
    stats: parseListField(formData.get("stats")),
    isProspect: formData.get("isProspect") === "on",
    sortOrder: formData.get("sortOrder") || "0",
  });

  if (!parsed.success) {
    return;
  }

  const prospect = parsed.data;
  let photoUrl = prospect.photoUrl;
  if (uploadedPhoto) {
    try {
      photoUrl = await uploadProspectPhoto(uploadedPhoto, prospect.name);
    } catch (error) {
      redirectWithProspectUploadError(error);
    }
  }

  await getAdminDb().collection("roster").add({
    name: prospect.name,
    jerseyNumber: prospect.jerseyNumber || null,
    classYear: prospect.classYear,
    positions: prospect.positions,
    height: prospect.height || null,
    weight: prospect.weight || null,
    photoUrl: photoUrl || null,
    hudlUrl: prospect.hudlUrl || null,
    xUrl: prospect.xUrl || null,
    instagramUrl: prospect.instagramUrl || null,
    email: prospect.email || null,
    status: prospect.status,
    honors: prospect.honors ?? [],
    stats: prospect.stats ?? [],
    isProspect: prospect.isProspect,
    sortOrder: prospect.sortOrder,
  });

  refreshRosterViews();
}

export async function updateRosterPlayer(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const uploadedPhoto = getProspectPhotoFile(formData);
  const parsed = prospectSchema.safeParse({
    name: formData.get("name"),
    jerseyNumber: optStr(formData.get("jerseyNumber")),
    classYear: formData.get("classYear"),
    positions: parseListField(formData.get("positions")),
    height: optStr(formData.get("height")),
    weight: optStr(formData.get("weight")),
    photoUrl: optStr(formData.get("photoUrl")),
    hudlUrl: optStr(formData.get("hudlUrl")),
    xUrl: optStr(formData.get("xUrl")),
    instagramUrl: optStr(formData.get("instagramUrl")),
    email: optStr(formData.get("email")),
    status: formData.get("status") || "available",
    honors: parseListField(formData.get("honors")),
    stats: parseListField(formData.get("stats")),
    isProspect: formData.get("isProspect") === "on",
    sortOrder: formData.get("sortOrder") || "0",
  });

  if (!parsed.success) {
    return;
  }

  const prospect = parsed.data;
  let photoUrl = prospect.photoUrl;
  if (uploadedPhoto) {
    try {
      photoUrl = await uploadProspectPhoto(uploadedPhoto, prospect.name);
    } catch (error) {
      redirectWithProspectUploadError(error);
    }
  }

  await getAdminDb().collection("roster").doc(id).set(
    {
      name: prospect.name,
      jerseyNumber: prospect.jerseyNumber || null,
      classYear: prospect.classYear,
      positions: prospect.positions,
      height: prospect.height || null,
      weight: prospect.weight || null,
      photoUrl: photoUrl || null,
      hudlUrl: prospect.hudlUrl || null,
      xUrl: prospect.xUrl || null,
      instagramUrl: prospect.instagramUrl || null,
      email: prospect.email || null,
      status: prospect.status,
      honors: prospect.honors ?? [],
      stats: prospect.stats ?? [],
      isProspect: prospect.isProspect,
      sortOrder: prospect.sortOrder,
    },
    { merge: true },
  );

  refreshRosterViews();
}

export async function deleteRosterPlayer(formData: FormData) {
  await requireAdminSession();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await getAdminDb().collection("roster").doc(id).delete();
  refreshRosterViews();
}
