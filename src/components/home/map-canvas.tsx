import { AppIcon } from "@/components/common/app-icon";
import { homeMapMarkers } from "@/mocks/home-data";

export function MapCanvas() {
  return (
    <section className="map-canvas" aria-label="부산 지역 K-콘텐츠 장소 데모 지도">
      <div className="map-grid-lines" />
      <span className="map-district district-one">부산진구</span>
      <span className="map-district district-two">연제구</span>
      <span className="map-district district-three">영도구</span>
      {homeMapMarkers.map((marker) => (
        <div className={`map-marker marker-${marker.tone}`} style={{ left: `${marker.x}%`, top: `${marker.y}%` }} key={marker.id}>
          <span>{marker.count ? <b>{marker.count}</b> : <AppIcon name="pin" size={18} />}</span>
          <strong>{marker.label}</strong>
        </div>
      ))}
      <button className="map-current-search" type="button">현재 지도 내 검색 <AppIcon name="search" size={17} /></button>
      <div className="map-controls" aria-label="지도 확대 축소"><button type="button" aria-label="지도 확대">+</button><button type="button" aria-label="지도 축소">−</button></div>
      <div className="map-legend"><strong>콘텐츠 유형</strong><span><i className="legend-purple" />드라마</span><span><i className="legend-blue" />예능</span><span><i className="legend-teal" />영화</span><span><i className="legend-rose" />뮤직비디오</span></div>
      <p className="demo-map-label">UI 데모 지도 · 실제 위치 정보 아님</p>
    </section>
  );
}
