import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import { PlannerItineraryEditor } from "@/components/planner/planner-itinerary-editor";
import { exploreContents } from "@/mocks/explore-data";

type PlannerResultProps = {
  searchParams: Promise<{ days?: string; region?: string; transport?: string; companion?: string; types?: string | string[]; spot?: string }>;
};

export default async function PlannerResultPage({ searchParams }: PlannerResultProps) {
  const params = await searchParams;
  const days = params.days === "3" ? 3 : params.days === "1" ? 1 : 2;
  const selectedTypes = new Set((Array.isArray(params.types) ? params.types : params.types ? [params.types] : ["드라마", "예능"]));
  const selectedSpot = exploreContents.find((content) => content.id === params.spot);
  const candidates = exploreContents.filter((content) => selectedTypes.has(content.type) && (!params.region || content.region === params.region));
  const places = selectedSpot ? [selectedSpot, ...candidates.filter((content) => content.id !== selectedSpot.id)] : candidates;
  const itinerary = places.slice(0, days);

  return (
    <main className="planner-result-page">
      <Link className="planner-back-link" href={`/planner${selectedSpot ? `?spot=${selectedSpot.id}` : ""}`}><AppIcon name="arrow" size={15} /> 조건 다시 설정하기</Link>
      <section className="planner-result-heading">
        <div><p className="kspot-eyebrow">MY ITINERARY</p><h1>{params.region ?? "전국"} {days === 1 ? "당일" : `${days - 1}박 ${days}일`} 추천 코스</h1><p>취향과 이동 조건에 맞춰 촬영지 중심으로 구성한 데모 일정입니다.</p></div>
        <div className="planner-result-meta"><span>{params.transport ?? "대중교통"}</span><span>{params.companion ?? "친구"} 여행</span></div>
      </section>
      <section className="planner-route-summary"><AppIcon name="route" size={22} /><div><strong>{places.length}개의 촬영지 후보</strong><span>{Array.from(selectedTypes).join(" · ")} 중심 추천</span></div><Link href="/saved">저장한 장소 보기 <AppIcon name="arrow" size={15} /></Link></section>
      <PlannerItineraryEditor places={itinerary.filter((place): place is (typeof exploreContents)[number] => place !== undefined)} days={days} region={params.region ?? "전국"} transport={params.transport ?? "대중교통"} companion={params.companion ?? "친구"} types={Array.from(selectedTypes)} />
      <p className="planner-demo-note">현재 일정은 데모 콘텐츠를 이용한 규칙 기반 추천입니다. 실제 이동 거리와 운영 정보는 API 연결 후 보완됩니다.</p>
    </main>
  );
}
