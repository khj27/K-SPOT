"use client";

import Link from "next/link";
import { useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import type { ExploreContent } from "@/types/content";

export function MapExplorer({ contents }: { contents: ExploreContent[] }) {
  const [selectedId, setSelectedId] = useState(contents[0]?.id);
  const selected = contents.find((content) => content.id === selectedId) ?? contents[0];

  return (
    <div className="map-explorer-layout">
      <section className="map-explorer-canvas" aria-label="K-콘텐츠 촬영지 데모 지도">
        <div className="map-grid-lines" />
        <span className="map-district district-one">서울</span><span className="map-district district-two">부산</span><span className="map-district district-three">강원</span>
        {contents.map((content) => {
          const position = content.mapPosition;
          const active = content.id === selected?.id;
          return <button className={`map-explorer-marker marker-${position.tone} ${active ? "is-active" : ""}`} key={content.id} onClick={() => setSelectedId(content.id)} style={{ left: `${position.x}%`, top: `${position.y}%` }} type="button" aria-label={`${content.spotName} 선택`}><span><AppIcon name="pin" size={17} /></span><strong>{content.spotName}</strong></button>;
        })}
        <p className="demo-map-label">UI 데모 지도 · 실제 위치 정보 아님</p>
      </section>
      <aside className="map-explorer-sidebar">
        <div className="map-explorer-sidebar-heading"><div><p className="kspot-eyebrow">PLACE LIST</p><h2>촬영지 {contents.length}곳</h2></div><AppIcon name="map" size={22} /></div>
        {selected && <div className="map-selected-place"><span className={`map-selected-thumb visual-${selected.visual}`}>{selected.title.slice(0, 1)}</span><div><p>{selected.region} · {selected.type}</p><h3>{selected.spotName}</h3><span>{selected.title}</span><Link href={`/spots/${selected.id}`}>상세 보기 <AppIcon name="arrow" size={14} /></Link></div></div>}
        <div className="map-place-list">{contents.map((content) => <button className={content.id === selected?.id ? "is-active" : undefined} key={content.id} onClick={() => setSelectedId(content.id)} type="button"><span className={`map-list-dot visual-${content.visual}`}>{content.title.slice(0, 1)}</span><span><strong>{content.spotName}</strong><small>{content.region} · {content.type}</small></span><AppIcon name="arrow" size={15} /></button>)}</div>
      </aside>
    </div>
  );
}
