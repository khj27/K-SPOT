"use client";
import { LocaleText } from "@/components/common/locale-provider";

import { useState } from "react";
import { KakaoMap } from "@/components/map/kakao-map";
import type { ExploreContent } from "@/types/content";
export function SpotLocationMap({ content, appKey }: { content: ExploreContent; appKey: string }) {
  const [status, setStatus] = useState("loading");
  return <section className="spot-location-section"><h2><LocaleText>{"촬영지 위치"}</LocaleText></h2><div className="spot-location-map"><KakaoMap appKey={appKey} initialCenter={content.coordinates} selectedId={content.id} places={[{ id: content.id, source: "kspot", title: content.spotName, address: content.address ?? content.region, latitude: content.coordinates.latitude, longitude: content.coordinates.longitude, contentTypeLabel: content.type }]} onReadyStateChange={setStatus} onSelect={() => {}} />{status !== "ready" && <p className="map-sdk-message" role="status"><LocaleText>{status === "loading" ? "지도를 불러오는 중…" : "지도를 불러오지 못했습니다. 아래 카카오맵에서 위치를 확인해 주세요."}</LocaleText></p>}</div><p>{content.address ?? content.region}</p><a href={`https://map.kakao.com/link/map/${encodeURIComponent(content.spotName)},${content.coordinates.latitude},${content.coordinates.longitude}`} target="_blank" rel="noreferrer"><LocaleText>{"카카오맵에서 길찾기"}</LocaleText></a></section>;
}
