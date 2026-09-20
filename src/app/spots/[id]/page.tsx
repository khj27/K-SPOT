
import { LocaleText } from "@/components/common/locale-provider";
import Link from "next/link";
import { ContentThumbnail } from "@/components/common/content-thumbnail";
import { notFound } from "next/navigation";

import { AppIcon } from "@/components/common/app-icon";
import { NearbyTourism } from "@/components/spots/nearby-tourism";
import { SpotLocationMap } from "@/components/map/spot-location-map";
import { SpotActions } from "@/components/spots/spot-actions";
import { getPublicExploreContents } from "@/lib/content-repository";
import { youtubeThumbnail } from "@/lib/content-thumbnail";

type SpotPageProps = { params: Promise<{ id: string }> };

export default async function SpotPage({ params }: SpotPageProps) {
  const { id } = await params;
  const exploreContents = await getPublicExploreContents();
  const content = exploreContents.find((item) => item.id === id);
  if (!content) notFound();

  const relatedContents = exploreContents.filter((item) => item.spotName === content.spotName && item.id !== content.id);

  return (
    <main className="spot-detail-page">
      <Link className="spot-back-link" href="/explore"><AppIcon name="arrow" size={16} /><LocaleText>{" 탐색 결과로 돌아가기"}</LocaleText></Link>
      <section className="spot-detail-hero">
        <div className={`spot-detail-visual visual-${content.visual}`}><span><LocaleText>{content.type}</LocaleText></span><ContentThumbnail src={content.imageUrl} title={content.title} /><small>{content.episode}</small></div>
        <div className="spot-detail-intro">
          <p className="kspot-eyebrow">K-SPOT PLACE DETAIL</p>
          <h1>{content.spotName}</h1>
          <p className="spot-location"><AppIcon name="pin" size={16} /> {content.region}<LocaleText>{" · K-콘텐츠 촬영 장소"}</LocaleText></p>
          <p className="spot-description">{content.description}<LocaleText>{" 작품 속 장면을 떠올리며 주변의 로컬 매력도 함께 경험해 보세요."}</LocaleText></p>
          <SpotActions spotId={content.id} youtubeUrl={content.sourceUrl && youtubeThumbnail(content.sourceUrl) ? content.sourceUrl : undefined} />
        </div>
      </section>

      <div className="spot-detail-grid">
        <div>
          <section className="spot-detail-card">
            <p className="spot-card-eyebrow">FEATURED CONTENT</p>
            <h2><LocaleText>{"이 장소가 등장한 콘텐츠"}</LocaleText></h2>
            <div className="spot-content-relation">
              <div className={`spot-relation-thumb visual-${content.visual}`}><ContentThumbnail src={content.imageUrl} title={content.title} /></div>
              <div><span><LocaleText>{content.type}</LocaleText> · {content.episode}</span><h3>{content.title}</h3><p>{content.description}</p></div>
            </div>
            {relatedContents.length > 0 && <div className="spot-related-list">{relatedContents.map((item) => <Link href={`/spots/${item.id}`} key={item.id}><span>{item.type}</span><strong>{item.title}</strong><AppIcon name="arrow" size={15} /></Link>)}</div>}
          </section>
          <section className="spot-detail-card source-card">
            <p className="spot-card-eyebrow">DATA NOTE</p>
            <h2><LocaleText>{"정보 출처와 검수 상태"}</LocaleText></h2>
            <p><LocaleText>{content.managed ? `${content.sourceLabel} 자료를 근거로 작품과 장소의 관계를 확인했습니다.` : "현재 장소 정보는 화면 기능 검증을 위한 데모 데이터입니다. 공개 전 공식 관광 정보와 촬영 출처를 확인합니다."}</LocaleText></p>
            {content.sourceUrl && <a className="source-link" href={content.sourceUrl} target="_blank" rel="noreferrer"><LocaleText>{"근거 자료 확인 "}</LocaleText><AppIcon name="arrow" size={14} /></a>}
            <span className="verification-badge"><LocaleText>{content.managed ? `검수 완료 · ${content.verifiedAt}` : "데모 데이터 · 공개 전 검수 필요"}</LocaleText></span>
          </section>
          <NearbyTourism latitude={content.coordinates.latitude} longitude={content.coordinates.longitude} />
        </div>
        <aside className="spot-side-column">
          <section className="spot-detail-card">
            <p className="spot-card-eyebrow">PLACE INFO</p>
            <h2><LocaleText>{"장소 정보"}</LocaleText></h2>
            <dl className="spot-info-list"><div><dt><LocaleText>{"지역"}</LocaleText></dt><dd>{content.region}</dd></div><div><dt><LocaleText>{"장소명"}</LocaleText></dt><dd>{content.spotName}</dd></div>{content.address && <div><dt><LocaleText>{"주소"}</LocaleText></dt><dd>{content.address}</dd></div>}<div><dt><LocaleText>{"콘텐츠 유형"}</LocaleText></dt><dd><LocaleText>{content.type}</LocaleText></dd></div><div><dt><LocaleText>{"방문 팁"}</LocaleText></dt><dd><LocaleText>{"운영 시간과 접근성을 방문 전 확인해 주세요."}</LocaleText></dd></div></dl>
          </section>
          <SpotLocationMap content={content} appKey={process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? ""} />
          <Link className="spot-planner-link" href={`/planner?spot=${content.id}`}><LocaleText>{"이 장소를 포함한 코스 추천 "}</LocaleText><AppIcon name="arrow" size={17} /></Link>
        </aside>
      </div>
    </main>
  );
}
