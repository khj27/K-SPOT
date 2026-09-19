"use client";
import Link from "next/link";
import { useState } from "react";
import type { UserIdentity } from "@/lib/firebase/user-session";
import { parseTravelBackup, restoreTravelBackup } from "@/lib/travel-storage";

export function AccountPanel({ user }: { user: UserIdentity | null }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  if (!user) return <section className="travel-backup account-panel"><h2>로그인하고 여행 저장하기</h2><p>찜·여행 일정·최근 본 장소는 로그인한 계정의 Firebase에 저장됩니다. 비회원 자료는 새로 저장하지 않습니다.</p><Link className="kspot-primary-button" href="/login">로그인 / 회원가입</Link></section>;
  async function importLegacy(guest: boolean) {
    setBusy(true); setMessage("");
    try {
      const suffix = guest ? "" : `:user:${user!.uid}`;
      // Read-only migration of old data. Never write or delete browser storage.
      const backup = parseTravelBackup(JSON.stringify({ format: "kspot-travel", version: 1, exportedAt: new Date().toISOString(), spots: JSON.parse(window.localStorage.getItem(`kspot:saved-spots${suffix}`) ?? "[]"), itineraries: JSON.parse(window.localStorage.getItem(`kspot:saved-itineraries${suffix}`) ?? "[]") }));
      await restoreTravelBackup(backup);
      setMessage("이전 자료를 Firebase에 병합했습니다. 중복 자료는 유지하며 브라우저의 과거 원본은 변경하지 않았습니다.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "이전하지 못했습니다."); }
    finally { setBusy(false); }
  }
  async function logout() {
    setBusy(true);
    try {
      const response = await fetch("/api/account/session", { method: "DELETE" });
      if (!response.ok) throw new Error();
      // Discard the in-memory account cache on logout.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/mypage");
    } catch { setMessage("로그아웃하지 못했습니다."); setBusy(false); }
  }
  return <section className="travel-backup account-panel"><h2>{user.name || "회원"}님의 계정</h2><p>{user.email}</p><p>찜과 일정, 최근 본 장소가 Firebase에 직접 저장됩니다. 다른 기기에서도 같은 계정으로 로그인하면 자동으로 불러옵니다. 화면 재진입·탭 복귀 및 최대 30초 간격으로 변경사항을 확인합니다.</p><button type="button" disabled={busy} onClick={logout}>로그아웃</button><details><summary>이전에 브라우저에 저장했던 자료 이전</summary><p>이번 변경 전 로컬 자료가 있는 경우 한 번만 가져오세요. 다른 사람의 비회원 자료가 아닌지 확인해 주세요.</p><div className="admin-csv-actions"><button type="button" disabled={busy} onClick={() => void importLegacy(false)}>이 계정의 이전 로컬 자료 이전</button><button type="button" disabled={busy} onClick={() => void importLegacy(true)}>이전 비회원 자료 이전</button></div></details><p role="status">{busy ? "처리 중…" : message}</p></section>;
}
