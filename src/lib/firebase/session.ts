import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getFirebaseAdminAuth, isFirebaseAdminConfigured } from "@/lib/firebase/admin";

export const ADMIN_SESSION_COOKIE = "kspot_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 5;

export type AdminIdentity = { uid: string; email: string };

export function getAllowedAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
}

export function isAllowedAdminEmail(email: string | undefined) {
  return Boolean(email && getAllowedAdminEmails().includes(email.toLowerCase()));
}

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  if (!isFirebaseAdminConfigured()) return null;
  const sessionCookie = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;
  try {
    const decoded = await getFirebaseAdminAuth().verifySessionCookie(sessionCookie, true);
    if (!isAllowedAdminEmail(decoded.email)) return null;
    return { uid: decoded.uid, email: decoded.email! };
  } catch {
    return null;
  }
}

export async function requireAdminPage() {
  const identity = await getAdminIdentity();
  if (!identity) redirect("/admin/login");
  return identity;
}
