"use client";
import { LocaleText } from "@/components/common/locale-provider";


import Link from "next/link";
import { TourBookmarkButton } from "@/components/spots/tour-bookmark-button";
import { useEffect, useState } from "react";

import { ContentThumbnail } from "@/components/common/content-thumbnail";
import { AppIcon } from "@/components/common/app-icon";
import type { NearbyTourismResponse } from "@/types/tour-api";

type NearbyTourismProps = { latitude: number; longitude: number };

export function NearbyTourism({ latitude, longitude }: NearbyTourismProps) {
  const [data, setData] = useState<NearbyTourismResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(`/api/nearby?latitude=${latitude}&longitude=${longitude}`, { signal: controller.signal });
        if (!response.ok) throw new Error("invalid request");
        setData((await response.json()) as NearbyTourismResponse);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setData({ source: "unavailable", operation: "locationBasedList2", items: [], fetchedAt: new Date().toISOString(), message: "주변 관광정보를 불러오지 못했습니다." });
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [latitude, longitude]);

  return (
    <section className="spot-detail-card nearby-tourism-card" aria-busy={loading}>
      <div className="nearby-tourism-heading">
        <div><p className="spot-card-eyebrow">TOURAPI NEARBY</p><h2><LocaleText>{"주변에서 함께 즐길 곳"}</LocaleText></h2></div>
        <span className={data?.source === "tour-api" ? "tourapi-status is-live" : "tourapi-status"}><LocaleText>{data?.source === "tour-api" ? "실시간 연동" : "연동 준비"}</LocaleText></span>
      </div>
      {loading ? <p className="nearby-tourism-state"><LocaleText>{"한국관광공사 주변 관광정보를 불러오는 중입니다…"}</LocaleText></p> : data && data.items.length > 0 ? (
        <div className="nearby-tourism-list">
          {data.items.map((place) => <article key={place.contentId}><div className="tourism-photo"><ContentThumbnail src={place.thumbnailUrl || place.imageUrl} title={place.title} /></div><div><h3><Link href={`/tour-spots/${place.contentId}`}>{place.title}</Link></h3><p><LocaleText>{place.address || "주소 정보 확인 중"}</LocaleText></p><span><LocaleText>{place.distanceMeters === undefined ? "주변 관광지" : `${place.distanceMeters.toLocaleString("ko-KR")}m 거리`}</LocaleText></span><TourBookmarkButton place={{ contentId: place.contentId, title: place.title, address: place.address, latitude: place.latitude, longitude: place.longitude, contentTypeId: place.contentTypeId, ...(place.thumbnailUrl || place.imageUrl ? { imageUrl: place.thumbnailUrl || place.imageUrl } : {}) }} /></div></article>)}
        </div>
      ) : <div className="nearby-tourism-empty"><AppIcon name="map" size={24} /><div><strong><LocaleText>{"주변 즐길거리를 찾지 못했습니다."}</LocaleText></strong><p><LocaleText>{data?.message}</LocaleText></p></div></div>}
      <p className="tourapi-evidence"><LocaleText>{"한국관광공사 국문 관광정보 서비스 · locationBasedList2 · 반경 5km"}</LocaleText></p>
    </section>
  );
}
