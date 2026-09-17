"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { featuredPlace } from "@/mocks/home-data";
import type { MapPlace } from "@/types/map";
import type { TourApiDetailResponse } from "@/types/tour-api";

export function FeaturedPlacePanel({ place }: { place?: MapPlace }) {
  const [detailState, setDetailState] = useState<{ placeId: string; response: TourApiDetailResponse } | null>(null);

  useEffect(() => {
    if (!place || place.source !== "tour-api") {
      return;
    }
    const controller = new AbortController();
    void fetch(`/api/tour-spots/${place.id.replace("tour-", "")}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<TourApiDetailResponse> : Promise.reject(new Error("invalid response")))
      .then((response) => setDetailState({ placeId: place.id, response }))
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setDetailState({ placeId: place.id, response: { source: "unavailable", operation: "detailCommon2", message: "상세정보를 불러오지 못했습니다." } });
      });
    return () => controller.abort();
  }, [place]);

  if (!place) return <aside className="featured-place-panel place-panel-empty"><AppIcon name="pin" size={34} /><h2>지도에서 장소를 선택해보세요.</h2><p>선택한 관광지의 정보가 여기에 표시됩니다.</p></aside>;

  const isTourApi = place.source === "tour-api";
  const detail = detailState?.placeId === place.id ? detailState.response : null;
  const description = detail?.item?.overview || place.description;
  const coverImage = detail?.item?.imageUrl || place.imageUrl || place.kspotContent?.imageUrl;

  return (
    <aside className="featured-place-panel">
      <div className={`place-cover ${coverImage ? "has-image" : ""}`} style={coverImage ? { backgroundImage: `linear-gradient(90deg, rgb(10 31 55 / 82%), rgb(23 77 105 / 45%)), url(${JSON.stringify(coverImage)})` } : undefined}>
        <span className="place-region"><AppIcon name="pin" size={13} /> {place.address || "주소 정보 없음"}</span>
        <h2>{place.title}</h2>
        {isTourApi ? <p className="place-data-provider">한국관광공사 제공 · {place.contentTypeLabel}</p> : <p>★ {featuredPlace.rating} <span>데모 평점</span></p>}
        <div className="cover-skyline" />
      </div>
      <div className="place-tabs" role="tablist" aria-label="장소 정보 탭"><button className="is-active" type="button" role="tab" aria-selected="true">콘텐츠 정보</button><button type="button" role="tab" aria-selected="false">즐길거리 요약</button><button type="button" role="tab" aria-selected="false">상세 정보</button></div>
      <div className="place-panel-body">
        {place.kspotContent ? <><h3>이 장소와 연결된 콘텐츠</h3><div className="mini-content-grid selected-content-grid"><Link href={`/spots/${place.kspotContent.id}`}><span className={`mini-thumb thumb-${place.kspotContent.visual === "green" ? "sky" : place.kspotContent.visual}`}>{place.kspotContent.title.slice(0, 1)}</span><small>{place.kspotContent.type}</small><strong>{place.kspotContent.title}</strong><em>{place.kspotContent.episode}</em></Link></div></> : <><h3>TourAPI 관광지 정보</h3><p className="place-overview">{description || (detail ? "등록된 상세 설명이 없습니다." : "상세 정보를 불러오는 중입니다…")}</p></>}
        <h3>장소 데이터</h3>
        <div className="nearby-grid place-data-grid"><div><span>⌖</span><strong>{place.distanceMeters === undefined ? "지도 위치" : `${place.distanceMeters.toLocaleString("ko-KR")}m`}</strong></div><div><span>▣</span><strong>{place.contentTypeLabel}</strong></div><div><span>ⓘ</span><strong>{isTourApi ? "TourAPI" : "K-SPOT"}</strong></div></div>
        <Link className="kspot-primary-button" href={place.kspotContent ? `/planner?spot=${place.kspotContent.id}` : "/planner"}>이 장소 중심 코스 추천받기 <AppIcon name="arrow" size={18} /></Link>
        <p className="demo-data-notice">{isTourApi ? "한국관광공사 TourAPI 실시간 관광정보입니다. 평점은 제공하지 않습니다." : "K-콘텐츠 관계는 데모 데이터이며 공개 전 출처 검수가 필요합니다."}</p>
      </div>
    </aside>
  );
}
