import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import { exploreContents, exploreRegions, exploreTypes } from "@/mocks/explore-data";

type PlannerPageProps = {
  searchParams: Promise<{ spot?: string }>;
};

export default async function PlannerPage({ searchParams }: PlannerPageProps) {
  const { spot } = await searchParams;
  const selectedSpot = exploreContents.find((content) => content.id === spot);

  return (
    <main className="planner-page">
      <section className="planner-heading">
        <p className="kspot-eyebrow">TRIP PLANNER</p>
        <h1>나만의 로컬 여행을<br /><em>계획해 보세요.</em></h1>
        <p>좋아하는 콘텐츠와 여행 조건을 바탕으로 촬영지 코스를 추천해 드립니다.</p>
      </section>
      <form className="planner-form" action="/planner/result">
        {selectedSpot && <div className="planner-selected-spot"><AppIcon name="pin" size={17} /><span>선택한 장소</span><strong>{selectedSpot.spotName}</strong><input type="hidden" name="spot" value={selectedSpot.id} /></div>}
        <fieldset>
          <legend>여행 기본 정보</legend>
          <div className="planner-field-grid">
            <label><span>여행 기간</span><select name="days" defaultValue="2"><option value="1">당일치기</option><option value="2">1박 2일</option><option value="3">2박 3일</option></select></label>
            <label><span>출발 지역</span><select name="region" defaultValue={selectedSpot?.region ?? "부산"}>{exploreRegions.filter((region) => region !== "전체 지역").map((region) => <option key={region} value={region}>{region}</option>)}</select></label>
            <label><span>이동 수단</span><select name="transport" defaultValue="대중교통"><option>대중교통</option><option>자가용</option><option>도보 중심</option></select></label>
            <label><span>동행자</span><select name="companion" defaultValue="친구"><option>혼자</option><option>친구</option><option>연인</option><option>가족</option></select></label>
          </div>
        </fieldset>
        <fieldset>
          <legend>콘텐츠 취향</legend>
          <div className="planner-choice-grid">
            {exploreTypes.filter((type) => type !== "전체" && type !== "웹툰/웹소설").map((type, index) => <label className="planner-choice" key={type}><input type="checkbox" name="types" value={type} defaultChecked={selectedSpot ? type === selectedSpot.type : index < 2} /><span>{type}</span></label>)}
          </div>
        </fieldset>
        <div className="planner-form-footer"><p><AppIcon name="sparkles" size={17} /> 데모 데이터 기준으로 조건에 맞는 촬영지를 구성합니다.</p><button className="kspot-primary-button" type="submit">추천 코스 만들기 <AppIcon name="arrow" size={17} /></button></div>
      </form>
      <Link className="planner-back-link" href="/explore">콘텐츠 먼저 둘러보기 <AppIcon name="arrow" size={15} /></Link>
    </main>
  );
}
