"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FeaturedPlacePanel } from "@/components/home/featured-place-panel";
import { MapCanvas } from "@/components/home/map-canvas";
import type { ExploreContent } from "@/types/content";
import type { MapCoordinate, MapPlace } from "@/types/map";
import type { NearbyTourismResponse, TourApiPlace } from "@/types/tour-api";

const DEFAULT_CENTER = { latitude: 35.1532, longitude: 129.1186 };
const contentFilters = ["전체", "드라마", "예능", "영화", "뮤직비디오", "아이돌", "웹툰/웹소설"] as const;
const contentTypeLabels: Record<string, string> = { "12": "관광지", "14": "문화시설", "15": "축제·행사", "25": "여행코스", "28": "레포츠", "32": "숙박", "38": "쇼핑", "39": "음식점" };
const initialRequestCache = new Map<string, Promise<NearbyTourismResponse>>();

type HomeMapExperienceProps = { kakaoMapKey: string; contents: ExploreContent[] };

export function HomeMapExperience({ kakaoMapKey, contents }: HomeMapExperienceProps) {
  const [category, setCategory] = useState<(typeof contentFilters)[number]>("전체");
  const [tourPlaces, setTourPlaces] = useState<MapPlace[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [tourStatus, setTourStatus] = useState<"loading" | "live" | "unavailable" | "empty">("loading");
  const [tourMessage, setTourMessage] = useState("주변 관광정보를 불러오는 중입니다.");
  const requestSequence = useRef(0);

  const kspotPlaces = useMemo(() => contents.map(toKspotMapPlace), [contents]);
  const visiblePlaces = useMemo(() => {
    if (category !== "전체") return kspotPlaces.filter((place) => place.contentTypeLabel === category);
    return tourPlaces.length > 0 ? tourPlaces : kspotPlaces;
  }, [category, kspotPlaces, tourPlaces]);
  const selectedPlace = visiblePlaces.find((place) => place.id === selectedId) ?? visiblePlaces[0];

  const searchNearby = useCallback(async (center: MapCoordinate, reuseInitialRequest = false) => {
    const sequence = ++requestSequence.current;
    setTourStatus("loading");
    setTourMessage("현재 지도 중심의 관광정보를 불러오는 중입니다.");
    const url = `/api/nearby?latitude=${center.latitude}&longitude=${center.longitude}&radius=10000`;
    try {
      let request = initialRequestCache.get(url);
      if (!request || !reuseInitialRequest) {
        request = fetch(url).then(async (response) => {
          if (!response.ok) throw new Error("invalid response");
          return response.json() as Promise<NearbyTourismResponse>;
        });
        if (reuseInitialRequest) initialRequestCache.set(url, request);
      }
      const data = await request;
      if (sequence !== requestSequence.current) return;
      if (data.source === "tour-api" && data.items.length > 0) {
        setTourPlaces(data.items.map(toTourMapPlace));
        setTourStatus("live");
        setTourMessage(`현재 중심 반경 10km에서 관광지 ${data.items.length}곳을 찾았습니다.`);
        setCategory("전체");
      } else if (data.source === "tour-api") {
        setTourPlaces([]);
        setTourStatus("empty");
        setTourMessage("현재 지도 주변에서 관광정보를 찾지 못했습니다. K-SPOT 장소를 표시합니다.");
      } else {
        setTourStatus("unavailable");
        setTourMessage(data.message ?? "TourAPI를 잠시 사용할 수 없어 K-SPOT 장소를 표시합니다.");
      }
    } catch {
      if (sequence !== requestSequence.current) return;
      setTourStatus("unavailable");
      setTourMessage("관광정보를 불러오지 못해 K-SPOT 장소를 표시합니다.");
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => { void searchNearby(DEFAULT_CENTER, true); });
  }, [searchNearby]);

  return (
    <>
      <section className="home-filter-row" aria-label="콘텐츠 유형 필터">
        {contentFilters.map((filter) => <button className={category === filter ? "is-active" : undefined} key={filter} onClick={() => { setCategory(filter); setSelectedId(undefined); }} type="button">{filter}</button>)}
      </section>
      <section className="home-map-layout">
        <MapCanvas appKey={kakaoMapKey} places={visiblePlaces} selectedId={selectedPlace?.id} onSelect={(place) => setSelectedId(place.id)} onSearch={(center) => searchNearby(center)} loading={tourStatus === "loading"} status={tourStatus} statusMessage={tourMessage} />
        <FeaturedPlacePanel place={selectedPlace} />
      </section>
    </>
  );
}

function toKspotMapPlace(content: ExploreContent): MapPlace {
  return { id: `kspot-${content.id}`, source: "kspot", title: content.spotName, address: `${content.region} · ${content.spotName}`, latitude: content.coordinates.latitude, longitude: content.coordinates.longitude, contentTypeLabel: content.type, description: content.description, kspotContent: content };
}

function toTourMapPlace(place: TourApiPlace): MapPlace {
  return { id: `tour-${place.contentId}`, source: "tour-api", title: place.title, address: place.address, latitude: place.latitude, longitude: place.longitude, imageUrl: place.imageUrl || place.thumbnailUrl, contentTypeLabel: contentTypeLabels[place.contentTypeId] ?? "관광정보", distanceMeters: place.distanceMeters };
}
