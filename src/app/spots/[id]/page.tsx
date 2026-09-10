import Link from "next/link";
import { notFound } from "next/navigation";

import { AppIcon } from "@/components/common/app-icon";
import { SpotActions } from "@/components/spots/spot-actions";
import { exploreContents } from "@/mocks/explore-data";

type SpotPageProps = { params: Promise<{ id: string }> };

export default async function SpotPage({ params }: SpotPageProps) {
  const { id } = await params;
  const content = exploreContents.find((item) => item.id === id);
  if (!content) notFound();

  const relatedContents = exploreContents.filter((item) => item.spotName === content.spotName && item.id !== content.id);

  return (
    <main className="spot-detail-page">
      <Link className="spot-back-link" href="/explore"><AppIcon name="arrow" size={16} /> 탐색 결과로 돌아가기</Link>
      <section className="spot-detail-hero">
        <div className={`spot-detail-visual visual-${content.visual}`}><span>{content.type}</span><strong>{content.title.slice(0, 1)}</strong><small>{content.episode}</small></div>
        <div className="spot-detail-intro">
          <p className="kspot-eyebrow">K-SPOT PLACE DETAIL</p>
          <h1>{content.spotName}</h1>
          <p className="spot-location"><AppIcon name="pin" size={16} /> {content.region} · K-콘텐츠 촬영 장소</p>
          <p className="spot-description">{content.description} 작품 속 장면을 떠올리며 주변의 로컬 매력도 함께 경험해 보세요.</p>
          <SpotActions spotId={content.id} />
        </div>
      </section>

      <div className="spot-detail-grid">
        <div>
          <section className="spot-detail-card">
            <p className="spot-card-eyebrow">FEATURED CONTENT</p>
            <h2>이 장소가 등장한 콘텐츠</h2>
            <div className="spot-content-relation">
              <div className={`spot-relation-thumb visual-${content.visual}`}>{content.title.slice(0, 1)}</div>
              <div><span>{content.type} · {content.episode}</span><h3>{content.title}</h3><p>{content.description}</p></div>
            </div>
            {relatedContents.length > 0 && <div className="spot-related-list">{relatedContents.map((item) => <Link href={`/spots/${item.id}`} key={item.id}><span>{item.type}</span><strong>{item.title}</strong><AppIcon name="arrow" size={15} /></Link>)}</div>}
          </section>
          <section className="spot-detail-card source-card">
            <p className="spot-card-eyebrow">DATA NOTE</p>
            <h2>정보 출처와 검수 상태</h2>
            <p>현재 장소 정보는 화면 기능 검증을 위한 데모 데이터입니다. 공개 전 공식 관광 정보와 촬영 출처를 확인한 뒤 실제 데이터로 교체합니다.</p>
            <span className="verification-badge">데모 데이터 · 공개 전 검수 필요</span>
          </section>
        </div>
        <aside className="spot-side-column">
          <section className="spot-detail-card">
            <p className="spot-card-eyebrow">PLACE INFO</p>
            <h2>장소 정보</h2>
            <dl className="spot-info-list"><div><dt>지역</dt><dd>{content.region}</dd></div><div><dt>장소명</dt><dd>{content.spotName}</dd></div><div><dt>콘텐츠 유형</dt><dd>{content.type}</dd></div><div><dt>방문 팁</dt><dd>운영 시간과 접근성을 방문 전 확인해 주세요.</dd></div></dl>
          </section>
          <section className="spot-mini-map"><div className="map-grid-lines" /><AppIcon name="pin" size={32} /><strong>{content.spotName}</strong><span>지도 서비스 연결 예정</span></section>
          <Link className="spot-planner-link" href={`/planner?spot=${content.id}`}>이 장소를 포함한 코스 추천 <AppIcon name="arrow" size={17} /></Link>
        </aside>
      </div>
    </main>
  );
}
