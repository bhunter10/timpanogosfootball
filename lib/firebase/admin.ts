import {
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

let serviceAccount: ServiceAccount | undefined;

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);
}

function parseServiceAccount(): ServiceAccount {
  if (serviceAccount) return serviceAccount;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT");
  }
  serviceAccount = JSON.parse(raw) as ServiceAccount;
  return serviceAccount;
}

function getConfiguredStorageBucketName(): string | undefined {
  const account = parseServiceAccount() as ServiceAccount & { project_id?: string };
  const projectId = account.projectId ?? account.project_id;
  const bucketName =
    process.env.FIREBASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    (projectId ? `${projectId}.appspot.com` : undefined);

  return bucketName?.replace(/^gs:\/\//, "").replace(/\/$/, "");
}

let adminApp: App | undefined;

export function getAdminApp(): App {
  if (!isFirebaseAdminConfigured()) {
    throw new Error("Firebase Admin is not configured");
  }
  if (!adminApp) {
    const existing = getApps()[0];
    adminApp =
      existing ??
      initializeApp({
        credential: cert(parseServiceAccount()),
        storageBucket: getConfiguredStorageBucketName(),
      });
  }
  return adminApp;
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}

export function getAdminStorageBucket() {
  const bucketName = getConfiguredStorageBucketName();
  if (!bucketName) {
    throw new Error(
      "Missing FIREBASE_STORAGE_BUCKET or NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    );
  }
  return getStorage(getAdminApp()).bucket(bucketName);
}
