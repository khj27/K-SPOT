import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import { PlannerItineraryEditor } from "@/components/planner/planner-itinerary-editor";
import { getPublicExploreContents } from "@/lib/content-repository";
import { rankPlaces } from "@/lib/recommendation";

type PlannerResultProps = {
  searchParams: Promise<{ days?: string; region?: string; transport?: string; companion?: string; types?: string | string[]; spot?: string }>;
};

export default async function PlannerResultPage({ searchParams }: PlannerResultProps) {
  const params = await searchParams;
  const exploreContents = await getPublicExploreContents();
  const days = params.days === "3" ? 3 : params.days === "1" ? 1 : 2;
  const selectedTypes = new Set((Array.isArray(params.types) ? params.types : params.types ? [params.types] : ["드라마", "예능"]));
  const selectedSpot = exploreContents.find((content) => content.id === params.spot);
  const rankedPlaces = rankPlaces({ places: exploreContents, region: params.region, selectedTypes, selectedSpotId: selectedSpot?.id });
  const itinerary = rankedPlaces.slice(0, days);

  return (
    <main className="planner-result-page">
      <Link className="planner-back-link" href={`/planner${selectedSpot ? `?spot=${selectedSpot.id}` : ""}`}><AppIcon name="arrow" size={15} /> 조건 다시 설정하기</Link>
      <section className="planner-result-heading">
        <div><p className="kspot-eyebrow">MY ITINERARY</p><h1>{params.region ?? "전국"} {days === 1 ? "당일" : `${days - 1}박 ${days}일`} 추천 코스</h1><p>선택 지역과 콘텐츠 취향에 따라 하루 한 장소를 제안합니다.</p></div>
        <div className="planner-result-meta"><span>{params.transport ?? "대중교통"}</span><span>{params.companion ?? "친구"} 여행</span></div>
      </section>
      <section className="planner-route-summary"><AppIcon name="route" size={22} /><div><strong>{rankedPlaces.length}개의 촬영지 후보</strong><span>지역 35 · 취향 30 · 비수도권 20점 기준</span></div><Link href="/saved">저장한 장소 보기 <AppIcon name="arrow" size={15} /></Link></section>
      <PlannerItineraryEditor recommendations={itinerary} days={days} region={params.region ?? "전국"} transport={params.transport ?? "대중교통"} companion={params.companion ?? "친구"} types={Array.from(selectedTypes)} />
      <p className="planner-demo-note">공개된 등록 콘텐츠와 데모 장소를 이용한 규칙 기반 추천입니다. 이동 수단과 동행자 정보는 일정에 기록되며, 이동 시간과 영업시간은 아직 추천에 반영되지 않습니다.</p>
    </main>
  );
}
