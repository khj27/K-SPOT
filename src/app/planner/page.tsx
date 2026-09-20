
import { LocaleText } from "@/components/common/locale-provider";
import Link from "next/link";

import { TripDateFields } from "@/components/planner/trip-date-fields";
import { AppIcon } from "@/components/common/app-icon";
import { getPublicExploreContents } from "@/lib/content-repository";
import { exploreTypes } from "@/mocks/explore-data";
import { normalizeRegion } from "@/lib/recommendation";

type PlannerPageProps = {
  searchParams: Promise<{ spot?: string }>;
};

export default async function PlannerPage({ searchParams }: PlannerPageProps) {
  const { spot } = await searchParams;
  const exploreContents = await getPublicExploreContents();
  const regions = [...new Set(["서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주", ...exploreContents.map((content) => normalizeRegion(content.region))])];
  const selectedSpot = exploreContents.find((content) => content.id === spot);

  return (
    <main className="planner-page">
      <section className="planner-heading">
        <p className="kspot-eyebrow">TRIP PLANNER</p>
        <h1><LocaleText>{"나만의 로컬 여행을"}</LocaleText><br /><em><LocaleText>{"계획해 보세요."}</LocaleText></em></h1>
        <p><LocaleText>{"좋아하는 콘텐츠와 여행 조건을 바탕으로 촬영지 코스를 추천해 드립니다."}</LocaleText></p>
      </section>
      <form className="planner-form" action="/planner/result">
        {selectedSpot && <div className="planner-selected-spot"><AppIcon name="pin" size={17} /><span><LocaleText>{"선택한 장소"}</LocaleText></span><strong>{selectedSpot.spotName}</strong><input type="hidden" name="spot" value={selectedSpot.id} /></div>}
        <fieldset>
          <legend><LocaleText>{"여행 기본 정보"}</LocaleText></legend>
          <div className="planner-field-grid">
            <TripDateFields today={new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date())} />
            <label><span><LocaleText>{"여행 지역"}</LocaleText></span><select name="region" defaultValue={selectedSpot ? normalizeRegion(selectedSpot.region) : "부산"}>{regions.map((region) => <option key={region} value={region}><LocaleText>{region}</LocaleText></option>)}</select></label>
            <label><span><LocaleText>{"이동 수단"}</LocaleText></span><select name="transport" defaultValue="대중교통"><option value={"대중교통"}><LocaleText>{"대중교통"}</LocaleText></option><option value={"자가용"}><LocaleText>{"자가용"}</LocaleText></option><option value={"도보 중심"}><LocaleText>{"도보 중심"}</LocaleText></option></select></label>
            <label><span><LocaleText>{"동행자"}</LocaleText></span><select name="companion" defaultValue="친구"><option value={"혼자"}><LocaleText>{"혼자"}</LocaleText></option><option value={"친구"}><LocaleText>{"친구"}</LocaleText></option><option value={"연인"}><LocaleText>{"연인"}</LocaleText></option><option value={"가족"}><LocaleText>{"가족"}</LocaleText></option></select></label>
          </div>
        </fieldset>
        <fieldset>
          <legend><LocaleText>{"콘텐츠 취향"}</LocaleText></legend>
          <div className="planner-choice-grid">
            {exploreTypes.filter((type) => type !== "전체").map((type) => <label className="planner-choice" key={type}><input type="checkbox" name="types" value={type} defaultChecked={selectedSpot ? type === selectedSpot.type : true} /><span><LocaleText>{type}</LocaleText></span></label>)}
          </div>
        </fieldset>
        <div className="planner-form-footer"><p><AppIcon name="sparkles" size={17} /><LocaleText>{" 등록된 콘텐츠로 날짜별 코스를 구성합니다. 최대 31일까지 선택할 수 있어요."}</LocaleText></p><button className="kspot-primary-button" type="submit"><LocaleText>{"추천 코스 만들기 "}</LocaleText><AppIcon name="arrow" size={17} /></button></div>
      </form>
      <Link className="planner-back-link" href="/explore"><LocaleText>{"콘텐츠 먼저 둘러보기 "}</LocaleText><AppIcon name="arrow" size={15} /></Link>
    </main>
  );
}
