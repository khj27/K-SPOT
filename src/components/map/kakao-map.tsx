"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import { loadKakaoMaps, type KakaoMapInstance, type KakaoMaps, type KakaoMarkerInstance } from "@/lib/kakao-map-loader";
import type { MapCoordinate, MapPlace } from "@/types/map";
import { contentColors } from "@/lib/map-colors";

export type KakaoMapHandle = {
  getCenter(): MapCoordinate;
  zoomIn(): void;
  zoomOut(): void;
};

type KakaoMapProps = {
  appKey: string;
  initialCenter: MapCoordinate;
  places: MapPlace[];
  selectedId?: string;
  fitPlaces?: boolean;
  onReadyStateChange(status: "loading" | "ready" | "missing-key" | "error"): void;
  onSelect(place: MapPlace): void;
};


export const KakaoMap = forwardRef<KakaoMapHandle, KakaoMapProps>(function KakaoMap({ appKey, initialCenter, places, selectedId, fitPlaces = false, onReadyStateChange, onSelect }, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<KakaoMapInstance | null>(null);
  const mapsRef = useRef<KakaoMaps | null>(null);
  const markersRef = useRef<KakaoMarkerInstance[]>([]);
  const fitted = useRef("");
  const [ready, setReady] = useState(false);
  const selectedPlace = places.find((place) => place.id === selectedId);
  const selectedLatitude = selectedPlace?.latitude;
  const selectedLongitude = selectedPlace?.longitude;

  useEffect(() => {
    const map = mapRef.current;
    const maps = mapsRef.current;
    if (ready && map && maps && selectedLatitude !== undefined && selectedLongitude !== undefined
      && Number.isFinite(selectedLatitude) && Number.isFinite(selectedLongitude)) {
      map.setCenter(new maps.LatLng(selectedLatitude, selectedLongitude));
    }
  }, [ready, selectedLatitude, selectedLongitude]);

  useEffect(() => {
    const container = containerRef.current;
    const map = mapRef.current;
    if (!ready || !container || !map) return;
    const observer = new ResizeObserver(() => {
      const center = map.getCenter();
      map.relayout();
      map.setCenter(center);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [ready]);

  useImperativeHandle(ref, () => ({
    getCenter() {
      const center = mapRef.current?.getCenter();
      return center ? { latitude: center.getLat(), longitude: center.getLng() } : initialCenter;
    },
    zoomIn() {
      const map = mapRef.current;
      if (map) map.setLevel(Math.max(1, map.getLevel() - 1));
    },
    zoomOut() {
      const map = mapRef.current;
      if (map) map.setLevel(Math.min(14, map.getLevel() + 1));
    },
  }), [initialCenter]);

  useEffect(() => {
    let cancelled = false;
    if (!appKey) {
      onReadyStateChange("missing-key");
      return;
    }

    onReadyStateChange("loading");
    void loadKakaoMaps(appKey).then((maps) => {
      if (cancelled || !containerRef.current) return;
      mapsRef.current = maps;
      mapRef.current = new maps.Map(containerRef.current, { center: new maps.LatLng(initialCenter.latitude, initialCenter.longitude), level: 7 });
      setReady(true);
      onReadyStateChange("ready");
    }).catch(() => {
      if (!cancelled) onReadyStateChange("error");
    });

    return () => { cancelled = true; };
  }, [appKey, initialCenter.latitude, initialCenter.longitude, onReadyStateChange]);

  useEffect(() => {
    const map = mapRef.current;
    const maps = mapsRef.current;
    if (!ready || !map || !maps) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    const signature = places.map((place) => place.id).join(",");
    if (fitPlaces && signature !== fitted.current) {
      const valid = places.filter(hasValidCoordinates);
      if (valid.length > 1) {
        const bounds = new maps.LatLngBounds();
        valid.forEach((place) => bounds.extend(new maps.LatLng(place.latitude, place.longitude)));
        map.setBounds(bounds);
      }
      fitted.current = signature;
    }
    markersRef.current = places.filter(hasValidCoordinates).map((place) => {
      const selected = place.id === selectedId;
      const image = createMarkerImage(maps, contentColors[place.contentTypeLabel] ?? "#2386dd", selected);
      const marker = new maps.Marker({ map, position: new maps.LatLng(place.latitude, place.longitude), title: place.title, clickable: true, image });
      marker.setZIndex(selected ? 10 : 1);
      marker.setOpacity(selected ? 1 : 0.88);
      maps.event.addListener(marker, "click", () => onSelect(place));
      return marker;
    });

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
    };
  }, [onSelect, places, ready, selectedId, fitPlaces]);

  return <div className="kakao-map-surface" ref={containerRef} aria-label="Kakao 지도" />;
});

function hasValidCoordinates(place: MapPlace) {
  return Number.isFinite(place.latitude) && Number.isFinite(place.longitude) && Math.abs(place.latitude) <= 90 && Math.abs(place.longitude) <= 180;
}

function createMarkerImage(maps: KakaoMaps, color: string, selected: boolean) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="38" height="46" viewBox="0 0 38 46"><path fill="${color}" stroke="white" stroke-width="3" d="M19 1.5c-9.7 0-17.5 7.8-17.5 17.5C1.5 32.2 19 44.5 19 44.5S36.5 32.2 36.5 19C36.5 9.3 28.7 1.5 19 1.5Z"/><circle cx="19" cy="18" r="6" fill="white"/></svg>`;
  const source = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  return new maps.MarkerImage(source, new maps.Size(selected ? 38 : 22, selected ? 46 : 27), { offset: new maps.Point(selected ? 19 : 11, selected ? 44 : 26) });
}
