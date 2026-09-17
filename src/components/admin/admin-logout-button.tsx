"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

import { getFirebaseClientAuth, isFirebaseClientConfigured } from "@/lib/firebase/client";

export function AdminLogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    if (isFirebaseClientConfigured()) await signOut(getFirebaseClientAuth()).catch(() => undefined);
    router.replace("/admin/login");
    router.refresh();
  }
  return <button className="admin-logout" onClick={logout} type="button">로그아웃</button>;
}
