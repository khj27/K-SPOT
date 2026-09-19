"use client";
import Link from "next/link";
import { useState } from "react";
import type { UserIdentity } from "@/lib/firebase/user-session";
import { createTravelBackup, parseTravelBackup, restoreTravelBackup, SAVED_SPOTS_KEY, SAVED_ITINERARIES_KEY, type TravelBackup } from "@/lib/travel-storage";

type Cloud = { revision: number; backup: TravelBackup | null };
export function AccountPanel({ user }: { user: UserIdentity | null }) {
  const [cloud, setCloud] = useState<Cloud | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  if (!user) return <section className="travel-backup account-panel"><h2>내 계정으로 여행 보관하기</h2><p>이메일로 가입하면 계정별로 여행 자료를 보관할 수 있습니다. 현재 비회원 자료는 이 브라우저에 남아 있으며 로그인 후 직접 가져올 수 있습니다.</p><Link className="kspot-primary-button" href="/login">로그인 / 회원가입</Link></section>;

  async function checkCloud() {
    setBusy(true); setMessage(""); setCloud(null);
    try {
      const response = await fetch("/api/account/travel", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      if (data.uid !== user!.uid) throw new Error("다른 탭에서 계정이 바뀌었습니다. 페이지를 새로고침해 주세요.");
      setCloud({ revision: data.revision, backup: data.backup ? parseTravelBackup(JSON.stringify(data.backup)) : null });
      setMessage("계정 자료를 확인했습니다. 기기로 가져오거나 현재 자료와 합쳐 저장할 수 있습니다.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "조회하지 못했습니다."); }
    finally { setBusy(false); }
  }
  async function upload() {
    if (!cloud) return;
    setBusy(true); setMessage("");
    try {
      const local = createTravelBackup();
      const localIds = new Set(local.itineraries.map((trip) => trip.id));
      const merged = parseTravelBackup(JSON.stringify({ ...local, spots: [...new Set([...(cloud.backup?.spots ?? []), ...local.spots])], itineraries: [...local.itineraries, ...(cloud.backup?.itineraries ?? []).filter((trip) => !localIds.has(trip.id))] }));
      const response = await fetch("/api/account/travel", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ uid: user!.uid, revision: cloud.revision, backup: merged }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setCloud({ revision: data.revision, backup: merged });
      setMessage("계정에 저장했습니다. 다른 기기에서 로그인 후 계정 자료 확인 → 이 기기로 가져오기를 누르세요.");
    } catch (error) { setCloud(null); setMessage(error instanceof Error ? error.message : "저장하지 못했습니다."); }
    finally { setBusy(false); }
  }
  function importBackup(backup: TravelBackup) {
    const result = restoreTravelBackup(backup);
    setMessage(`이 계정의 브라우저 저장 공간에 장소 ${result.spots}개, 일정 ${result.itineraries}개를 추가했습니다. 계정 저장은 별도로 눌러 주세요.`);
  }
  function importGuest() {
    try {
      importBackup(parseTravelBackup(JSON.stringify({ format: "kspot-travel", version: 1, exportedAt: new Date().toISOString(), spots: JSON.parse(window.localStorage.getItem(SAVED_SPOTS_KEY) ?? "[]"), itineraries: JSON.parse(window.localStorage.getItem(SAVED_ITINERARIES_KEY) ?? "[]") })));
    } catch (error) { setMessage(error instanceof Error ? error.message : "자료를 가져오지 못했습니다."); }
  }
  async function logout() {
    setBusy(true);
    try {
      const response = await fetch("/api/account/session", { method: "DELETE" });
      if (!response.ok) throw new Error();
      // Reset the document's account scope before rendering guest travel data.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/mypage");
    } catch { setMessage("로그아웃에 실패했습니다. 다시 시도해 주세요."); setBusy(false); }
  }
  return <section className="travel-backup account-panel"><h2>{user.name || "회원"}님의 계정</h2><p>{user.email}</p><p>일반 사용자 계정입니다. 관리자 기능은 별도 권한이 필요합니다.</p><div className="admin-csv-actions"><button type="button" disabled={busy} onClick={logout}>로그아웃</button><button type="button" disabled={busy} onClick={importGuest}>이 브라우저의 비회원 자료 가져오기</button></div><h3>계정에 여행 자료 보관</h3><p>자동 동기화가 아닙니다. 저장 장소와 일정은 현재 기기에 보관되며, 아래 버튼으로 계정에 올리거나 다른 기기에서 가져옵니다.</p><button type="button" className="kspot-primary-button" disabled={busy} onClick={checkCloud}>계정 자료 확인</button>
    {cloud && <><p>계정 보관: 장소 {cloud.backup?.spots.length ?? 0}개 · 일정 {cloud.backup?.itineraries.length ?? 0}개</p><div className="admin-csv-actions"><button type="button" disabled={busy || !cloud.backup} onClick={() => { try { importBackup(cloud.backup!); } catch (error) { setMessage(error instanceof Error ? error.message : "가져오지 못했습니다."); } }}>이 기기로 가져오기</button><button type="button" className="kspot-primary-button" disabled={busy} onClick={upload}>현재 자료와 합쳐 계정 저장</button></div><p>계정 저장 시 같은 ID의 일정은 현재 기기 내용으로 갱신합니다. 가져올 때는 현재 기기 내용을 유지합니다. 한 기기의 삭제는 다른 기기나 계정 자료에 자동 반영되지 않습니다.</p></>}
    <p role="status" aria-live="polite">{busy ? "처리 중…" : message}</p></section>;
}
