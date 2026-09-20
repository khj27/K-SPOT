"use client";
import { useTranslation } from "@/components/common/locale-provider";

import { LocaleText } from "@/components/common/locale-provider";


import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { KakaoMap } from "@/components/map/kakao-map";
import type { ExploreContent } from "@/types/content";
import { contentColors } from "@/lib/map-colors";
import { ContentThumbnail } from "@/components/common/content-thumbnail";
import type { MapPlace } from "@/types/map";

export function MapExplorer({ contents, appKey }: { contents: ExploreContent[]; appKey: string }) {
  const { t } = useTranslation();

  const [selectedId, setSelectedId] = useState<string>();
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "missing-key" | "error">("loading");
  const selected = contents.find((content) => content.id === selectedId);
  const mapPlaces = useMemo<MapPlace[]>(() => contents.map((content) => ({ id: content.id, source: "kspot", title: content.spotName, address: content.address ?? `${content.region} · ${content.spotName}`, latitude: content.coordinates.latitude, longitude: content.coordinates.longitude, contentTypeLabel: content.type, description: content.description, kspotContent: content })), [contents]);
  const handleMapStatus = useCallback((status: "loading" | "ready" | "missing-key" | "error") => setMapStatus(status), []);

  return (
    <div><div className="map-color-legend" aria-label={t("콘텐츠 유형별 지도 색상")}>{Object.entries(contentColors).map(([type, color]) => <span key={type}><i style={{ background: color }} /><LocaleText>{type}</LocaleText></span>)}</div><div className="map-explorer-layout">
      <section className={`map-explorer-canvas ${mapStatus === "ready" ? "has-live-map" : ""}`} aria-label={t("K-콘텐츠 촬영지 지도")}>
        <KakaoMap fitPlaces appKey={appKey} initialCenter={contents[0]?.coordinates ?? { latitude: 35.1532, longitude: 129.1186 }} places={mapPlaces} selectedId={selected?.id} onReadyStateChange={handleMapStatus} onSelect={(place) => setSelectedId(place.id)} />
        {mapStatus !== "ready" && <div className="map-fallback-layer"><div className="map-grid-lines" /><span className="map-district district-one"><LocaleText>{"서울"}</LocaleText></span><span className="map-district district-two"><LocaleText>{"부산"}</LocaleText></span><span className="map-district district-three"><LocaleText>{"강원"}</LocaleText></span>{contents.map((content) => {
          const position = content.mapPosition;
          const active = content.id === selected?.id;
          return <button className={`map-explorer-marker marker-${position.tone} ${active ? "is-active" : ""}`} key={content.id} onClick={() => setSelectedId(content.id)} style={{ left: `${position.x}%`, top: `${position.y}%` }} type="button" aria-label={t(`${content.spotName} 선택`)}><span><AppIcon name="pin" size={17} /></span><strong>{content.spotName}</strong></button>;
        })}</div>}
        {mapStatus === "missing-key" && <p className="map-sdk-message"><LocaleText>{"Kakao 지도 키를 설정하면 실제 지도가 표시됩니다."}</LocaleText></p>}
        {mapStatus === "error" && <p className="map-sdk-message"><LocaleText>{"지도를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."}</LocaleText></p>}
      </section>
      <aside className="map-explorer-sidebar">
        <div className="map-explorer-sidebar-heading"><div><p className="kspot-eyebrow">PLACE LIST</p><h2><LocaleText>{"촬영지 "}</LocaleText>{contents.length}<LocaleText>{"곳"}</LocaleText></h2></div><AppIcon name="map" size={22} /></div>
        {selected && <div className="map-selected-place"><span className={`map-selected-thumb visual-${selected.visual}`}><ContentThumbnail src={selected.imageUrl} title={selected.title} /></span><div><p>{selected.region} · <LocaleText>{selected.type}</LocaleText></p><h3>{selected.spotName}</h3><span>{selected.title}</span><Link href={`/spots/${selected.id}`}><LocaleText>{"상세 보기 "}</LocaleText><AppIcon name="arrow" size={14} /></Link></div></div>}
        <div className="map-place-list">{contents.map((content) => <button className={content.id === selected?.id ? "is-active" : undefined} aria-pressed={content.id === selected?.id} key={content.id} onClick={() => setSelectedId(content.id)} type="button"><span className={`map-list-thumb visual-${content.visual}`}><ContentThumbnail src={content.imageUrl} title={content.title} /></span><span><strong>{content.spotName}</strong><small>{content.region} · <LocaleText>{content.type}</LocaleText></small></span><AppIcon name="arrow" size={15} /></button>)}</div>
      </aside>
    </div></div>
  );
}
