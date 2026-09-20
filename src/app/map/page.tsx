import Link from "next/link";
import Form from "next/form";
import { REGIONS } from "@/lib/regions";

import { LocaleText } from "@/components/common/locale-provider";
import { MapExplorer } from "@/components/map/map-explorer";
import { AppIcon } from "@/components/common/app-icon";
import { getPublicExploreContents } from "@/lib/content-repository";
import { normalizeRegion } from "@/lib/recommendation";
import { exploreTypes } from "@/mocks/explore-data";

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
  const exploreContents = await getPublicExploreContents();
  const regions = ["전체 지역", ...REGIONS];
  const contents = exploreContents.filter((content) => (selectedType === "전체" || content.type === selectedType) && (selectedRegion === "전체 지역" || normalizeRegion(content.region) === normalizeRegion(selectedRegion)));

  return (
    <main className="map-page">
      <section className="map-page-heading"><div><p className="kspot-eyebrow">MAP EXPLORE</p><h1><LocaleText>{"지도에서 촬영지를"}</LocaleText><br /><em><LocaleText>{"한눈에 찾아보세요."}</LocaleText></em></h1><p><LocaleText>{"콘텐츠와 지역을 선택하면 관련 장소를 지도와 목록으로 확인할 수 있습니다."}</LocaleText></p></div><div className="map-page-summary"><strong>{contents.length}</strong><span><LocaleText>{"검색된 촬영지"}</LocaleText></span></div></section>
      <Form className="map-filter-panel" action="/map"><label><span><LocaleText>{"콘텐츠 유형"}</LocaleText></span><select name="type" defaultValue={selectedType}>{exploreTypes.map((type) => <option key={type} value={type}><LocaleText>{type}</LocaleText></option>)}</select></label><label><span><LocaleText>{"지역"}</LocaleText></span><select name="region" defaultValue={selectedRegion}>{regions.map((region) => <option key={region} value={region}><LocaleText>{region}</LocaleText></option>)}</select></label><button className="kspot-primary-button" type="submit"><LocaleText>{"필터 적용 "}</LocaleText><AppIcon name="arrow" size={16} /></button></Form>
      {contents.length > 0 ? <MapExplorer appKey={process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? ""} contents={contents} key={`${selectedType}:${selectedRegion}`} /> : <section className="map-empty"><AppIcon name="map" size={32} /><h2><LocaleText>{"조건에 맞는 촬영지가 없습니다."}</LocaleText></h2><p><LocaleText>{"필터를 바꿔 다시 검색해 보세요."}</LocaleText></p><Link href="/map"><LocaleText>{"전체 지도 보기"}</LocaleText></Link></section>}
      <p className="map-data-notice"><LocaleText>{"지도 좌표는 실제 위·경도를 사용하며, 관리자 공개 데이터는 출처와 검수일을 함께 관리합니다."}</LocaleText></p>
    </main>
  );
}
