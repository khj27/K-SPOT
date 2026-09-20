"use client";
import { useCallback, useMemo, useState } from "react";
import { KakaoMap } from "@/components/map/kakao-map";
import { useTranslation } from "@/components/common/locale-provider";
import type { MapPlace } from "@/types/map";
export function ItineraryMap({ places }: { places: MapPlace[] }) {
  const { t } = useTranslation();
  const [status, setStatus] = useState("loading");
  const [selected, setSelected] = useState<string>();
  const select = useCallback((place: MapPlace) => setSelected(place.id), []);
  const numbered = useMemo(() => places.map((place, index) => ({ ...place, order: index + 1 })), [places]);
  return <section className="itinerary-map-card"><h2>{t("이 일정의 장소 지도")}</h2><p>{t("현재 일정에 포함된 장소만 순서대로 표시합니다.")}</p>{places.length ? <><div className="itinerary-map"><KakaoMap appKey={process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? ""} initialCenter={{ latitude: places[0].latitude, longitude: places[0].longitude }} places={numbered} selectedId={selected} fitPlaces onSelect={select} onReadyStateChange={setStatus} /></div>{status !== "ready" && <p role="status">{t(status === "loading" ? "지도를 불러오는 중…" : "지도를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.")}</p>}<ol className="itinerary-map-list">{places.map((place) => <li key={place.id}><button type="button" onClick={() => setSelected(place.id)}>{place.title}</button></li>)}</ol></> : <p>{t("일정에 장소를 추가해 주세요.")}</p>}</section>;
}
