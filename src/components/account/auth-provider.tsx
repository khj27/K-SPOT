"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { UserIdentity } from "@/lib/firebase/user-session";
import { setTravelIdentity } from "@/lib/travel-storage";

const AuthContext = createContext<{ user: UserIdentity | null; updateUser: (user: UserIdentity | null) => void; logout: () => Promise<void> } | null>(null);
export function AuthProvider({ initialUser, children }: { initialUser: UserIdentity | null; children: ReactNode }) {
  const [user, setUser] = useState(initialUser);
  const router = useRouter();
  function updateUser(next: UserIdentity | null) { setUser(next); setTravelIdentity(next?.uid ?? "guest"); }
  async function logout() {
    const response = await fetch("/api/account/session", { method: "DELETE" });
    if (!response.ok) throw new Error("로그아웃하지 못했습니다.");
    updateUser(null); router.refresh();
  }
  return <AuthContext.Provider value={{ user, updateUser, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("AuthProvider missing");
  return value;
}
