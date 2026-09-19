"use client";

import { useState } from "react";
import type { ExploreContent } from "@/types/content";
import type { NearbyTourismResponse, TourApiPlace } from "@/types/tour-api";
import type { SavedTourStop } from "@/lib/travel-data";

export function ItineraryTourStops({ place, stops, busy, onChange }: {
  place: ExploreContent;
  stops: SavedTourStop[];
  busy: boolean;
  onChange: (next: SavedTourStop[]) => Promise<void>;
}) {
  const [items, setItems] = useState<TourApiPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [searched, setSearched] = useState(false);
  const selected = stops.filter((stop) => stop.anchorId === place.id);

  async function search() {
    setLoading(true); setMessage("");
    try {
      const query = new URLSearchParams({ latitude: String(place.coordinates.latitude), longitude: String(place.coordinates.longitude), radius: "5000" });
      const response = await fetch(`/api/nearby?${query}`, { signal: AbortSignal.timeout(12_000) });
      if (!response.ok) throw new Error();
      const result: NearbyTourismResponse = await response.json();
      if (result.source !== "tour-api") throw new Error();
      setItems(result.items); setSearched(true);
      if (!result.items.length) setMessage("주변 5km에서 조회된 관광지가 없습니다.");
    } catch { setMessage("관광정보를 불러오지 못했습니다. 잠시 후 다시 조회해 주세요. 저장한 일정은 그대로 유지됩니다."); }
    finally { setLoading(false); }
  }

  return <section className="itinerary-tour-stops" aria-label={`${place.spotName} 주변 관광지`}>
    <h3>촬영지 다음에 들를 곳</h3>
    <p>한국관광공사 관광정보 · 촬영지와 별개의 주변 방문 장소입니다.</p>
    {selected.length > 0 && <ol className="tour-stop-list">{selected.map((stop) => <li key={stop.contentId}>
      <div><span className="tour-stop-badge">일정에 담은 관광지</span><strong>{stop.title}</strong><span>{stop.address || "주소 정보 없음"}</span></div>
      <button type="button" disabled={busy} onClick={() => void onChange(stops.filter((item) => item.contentId !== stop.contentId))} aria-label={`${stop.title} 일정에서 제외`}>제외</button>
    </li>)}</ol>}
    <button type="button" className="tour-search-button" disabled={loading || busy} onClick={() => void search()}>{loading ? "주변 관광지 조회 중…" : searched ? "주변 관광지 다시 조회" : "주변 5km 관광지 찾아 담기"}</button>
    <p role="status">{message}</p>
    {items.length > 0 && <ul className="tour-stop-list tour-stop-candidates">{items.map((item) => {
      const added = stops.some((stop) => stop.contentId === item.contentId);
      return <li key={item.contentId}><div><strong>{item.title}</strong><span>{item.address || "주소 정보 없음"}</span>{item.distanceMeters !== undefined && <small>촬영지 기준 약 {(item.distanceMeters / 1000).toFixed(1)}km · 이동 경로 거리와 다를 수 있음</small>}</div><button type="button" disabled={busy || added || stops.length >= 10} onClick={() => void onChange([...stops, { contentId: item.contentId, anchorId: place.id, title: item.title, address: item.address, latitude: item.latitude, longitude: item.longitude, source: "tour-api" }])} aria-label={`${item.title} 일정에 추가`}>{added ? "담김" : "일정에 추가"}</button></li>;
    })}</ul>}
    {(items.length > 0 || selected.length > 0) && <p>관광지는 일정당 최대 10곳까지 담을 수 있습니다. 촬영지를 삭제하면 연결된 관광지도 일정에서 제외됩니다. 영업시간과 실제 이동 동선은 방문 전에 확인해 주세요.</p>}
  </section>;
}
