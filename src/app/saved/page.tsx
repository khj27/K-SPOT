import { TravelDataBoundary } from "@/components/account/travel-snapshot-provider";

import { LocaleText } from "@/components/common/locale-provider";
import Link from "next/link";
import { SavedItinerariesList } from "@/components/saved/saved-itineraries-list";
import { getPublicExploreContents } from "@/lib/content-repository";

export const dynamic = "force-dynamic";

export default async function SavedPage({ searchParams }: { searchParams: Promise<{ created?: string }> }) {
  const { created } = await searchParams;
  const contents = await getPublicExploreContents();
  return (
    <main className="saved-page">
      <section className="saved-heading">
        <div>
          <p className="kspot-eyebrow">MY K-SPOT</p>
          <h1><LocaleText>여행 일정 관리</LocaleText></h1>
          <p><LocaleText>{"저장한 일정의 제목·인원·시간과 장소를 관리하세요."}</LocaleText></p>
        </div>
        <div className="saved-heading-icon" aria-hidden="true">♥</div>
      </section>
      <Link className="ui-button" href="/planner"><LocaleText>새 일정 만들기</LocaleText></Link><TravelDataBoundary><SavedItinerariesList contents={contents} createdId={created} /></TravelDataBoundary>

      <p className="saved-data-notice"><LocaleText>{"일정을 편집한 뒤 일정 저장을 누르면 계정에 반영됩니다. 같은 계정으로 다른 기기에서도 확인할 수 있습니다."}</LocaleText></p>
    </main>
  );
}
