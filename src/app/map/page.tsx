import { MapExplorer } from "@/components/map/map-explorer";
import { AppIcon } from "@/components/common/app-icon";
import { exploreContents, exploreRegions, exploreTypes } from "@/mocks/explore-data";

type MapPageProps = { searchParams: Promise<{ type?: string; region?: string }> };

const typeAliases: Record<string, (typeof exploreTypes)[number]> = {
  drama: "드라마",
  variety: "예능",
  movie: "영화",
  "music-video": "뮤직비디오",
  idol: "아이돌",
  webtoon: "웹툰/웹소설",
};

export default async function MapPage({ searchParams }: MapPageProps) {
  const params = await searchParams;
  const selectedType = typeAliases[params.type ?? ""] ?? params.type ?? "전체";
  const selectedRegion = params.region ?? "전체 지역";
  const contents = exploreContents.filter((content) => (selectedType === "전체" || content.type === selectedType) && (selectedRegion === "전체 지역" || content.region === selectedRegion));

  return (
    <main className="map-page">
      <section className="map-page-heading"><div><p className="kspot-eyebrow">MAP EXPLORE</p><h1>지도에서 촬영지를<br /><em>한눈에 찾아보세요.</em></h1><p>콘텐츠와 지역을 선택하면 관련 장소를 지도와 목록으로 확인할 수 있습니다.</p></div><div className="map-page-summary"><strong>{contents.length}</strong><span>검색된 촬영지</span></div></section>
      <form className="map-filter-panel" action="/map"><label><span>콘텐츠 유형</span><select name="type" defaultValue={selectedType}>{exploreTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label><label><span>지역</span><select name="region" defaultValue={selectedRegion}>{exploreRegions.map((region) => <option key={region} value={region}>{region}</option>)}</select></label><button className="kspot-primary-button" type="submit">필터 적용 <AppIcon name="arrow" size={16} /></button></form>
      {contents.length > 0 ? <MapExplorer contents={contents} /> : <section className="map-empty"><AppIcon name="map" size={32} /><h2>조건에 맞는 촬영지가 없습니다.</h2><p>필터를 바꿔 다시 검색해 보세요.</p><a href="/map">전체 지도 보기</a></section>}
      <p className="map-data-notice">현재 지도와 좌표는 기능 검증용 데모입니다. 실제 지도 공급자와 좌표 데이터는 후속 단계에서 연결합니다.</p>
    </main>
  );
}
