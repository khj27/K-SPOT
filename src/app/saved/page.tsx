import { SavedSpotsList } from "@/components/saved/saved-spots-list";
import { SavedItinerariesList } from "@/components/saved/saved-itineraries-list";

export default function SavedPage() {
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
      <SavedItinerariesList />
      <SavedSpotsList />
      <p className="saved-data-notice">저장한 장소는 현재 이 브라우저에만 보관됩니다. 로그인 기능 연결 후 계정별로 동기화할 예정입니다.</p>
    </main>
  );
}
