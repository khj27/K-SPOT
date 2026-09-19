import { SavedSpotsList } from "@/components/saved/saved-spots-list";
import { SavedItinerariesList } from "@/components/saved/saved-itineraries-list";
import { getPublicExploreContents } from "@/lib/content-repository";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  const contents = await getPublicExploreContents();
  return (
    <main className="saved-page">
      <section className="saved-heading">
        <div>
          <p className="kspot-eyebrow">MY K-SPOT</p>
          <h1>저장한 장소를<br /><em>다시 만나보세요.</em></h1>
          <p>여행하고 싶은 촬영지를 모아두고 나만의 코스를 준비해 보세요.</p>
        </div>
        <div className="saved-heading-icon" aria-hidden="true">♥</div>
      </section>
      <SavedItinerariesList contents={contents} />
      <SavedSpotsList contents={contents} />
      <p className="saved-data-notice">현재 브라우저에 저장된 자료입니다. 마이페이지에서 로그인 후 계정에 보관하거나 다른 기기의 자료를 가져올 수 있습니다.</p>
    </main>
  );
}
