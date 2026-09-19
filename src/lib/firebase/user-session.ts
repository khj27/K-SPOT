import "server-only";
import { cookies } from "next/headers";
import { getFirebaseAdminAuth, isFirebaseAdminConfigured } from "@/lib/firebase/admin";

export const USER_COOKIE = "kspot_user_session";
export const USER_MAX_AGE = 60 * 60 * 24 * 5;
export type UserIdentity = { uid: string; email: string; name: string };
export async function getUserIdentity(): Promise<UserIdentity | null> {
  if (!isFirebaseAdminConfigured()) return null;
  const token = (await cookies()).get(USER_COOKIE)?.value;
  if (!token) return null;
  try {
    const user = await getFirebaseAdminAuth().verifySessionCookie(token, true);
    return { uid: user.uid, email: user.email ?? "", name: typeof user.name === "string" ? user.name : "" };
  } catch { return null; }
}
