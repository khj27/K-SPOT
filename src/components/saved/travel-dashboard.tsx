"use client";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import type { ExploreContent } from "@/types/content";
import type { RecentView } from "@/lib/travel-mutations";
import { getEmptySnapshot, getItinerariesSnapshot, getSavedSpotsSnapshot, getRecentViewsSnapshot, parseItineraries, parseSavedSpotIds, subscribeToTravel, clearRecentViews } from "@/lib/travel-storage";

export function TravelDashboard({ contents }: { contents: ExploreContent[] }) {
  const spots = parseSavedSpotIds(useSyncExternalStore(subscribeToTravel, getSavedSpotsSnapshot, getEmptySnapshot));
  const trips = parseItineraries(useSyncExternalStore(subscribeToTravel, getItinerariesSnapshot, getEmptySnapshot));
  const recent = JSON.parse(useSyncExternalStore(subscribeToTravel, getRecentViewsSnapshot, getEmptySnapshot)) as RecentView[];
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function clear() {
    setBusy(true);
    try { await clearRecentViews(); setMessage("최근 본 장소 기록을 삭제했습니다."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "삭제하지 못했습니다."); }
    finally { setBusy(false); }
  }
  return <div className="travel-dashboard"><section className="travel-stats" aria-label="나의 저장 현황"><Link href="/saved"><span>저장한 장소</span><strong>{spots.length}개</strong></Link><Link href="/saved"><span>저장한 일정</span><strong>{trips.length}개</strong></Link></section><div className="admin-csv-actions"><Link className="kspot-primary-button" href="/saved">저장한 여행 보기</Link><Link href="/planner">새 일정 만들기</Link></div><section className="travel-backup"><h2>최근 본 장소</h2><p>로그인 상태에서 열어 본 장소를 최대 50개까지 Firebase에 보관합니다.</p>{recent.length ? <><ul>{recent.map((view) => { const content = contents.find((item) => item.id === view.spotId); return <li key={view.spotId}>{content ? <Link href={`/spots/${encodeURIComponent(view.spotId)}`}>{content.spotName} · {content.title}</Link> : <span>현재 조회할 수 없는 장소</span>}</li>; })}</ul><button type="button" disabled={busy} onClick={clear}>최근 본 장소 기록 지우기</button></> : <p>아직 조회 기록이 없습니다.</p>}<p role="status">{message}</p></section><p className="saved-data-notice">브라우저에 여행 자료를 영구 저장하지 않습니다. 인터넷 연결이 필요하며 저장 실패 시 화면에 안내합니다.</p></div>;
}
