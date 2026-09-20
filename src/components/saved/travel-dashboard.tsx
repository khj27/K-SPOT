"use client";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import type { ExploreContent } from "@/types/content";
import type { RecentView } from "@/lib/travel-mutations";
import { getEmptySnapshot, getItinerariesSnapshot, getSavedSpotsSnapshot, getRecentViewsSnapshot, parseItineraries, parseSavedSpotIds, subscribeToTravel, removeRecentViews } from "@/lib/travel-storage";

export function TravelDashboard({ contents }: { contents: ExploreContent[] }) {
  const spots = parseSavedSpotIds(useSyncExternalStore(subscribeToTravel, getSavedSpotsSnapshot, getEmptySnapshot));
  const trips = parseItineraries(useSyncExternalStore(subscribeToTravel, getItinerariesSnapshot, getEmptySnapshot));
  const recent = JSON.parse(useSyncExternalStore(subscribeToTravel, getRecentViewsSnapshot, getEmptySnapshot)) as RecentView[];
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const selectedIds = selected.filter((id) => recent.some((view) => view.spotId === id));
  async function clear() {
    if (!selectedIds.length || busy) return;
    setBusy(true);
    setMessage("");
    try { await removeRecentViews(selectedIds); setSelected([]); setMessage("선택한 최근 본 장소 기록을 삭제했습니다."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "삭제하지 못했습니다."); }
    finally { setBusy(false); }
  }
  return <div className="travel-dashboard">
    <section className="travel-stats" aria-label="나의 저장 현황"><Link href="/saved"><span>저장한 장소</span><strong>{spots.length}개</strong></Link><Link href="/saved"><span>저장한 일정</span><strong>{trips.length}개</strong></Link></section>
    <div className="ui-actions"><Link className="kspot-primary-button" href="/saved">저장한 여행 보기</Link><Link className="ui-button" href="/planner">새 일정 만들기</Link></div>
    <section className="travel-backup"><h2>최근 본 장소</h2><p>최근 둘러본 장소를 다시 찾아보세요. 지울 기록을 선택할 수 있습니다.</p>
      {recent.length ? <>
        <div className="recent-selection-bar"><label><input type="checkbox" disabled={busy} checked={selectedIds.length === recent.length} onChange={(event) => setSelected(event.target.checked ? recent.map((view) => view.spotId) : [])} />전체 선택</label><span>{selectedIds.length}개 선택</span><button className="ui-button" type="button" disabled={busy || !selectedIds.length} onClick={clear}>{busy ? "지우는 중…" : "선택 지우기"}</button></div>
        <ul className="recent-place-list">{recent.map((view) => {
          const content = contents.find((item) => item.id === view.spotId);
          return <li className="recent-selectable-place" key={view.spotId}><input type="checkbox" aria-label={`${content?.spotName ?? "현재 조회할 수 없는 장소"} 기록 선택`} disabled={busy} checked={selectedIds.includes(view.spotId)} onChange={(event) => setSelected((ids) => event.target.checked ? [...new Set([...ids, view.spotId])] : ids.filter((id) => id !== view.spotId))} />{content ? <Link href={`/spots/${encodeURIComponent(view.spotId)}`}>{content.spotName} · {content.title}</Link> : <span>현재 조회할 수 없는 장소</span>}</li>;
        })}</ul>
      </> : <p>아직 조회 기록이 없습니다.</p>}<p role="status">{message}</p>
    </section></div>;
}
