"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { UserIdentity } from "@/lib/firebase/user-session";
import { parseTravelBackup, restoreTravelBackup } from "@/lib/travel-storage";

export function AccountPanel({ user, children }: { user: UserIdentity | null; children?: ReactNode }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  if (!user) return <section className="travel-backup account-panel"><h2>로그인하고 여행 저장하기</h2><p>마음에 드는 장소와 일정을 저장하고 다른 기기에서도 이어서 여행을 준비하세요.</p><Link className="kspot-primary-button" href="/login">로그인 / 회원가입</Link></section>;
  async function importLegacy(guest: boolean) {
    setBusy(true); setMessage("");
    try {
      const suffix = guest ? "" : `:user:${user!.uid}`;
      // Read-only migration of old data. Never write or delete browser storage.
      const backup = parseTravelBackup(JSON.stringify({ format: "kspot-travel", version: 1, exportedAt: new Date().toISOString(), spots: JSON.parse(window.localStorage.getItem(`kspot:saved-spots${suffix}`) ?? "[]"), itineraries: JSON.parse(window.localStorage.getItem(`kspot:saved-itineraries${suffix}`) ?? "[]") }));
      await restoreTravelBackup(backup);
      setMessage("이전 자료를 계정에 가져왔습니다. 기존 저장 자료와 브라우저 원본은 그대로 유지됩니다.");
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
  return <div className="account-layout">
    <section className="account-profile"><div className="account-avatar" aria-hidden="true">{(user.name || "회원").slice(0, 1)}</div><div><p className="kspot-eyebrow">MY ACCOUNT</p><h2>{user.name || "회원"}님의 계정</h2><p className="account-email">{user.email}</p><p className="account-note">찜·일정·최근 본 장소는 계정에 자동 저장됩니다. 다른 기기에서도 같은 계정으로 이어서 확인하세요.</p></div></section>
    {children}
    <details className="account-migration"><summary>이전에 브라우저에 저장했던 자료 가져오기</summary><p>이 기기에 남아 있는 이전 자료를 현재 계정으로 가져옵니다. 본인의 자료인지 확인해 주세요.</p><div className="ui-actions"><button className="ui-button" type="button" disabled={busy} onClick={() => void importLegacy(false)}>이 계정의 이전 자료 가져오기</button><button className="ui-button" type="button" disabled={busy} onClick={() => void importLegacy(true)}>이전 비회원 자료 가져오기</button></div></details>
    <footer className="account-footer"><p className="form-feedback" role="status">{busy ? "처리 중…" : message}</p><button className="kspot-primary-button" type="button" disabled={busy} onClick={logout}>로그아웃</button></footer>
  </div>;
}
