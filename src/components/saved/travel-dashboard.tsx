"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { BACKUP_MAX_BYTES, createTravelBackup, getEmptySnapshot, getItinerariesSnapshot, getSavedSpotsSnapshot, parseItineraries, parseSavedSpotIds, parseTravelBackup, restoreTravelBackup, subscribeToItineraries, subscribeToSavedSpots, type TravelBackup } from "@/lib/travel-storage";

export function TravelDashboard() {
  const spots = parseSavedSpotIds(useSyncExternalStore(subscribeToSavedSpots, getSavedSpotsSnapshot, getEmptySnapshot));
  const trips = parseItineraries(useSyncExternalStore(subscribeToItineraries, getItinerariesSnapshot, getEmptySnapshot));
  const [preview, setPreview] = useState<TravelBackup | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function download() {
    try {
      const backup = createTravelBackup();
      const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }));
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = `kspot-travel-${new Date().toISOString().slice(0, 10)}.json`; anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("백업 파일 다운로드를 요청했습니다. 다른 기기의 마이페이지에서 이 파일을 선택해 주세요.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "백업하지 못했습니다."); }
  }

  async function choose(file?: File) {
    setPreview(null); setMessage("");
    if (!file) return;
    if (file.size > BACKUP_MAX_BYTES) { setMessage("2MB 이하의 K-SPOT JSON 백업 파일을 선택해 주세요."); return; }
    setBusy(true);
    try { setPreview(parseTravelBackup(await file.text())); }
    catch (error) { setMessage(error instanceof Error ? error.message : "파일을 읽지 못했습니다."); }
    finally { setBusy(false); }
  }

  function restore() {
    if (!preview) return;
    try {
      const result = restoreTravelBackup(preview);
      setMessage(`장소 ${result.spots}개, 일정 ${result.itineraries}개를 추가했습니다. 기존 데이터와 중복 항목은 그대로 유지했습니다.`);
      setPreview(null);
    } catch (error) { setMessage(error instanceof Error ? error.message : "복원하지 못했습니다."); }
  }

  return <div className="travel-dashboard">
    <section className="travel-stats" aria-label="나의 저장 현황"><Link href="/saved"><span>저장한 장소</span><strong>{spots.length}개</strong></Link><Link href="/saved"><span>저장한 일정</span><strong>{trips.length}개</strong></Link></section>
    <div className="admin-csv-actions"><Link className="kspot-primary-button" href="/saved">저장한 여행 보기</Link><Link href="/planner">새 일정 만들기</Link><Link href="/explore">콘텐츠 탐색</Link></div>
    <section className="travel-backup"><h2>다른 기기로 여행 옮기기</h2><p>여행 데이터는 현재 브라우저에만 저장됩니다. 백업 파일에는 저장 장소 ID와 일정 정보가 담기며, 관리자 계정·인증키·콘텐츠 원본은 포함되지 않습니다.</p><ol><li>현재 기기에서 백업 파일을 내려받습니다.</li><li>다른 기기로 파일을 옮긴 뒤 K-SPOT 마이페이지를 엽니다.</li><li>파일을 선택하고 내용을 확인한 다음 복원을 누릅니다.</li></ol><button className="kspot-primary-button" type="button" onClick={download}>여행 데이터 백업 다운로드</button>
      <label className="admin-csv-file">백업 파일 선택 (JSON · 최대 2MB)<input type="file" accept=".json,application/json" disabled={busy} onChange={(event) => void choose(event.target.files?.[0])} /></label>
      {preview && <div className="travel-restore-preview"><h3>복원할 데이터</h3><p>저장 장소 {preview.spots.length}개 · 일정 {preview.itineraries.length}개</p><p>백업 생성: {new Date(preview.exportedAt).toLocaleString("ko-KR")}</p><p>기존 데이터에 추가합니다. 동일한 ID의 장소·일정은 현재 기기의 값을 유지합니다. 공개 중단된 장소는 복원 후에도 조회되지 않을 수 있습니다.</p><button className="kspot-primary-button" type="button" onClick={restore}>기존 데이터에 추가 복원</button></div>}
      <p role="status" aria-live="polite">{busy ? "백업 파일 확인 중…" : message}</p>
    </section>
    <p className="saved-data-notice">자동 동기화는 지원하지 않습니다. 로그인 후 계정 자료 보관 기능 또는 JSON 백업을 이용해 주세요. 브라우저 데이터를 지우기 전에 저장 여부를 확인해 주세요.</p>
  </div>;
}
