
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
      <Link className="ui-button" href="/planner"><LocaleText>새 일정 만들기</LocaleText></Link><SavedItinerariesList contents={contents} createdId={created} />

      <p className="saved-data-notice"><LocaleText>{"로그인 계정의 Firebase 자료입니다. 찜·일정 변경은 바로 저장되고 다른 기기에서도 같은 계정으로 확인할 수 있습니다."}</LocaleText></p>
    </main>
  );
}
