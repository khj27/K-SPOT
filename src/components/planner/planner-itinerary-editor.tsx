"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import type { RankedPlace } from "@/lib/recommendation";

import { storeItinerary } from "@/lib/travel-storage";
import type { SavedTourStop } from "@/lib/travel-data";
import { ItineraryTourStops } from "@/components/planner/itinerary-tour-stops";

type PlannerItineraryEditorProps = {
  recommendations: RankedPlace[];
  days: number;
  region: string;
  transport: string;
  companion: string;
  types: string[];
  savedId?: string;
  initialTourStops?: SavedTourStop[];
};

export function PlannerItineraryEditor({ recommendations, days, region, transport, companion, types, savedId, initialTourStops = [] }: PlannerItineraryEditorProps) {
  const [itinerary, setItinerary] = useState(() => recommendations.slice(0, days));
  const [tourStops, setTourStops] = useState(initialTourStops);
  const [saved, setSaved] = useState(Boolean(savedId));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const itineraryId = useRef(savedId);
  const persisted = useRef(Boolean(savedId));

  async function removePlace(id: string) {
    await saveItinerary(itinerary.filter(({ place }) => place.id !== id));
  }

  async function movePlace(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= itinerary.length) return;
    const next = [...itinerary];
    [next[index], next[target]] = [next[target], next[index]];
    await saveItinerary(next);
  }

  async function saveItinerary(next = itinerary, nextStops = tourStops) {
    if (busy) return;
    setBusy(true); setError("");
    itineraryId.current ??= `itinerary-${crypto.randomUUID()}`;
    const value = {
      id: itineraryId.current,
      savedAt: new Date().toISOString(),
      days,
      region,
      transport,
      companion,
      types,
      placeIds: next.map(({ place }) => place.id),
      tourStops: nextStops.filter((stop) => next.some(({ place }) => place.id === stop.anchorId)),
    };
    try {
      await storeItinerary(value, persisted.current);
      persisted.current = true;
      setItinerary(next);
      setTourStops(value.tourStops);
      setSaved(true); setError("");
    } catch (error) { setError(error instanceof Error ? error.message : "일정 저장에 실패했습니다."); }
    finally { setBusy(false); }
  }

  if (itinerary.length === 0) {
    return (
      <div className="planner-no-result">
        <h2>일정에 남은 장소가 없습니다.</h2>
        <p>장소를 다시 추천받거나 조건을 바꿔보세요.</p>
        <Link className="button button-secondary" href="/planner">조건 변경하기</Link>
      </div>
    );
  }

  return (
    <>
      <div className="planner-edit-toolbar">
        <span>촬영지 {itinerary.length}곳 · 관광지 {tourStops.length}곳 · 순서를 조정하거나 제외할 수 있어요.</span>
        <button className={saved ? "planner-save-button is-saved" : "planner-save-button"} onClick={() => void saveItinerary()} disabled={saved || busy} type="button"><AppIcon name="bookmark" size={16} /> {busy ? "Firebase 저장 중…" : saved ? "일정 저장됨" : "Firebase에 일정 저장"}</button>
      </div>
      <p role="status">{error || (saved ? "Firebase에 일정을 저장했습니다." : "로그인 후 저장할 수 있으며 순서 변경·삭제도 바로 Firebase에 반영됩니다.")}</p>
      {itinerary.length < days && <p>선택한 {days}일 중 {itinerary.length}일에만 장소가 있습니다. 나머지 날짜는 자유 일정입니다.</p>}
      <div className="planner-itinerary">
        {itinerary.map(({ place, score, reasons }, index) => (
          <article className="planner-day-card" key={place.id}>
            <div className="planner-day-label"><strong>DAY {index + 1}</strong><span>{index === 0 ? "여행 시작" : index === itinerary.length - 1 ? "여행 마무리" : "로컬 탐방"}</span></div>
            <div className="planner-stop"><div className={`planner-stop-visual visual-${place.visual}`}>{place.title.slice(0, 1)}</div><div className="planner-stop-content"><p><AppIcon name="pin" size={14} /> {place.region} · {place.type}</p><h2>{place.spotName}</h2><span>{place.title} · {place.episode}</span><div className="recommendation-reasons" aria-label={`추천 점수 ${score}점`}>{reasons.map((reason) => <small key={reason}>{reason}</small>)}</div><Link href={`/spots/${place.id}`}>장소 상세 <AppIcon name="arrow" size={14} /></Link></div></div>
            <div className="planner-time-note"><span>예시 체류</span><strong>{index % 2 === 0 ? "2시간" : "1시간 30분"}</strong><span>실제 이동시간과 영업시간은 반영하지 않은 예시입니다.</span></div>
            <ItineraryTourStops place={place} stops={tourStops} busy={busy} onChange={(next) => saveItinerary(itinerary, next)} />
            <div className="planner-day-actions"><button onClick={() => void movePlace(index, -1)} disabled={busy || index === 0} type="button" aria-label="앞으로 이동">↑</button><button onClick={() => void movePlace(index, 1)} disabled={busy || index === itinerary.length - 1} type="button" aria-label="뒤로 이동">↓</button><button onClick={() => void removePlace(place.id)} disabled={busy} type="button" aria-label={`${place.spotName} 일정에서 삭제`}>삭제</button></div>
          </article>
        ))}
      </div>
    </>
  );
}
