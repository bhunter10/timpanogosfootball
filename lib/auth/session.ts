import { cookies } from "next/headers";
import { getAdminAuth, isFirebaseAdminConfigured } from "@/lib/firebase/admin";

export const SESSION_COOKIE_NAME = "tf_session";

export async function verifyAdminSession(): Promise<{ uid: string } | null> {
  if (!isFirebaseAdminConfigured()) {
    return null;
  }
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!session) {
    return null;
  }
  try {
    const decoded = await getAdminAuth().verifySessionCookie(session, true);
    return { uid: decoded.uid };
  } catch {
    return null;
  }
}
