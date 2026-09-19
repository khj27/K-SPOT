"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

import { AppIcon } from "@/components/common/app-icon";
import type { ExploreContent } from "@/types/content";
import { PlannerItineraryEditor } from "@/components/planner/planner-itinerary-editor";
import { subscribeToItineraries, getItinerariesSnapshot, getEmptySnapshot, parseItineraries, removeSavedItinerary } from "@/lib/travel-storage";

export function SavedItinerariesList({ contents }: { contents: ExploreContent[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const itinerariesSnapshot = useSyncExternalStore(subscribeToItineraries, getItinerariesSnapshot, getEmptySnapshot);
  const itineraries = parseItineraries(itinerariesSnapshot);
  const selected = itineraries.find((item) => item.id === selectedId);
  const resolve = (ids: string[]) => ids.map((id) => contents.find((content) => content.id === id)).filter((item): item is ExploreContent => !!item);
  const selectedPlaces = selected ? resolve(selected.placeIds) : [];
  const missingCount = selected ? selected.placeIds.length - selectedPlaces.length : 0;
  if (itineraries.length === 0) return null;

  async function removeItinerary(id: string) {
    try {
      await removeSavedItinerary(id); setError("");
      if (selectedId === id) setSelectedId(null);
    } catch (error) { setError(error instanceof Error ? error.message : "삭제에 실패했습니다."); }
  }

  return (
    <section className="saved-itineraries">
      <div className="saved-subheading"><div><p className="spot-card-eyebrow">MY TRIPS</p><h2>저장한 여행 일정</h2></div><span>{itineraries.length}개</span></div>
      <div className="saved-itinerary-grid">{itineraries.map((itinerary) => {
        const places = resolve(itinerary.placeIds);
        return <article className="saved-itinerary-card" key={itinerary.id}><div><strong>{itinerary.region} {itinerary.days === 1 ? "당일" : `${itinerary.days - 1}박 ${itinerary.days}일`} 코스</strong><span>{itinerary.transport} · {itinerary.companion} · {itinerary.placeIds.length}곳</span></div><div className="saved-itinerary-places">{places.slice(0, 3).map((place) => <Link href={`/spots/${place.id}`} key={place.id}>{place.spotName}</Link>)}</div>{places.length < itinerary.placeIds.length && <p>현재 조회할 수 없는 장소 {itinerary.placeIds.length - places.length}개</p>}<button onClick={() => setSelectedId(itinerary.id)} type="button">일정 열기·수정</button><button onClick={() => removeItinerary(itinerary.id)} type="button"><AppIcon name="bookmark" size={15} /> 삭제</button></article>;
      })}</div>
      <p role="status">{error}</p>
      {selected && <section className="saved-itinerary-editor"><div className="saved-subheading"><h2>저장 일정 수정</h2><button type="button" onClick={() => setSelectedId(null)}>닫기</button></div>{missingCount > 0 ? <p>현재 조회할 수 없는 장소 {missingCount}개가 있어 편집을 잠시 중단합니다. 장소가 다시 조회되면 기존 순서대로 수정할 수 있습니다. 저장된 일정은 그대로 보관됩니다.</p> : <PlannerItineraryEditor key={selected.id} savedId={selected.id} recommendations={selectedPlaces.map((place) => ({ place, score: 0, reasons: ["저장한 장소"] }))} days={selected.days} region={selected.region} transport={selected.transport} companion={selected.companion} types={selected.types} />}</section>}
    </section>
  );
}
