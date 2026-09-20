"use client";
import { LocaleText } from "@/components/common/locale-provider";


import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

import { rankPlaces } from "@/lib/recommendation";
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
      <div className="saved-subheading"><div><p className="spot-card-eyebrow">MY TRIPS</p><h2><LocaleText>{"저장한 여행 일정"}</LocaleText></h2></div><span>{itineraries.length}<LocaleText>{"개"}</LocaleText></span></div>
      <div className="saved-itinerary-grid">{itineraries.map((itinerary) => {
        const places = resolve(itinerary.placeIds);
        return <article className="saved-itinerary-card" key={itinerary.id}><div><strong><LocaleText>{itinerary.region}</LocaleText> <LocaleText>{itinerary.days === 1 ? "당일" : `${itinerary.days - 1}박 ${itinerary.days}일`}</LocaleText><LocaleText>{" 코스"}</LocaleText></strong><span>{itinerary.startDate ? `${itinerary.startDate} ~ ${itinerary.endDate} · ` : ""}<LocaleText>{itinerary.transport}</LocaleText> · <LocaleText>{itinerary.companion}</LocaleText><LocaleText>{" · 촬영지 "}</LocaleText>{itinerary.placeIds.length}<LocaleText>{"곳 · 관광지 "}</LocaleText>{itinerary.tourStops?.length ?? 0}<LocaleText>{"곳"}</LocaleText></span></div><div className="saved-itinerary-places">{places.slice(0, 3).map((place) => <Link href={`/spots/${place.id}`} key={place.id}>{place.spotName}</Link>)}</div>{places.length < itinerary.placeIds.length && <p><LocaleText>{"현재 조회할 수 없는 장소 "}</LocaleText>{itinerary.placeIds.length - places.length}<LocaleText>{"개"}</LocaleText></p>}{(itinerary.tourStops?.length ?? 0) > 0 && <p><LocaleText>{"주변 관광: "}</LocaleText>{itinerary.tourStops!.map((stop) => stop.title).join(" · ")}</p>}<button className="ui-button" onClick={() => setSelectedId(itinerary.id)} type="button"><LocaleText>{"일정 열기·수정"}</LocaleText></button><button className="ui-button ui-button-danger" onClick={() => removeItinerary(itinerary.id)} type="button"><AppIcon name="bookmark" size={15} /><LocaleText>{" 삭제"}</LocaleText></button></article>;
      })}</div>
      <p role="status"><LocaleText>{error}</LocaleText></p>
      {selected && <section className="saved-itinerary-editor"><div className="saved-subheading"><h2><LocaleText>{"저장 일정 수정"}</LocaleText></h2><button className="ui-button" type="button" onClick={() => setSelectedId(null)}><LocaleText>{"닫기"}</LocaleText></button></div>{missingCount > 0 ? <p><LocaleText>{"현재 조회할 수 없는 장소 "}</LocaleText>{missingCount}<LocaleText>{"개가 있어 편집을 잠시 중단합니다. 장소가 다시 조회되면 기존 순서대로 수정할 수 있습니다. 저장된 일정은 그대로 보관됩니다."}</LocaleText></p> : <PlannerItineraryEditor key={`${selected.id}:${selected.savedAt}`} savedId={selected.id} startDate={selected.startDate} endDate={selected.endDate} initialPlaceDays={selected.placeDays ?? selectedPlaces.map((_, i) => Math.min(i, selected.days - 1))} candidates={rankPlaces({ places: contents, region: selected.region, selectedTypes: new Set(selected.types) })} initialTourStops={selected.tourStops} recommendations={selectedPlaces.map((place) => ({ place, score: 0, reasons: ["저장한 장소"] }))} days={selected.days} region={selected.region} transport={selected.transport} companion={selected.companion} types={selected.types} />}</section>}
    </section>
  );
}
