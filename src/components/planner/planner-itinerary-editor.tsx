"use client";

import Link from "next/link";
import { useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import type { ExploreContent } from "@/types/content";

export const SAVED_ITINERARIES_KEY = "kspot:saved-itineraries";

type PlannerItineraryEditorProps = {
  places: ExploreContent[];
  days: number;
  region: string;
  transport: string;
  companion: string;
  types: string[];
};

export function PlannerItineraryEditor({ places, days, region, transport, companion, types }: PlannerItineraryEditorProps) {
  const [itinerary, setItinerary] = useState(() => places.slice(0, days));
  const [saved, setSaved] = useState(false);

  function removePlace(id: string) {
    setItinerary((current) => current.filter((place) => place.id !== id));
  }

  function movePlace(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= itinerary.length) return;
    setItinerary((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function saveItinerary() {
    const value = {
      id: `itinerary-${Date.now()}`,
      savedAt: new Date().toISOString(),
      days,
      region,
      transport,
      companion,
      types,
      placeIds: itinerary.map((place) => place.id),
    };
    const existing = readSavedItineraries();
    window.localStorage.setItem(SAVED_ITINERARIES_KEY, JSON.stringify([value, ...existing]));
    window.dispatchEvent(new Event("kspot:saved-itineraries-change"));
    setSaved(true);
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
        <span>{itinerary.length}개 장소 · 순서를 조정하거나 제외할 수 있어요.</span>
        <button className={saved ? "planner-save-button is-saved" : "planner-save-button"} onClick={saveItinerary} type="button"><AppIcon name="bookmark" size={16} /> {saved ? "일정 저장됨" : "일정 저장"}</button>
      </div>
      <div className="planner-itinerary">
        {itinerary.map((place, index) => (
          <article className="planner-day-card" key={place.id}>
            <div className="planner-day-label"><strong>DAY {index + 1}</strong><span>{index === 0 ? "여행 시작" : index === itinerary.length - 1 ? "여행 마무리" : "로컬 탐방"}</span></div>
            <div className="planner-stop"><div className={`planner-stop-visual visual-${place.visual}`}>{place.title.slice(0, 1)}</div><div className="planner-stop-content"><p><AppIcon name="pin" size={14} /> {place.region} · {place.type}</p><h2>{place.spotName}</h2><span>{place.title} · {place.episode}</span><Link href={`/spots/${place.id}`}>장소 상세 <AppIcon name="arrow" size={14} /></Link></div></div>
            <div className="planner-time-note"><span>추천 체류</span><strong>{index % 2 === 0 ? "2시간" : "1시간 30분"}</strong><span>다음 장소까지 이동을 고려한 예시 일정입니다.</span></div>
            <div className="planner-day-actions"><button onClick={() => movePlace(index, -1)} disabled={index === 0} type="button" aria-label="앞으로 이동">↑</button><button onClick={() => movePlace(index, 1)} disabled={index === itinerary.length - 1} type="button" aria-label="뒤로 이동">↓</button><button onClick={() => removePlace(place.id)} type="button" aria-label={`${place.spotName} 일정에서 삭제`}>삭제</button></div>
          </article>
        ))}
      </div>
    </>
  );
}

export type SavedItinerary = {
  id: string;
  savedAt: string;
  days: number;
  region: string;
  transport: string;
  companion: string;
  types: string[];
  placeIds: string[];
};

export function readSavedItineraries(): SavedItinerary[] {
  try {
    const value = window.localStorage.getItem(SAVED_ITINERARIES_KEY);
    const parsed: unknown = value ? JSON.parse(value) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedItinerary);
  } catch {
    return [];
  }
}

function isSavedItinerary(value: unknown): value is SavedItinerary {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "string" && typeof item.savedAt === "string" && typeof item.days === "number" && typeof item.region === "string" && typeof item.transport === "string" && typeof item.companion === "string" && Array.isArray(item.types) && item.types.every((type) => typeof type === "string") && Array.isArray(item.placeIds) && item.placeIds.every((id) => typeof id === "string");
}
