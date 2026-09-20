
import { LocaleText } from "@/components/common/locale-provider";
import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import { PlannerItineraryEditor } from "@/components/planner/planner-itinerary-editor";
import { getPublicExploreContents } from "@/lib/content-repository";
import { tripDays } from "@/lib/trip-dates";
import { exploreTypes } from "@/mocks/explore-data";
import { rankPlaces } from "@/lib/recommendation";

type PlannerResultProps = {
  searchParams: Promise<{ startDate?: string; endDate?: string; days?: string; region?: string; transport?: string; companion?: string; types?: string | string[]; spot?: string; title?: string; peopleCount?: string }>;
};

export default async function PlannerResultPage({ searchParams }: PlannerResultProps) {
  const params = await searchParams;
  const peopleCount = Number(params.peopleCount ?? 1);
  if (!Number.isInteger(peopleCount) || peopleCount < 1 || peopleCount > 100) return <main className="saved-page"><p><LocaleText>여행 인원은 1~100명으로 입력해 주세요.</LocaleText></p><Link href="/planner"><LocaleText>조건 다시 설정하기</LocaleText></Link></main>;
  const exploreContents = await getPublicExploreContents();
  let days = params.days === "3" ? 3 : params.days === "1" ? 1 : 2;
  if (params.startDate || params.endDate) {
    try { days = tripDays(params.startDate ?? "", params.endDate ?? ""); }
    catch { return <main className="planner-result-page"><h1><LocaleText>{"여행 날짜를 확인해 주세요."}</LocaleText></h1><p><LocaleText>{"시작일부터 종료일까지 1~31일의 유효한 날짜를 선택해 주세요."}</LocaleText></p><Link href="/planner"><LocaleText>{"날짜 다시 선택하기"}</LocaleText></Link></main>; }
  }
  const selectedTypes = new Set((Array.isArray(params.types) ? params.types : params.types ? [params.types] : exploreTypes.filter((type) => type !== "전체")));
  const selectedSpot = exploreContents.find((content) => content.id === params.spot);
  const rankedPlaces = rankPlaces({ places: exploreContents, region: params.region, selectedTypes, selectedSpotId: selectedSpot?.id });
  const itinerary = rankedPlaces.slice(0, days * 3);

  return (
    <main className="planner-result-page">
      <Link className="planner-back-link" href={`/planner${selectedSpot ? `?spot=${selectedSpot.id}` : ""}`}><AppIcon name="arrow" size={15} /><LocaleText>{" 조건 다시 설정하기"}</LocaleText></Link>
      <section className="planner-result-heading">
        <div><p className="kspot-eyebrow">MY ITINERARY</p><h1><LocaleText>{params.region ?? "전국"}</LocaleText> <LocaleText>{days === 1 ? "당일" : `${days - 1}박 ${days}일`}</LocaleText><LocaleText>{" 추천 코스"}</LocaleText></h1><p><LocaleText>{"선택한 날짜별로 최대 3곳씩 제안합니다. 방문 날짜와 순서를 자유롭게 조정하세요."}</LocaleText></p></div>
        <div className="planner-result-meta"><span><LocaleText>{params.transport ?? "대중교통"}</LocaleText></span><span>{peopleCount}<LocaleText>명</LocaleText></span></div>
      </section>
      <section className="planner-route-summary"><AppIcon name="route" size={22} /><div><strong>{rankedPlaces.length}<LocaleText>{"개의 촬영지 후보"}</LocaleText></strong><span><LocaleText>{"지역 35 · 취향 30 · 비수도권 20점 기준"}</LocaleText></span></div><Link href="/mypage#saved-places"><LocaleText>{"저장한 장소 보기 "}</LocaleText><AppIcon name="arrow" size={15} /></Link></section>
      <PlannerItineraryEditor initialTitle={params.title} initialPeopleCount={peopleCount} key={JSON.stringify(params)} candidates={rankedPlaces} startDate={params.startDate} endDate={params.endDate} recommendations={itinerary} days={days} region={params.region ?? "전국"} transport={params.transport ?? "대중교통"} companion={params.companion ?? "친구"} types={Array.from(selectedTypes)} />
      <p className="planner-demo-note"><LocaleText>{"등록된 공개 콘텐츠를 이용한 추천입니다. 후보가 부족한 날은 자유 일정으로 표시합니다. 이동 수단과 여행 인원은 일정에 기록되며, 이동 시간과 영업시간은 아직 추천에 반영되지 않습니다."}</LocaleText></p>
    </main>
  );
}
