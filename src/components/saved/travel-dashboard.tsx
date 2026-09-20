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
  return <div className="travel-dashboard"><section className="travel-stats" aria-label="나의 저장 현황"><Link href="/saved"><span>저장한 장소</span><strong>{spots.length}개</strong></Link><Link href="/saved"><span>저장한 일정</span><strong>{trips.length}개</strong></Link></section><div className="ui-actions"><Link className="kspot-primary-button" href="/saved">저장한 여행 보기</Link><Link className="ui-button" href="/planner">새 일정 만들기</Link></div><section className="travel-backup"><h2>최근 본 장소</h2><p>최근 둘러본 장소를 다시 찾아보세요. 최대 50곳까지 보관합니다.</p>{recent.length ? <><ul className="recent-place-list">{recent.map((view) => { const content = contents.find((item) => item.id === view.spotId); return <li key={view.spotId}>{content ? <Link href={`/spots/${encodeURIComponent(view.spotId)}`}>{content.spotName} · {content.title}</Link> : <span>현재 조회할 수 없는 장소</span>}</li>; })}</ul><button className="ui-button" type="button" disabled={busy} onClick={clear}>최근 본 장소 기록 지우기</button></> : <p>아직 조회 기록이 없습니다.</p>}<p role="status">{message}</p></section></div>;
}
