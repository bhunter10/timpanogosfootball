"use client";

import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { firebaseClientConfig, isFirebaseClientConfigured } from "./config";

let clientApp: FirebaseApp | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseClientConfigured()) {
    throw new Error("Firebase client environment variables are not set");
  }
  if (!clientApp) {
    clientApp = getApps()[0] ?? initializeApp(firebaseClientConfig);
  }
  return clientApp;
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}
