"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { exploreContents } from "@/mocks/explore-data";
import { SAVED_ITINERARIES_KEY, type SavedItinerary } from "@/components/planner/planner-itinerary-editor";

export function SavedItinerariesList() {
  const itinerariesSnapshot = useSyncExternalStore(subscribeToItineraries, getItinerariesSnapshot, getItinerariesServerSnapshot);
  const itineraries = parseItineraries(itinerariesSnapshot);
  if (itineraries.length === 0) return null;

  function removeItinerary(id: string) {
    const next = itineraries.filter((item) => item.id !== id);
    window.localStorage.setItem(SAVED_ITINERARIES_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("kspot:saved-itineraries-change"));
  }

  return (
    <section className="saved-itineraries">
      <div className="saved-subheading"><div><p className="spot-card-eyebrow">MY TRIPS</p><h2>저장한 여행 일정</h2></div><span>{itineraries.length}개</span></div>
      <div className="saved-itinerary-grid">{itineraries.map((itinerary) => {
        const places = itinerary.placeIds.map((id) => exploreContents.find((content) => content.id === id)).filter((content): content is (typeof exploreContents)[number] => content !== undefined);
        return <article className="saved-itinerary-card" key={itinerary.id}><div><strong>{itinerary.region} {itinerary.days === 1 ? "당일" : `${itinerary.days - 1}박 ${itinerary.days}일`} 코스</strong><span>{itinerary.transport} · {itinerary.companion} · {places.length}곳</span></div><div className="saved-itinerary-places">{places.slice(0, 3).map((place) => <Link href={`/spots/${place.id}`} key={place.id}>{place.spotName}</Link>)}</div><button onClick={() => removeItinerary(itinerary.id)} type="button"><AppIcon name="bookmark" size={15} /> 삭제</button></article>;
      })}</div>
    </section>
  );
}

function subscribeToItineraries(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("kspot:saved-itineraries-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("kspot:saved-itineraries-change", onChange);
  };
}

function getItinerariesSnapshot(): string {
  return window.localStorage.getItem(SAVED_ITINERARIES_KEY) ?? "[]";
}

function getItinerariesServerSnapshot(): string {
  return "[]";
}

function parseItineraries(value: string): SavedItinerary[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter(isSavedItinerary) : [];
  } catch {
    return [];
  }
}

function isSavedItinerary(value: unknown): value is SavedItinerary {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "string"
    && typeof item.savedAt === "string"
    && typeof item.days === "number"
    && typeof item.region === "string"
    && typeof item.transport === "string"
    && typeof item.companion === "string"
    && Array.isArray(item.types)
    && item.types.every((type) => typeof type === "string")
    && Array.isArray(item.placeIds)
    && item.placeIds.every((id) => typeof id === "string");
}
