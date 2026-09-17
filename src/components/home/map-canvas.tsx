"use client";

import { useCallback, useRef, useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { KakaoMap, type KakaoMapHandle } from "@/components/map/kakao-map";
import { homeMapMarkers } from "@/mocks/home-data";
import type { MapCoordinate, MapPlace } from "@/types/map";

type MapCanvasProps = { appKey: string; places: MapPlace[]; selectedId?: string; loading: boolean; status: "loading" | "live" | "unavailable" | "empty"; statusMessage: string; onSelect(place: MapPlace): void; onSearch(center: MapCoordinate): void };

export function MapCanvas({ appKey, places, selectedId, loading, status, statusMessage, onSelect, onSearch }: MapCanvasProps) {
  const mapRef = useRef<KakaoMapHandle>(null);
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "missing-key" | "error">("loading");
  const handleMapStatus = useCallback((next: "loading" | "ready" | "missing-key" | "error") => setMapStatus(next), []);
  const hasLiveMap = mapStatus === "ready";

  return (
    <section className={`map-canvas ${hasLiveMap ? "has-live-map" : ""}`} aria-label="부산 지역 관광지 지도">
      <KakaoMap ref={mapRef} appKey={appKey} initialCenter={{ latitude: 35.1532, longitude: 129.1186 }} places={places} selectedId={selectedId} onReadyStateChange={handleMapStatus} onSelect={onSelect} />
      {!hasLiveMap && <div className="map-fallback-layer"><div className="map-grid-lines" /><span className="map-district district-one">부산진구</span><span className="map-district district-two">연제구</span><span className="map-district district-three">영도구</span>{homeMapMarkers.map((marker) => <div className={`map-marker marker-${marker.tone}`} style={{ left: `${marker.x}%`, top: `${marker.y}%` }} key={marker.id}><span>{marker.count ? <b>{marker.count}</b> : <AppIcon name="pin" size={18} />}</span><strong>{marker.label}</strong></div>)}</div>}
      <button className="map-current-search" disabled={loading} onClick={() => onSearch(mapRef.current?.getCenter() ?? { latitude: 35.1532, longitude: 129.1186 })} type="button">{loading ? "관광지 검색 중" : "현재 지도 내 검색"} <AppIcon name="search" size={17} /></button>
      <div className="map-controls" aria-label="지도 확대 축소"><button onClick={() => mapRef.current?.zoomIn()} type="button" aria-label="지도 확대">+</button><button onClick={() => mapRef.current?.zoomOut()} type="button" aria-label="지도 축소">−</button></div>
      <div className="map-legend"><strong>콘텐츠 유형</strong><span><i className="legend-purple" />드라마</span><span><i className="legend-blue" />예능</span><span><i className="legend-teal" />영화</span><span><i className="legend-rose" />뮤직비디오</span></div>
      <div className={`map-source-status status-${status}`} title={statusMessage}><strong>{status === "live" ? "TourAPI 실시간" : status === "loading" ? "데이터 조회 중" : "K-SPOT 데이터"}</strong><span>{statusMessage}</span></div>
      {mapStatus === "missing-key" && <p className="map-sdk-message">Kakao 지도 키를 설정하면 실제 지도가 표시됩니다.</p>}
      {mapStatus === "error" && <p className="map-sdk-message">지도를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>}
    </section>
  );
}
