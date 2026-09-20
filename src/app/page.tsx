import { getTranslation } from "@/lib/i18n-server";

import { LocaleText } from "@/components/common/locale-provider";
import Link from "next/link";

import { MapExplorer } from "@/components/map/map-explorer";
import { AppIcon } from "@/components/common/app-icon";
import { CategoryCard } from "@/components/home/category-card";
import { ContentThumbnail } from "@/components/common/content-thumbnail";
import { getPublicExploreContents } from "@/lib/content-repository";
import { homeCategories } from "@/mocks/home-data";

export default async function HomePage() {
  const { t } = await getTranslation();

  const contents = await getPublicExploreContents();
  return (
    <main className="home-dashboard">
      {contents.length > 0 && <section aria-label={t("등록 콘텐츠 지도")}><MapExplorer appKey={process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? ""} contents={contents} /></section>}<section><h2><LocaleText>{"등록된 콘텐츠 "}</LocaleText>{contents.length}<LocaleText>{"곳"}</LocaleText></h2><div className="explore-result-grid">{contents.slice(0, 6).map((content) => <article className="explore-content-card" key={content.id}><Link href={`/spots/${content.id}`}><div className={`explore-card-visual visual-${content.visual}`}><ContentThumbnail src={content.imageUrl} title={content.title} /></div><div className="explore-card-body"><p>{content.region} · <LocaleText>{content.type}</LocaleText></p><h2>{content.title}</h2><span>{content.spotName}</span></div></Link></article>)}</div>{!contents.length && <p><LocaleText>{"공개된 콘텐츠를 준비하고 있습니다."}</LocaleText></p>}</section>

      <section className="home-categories">
        <div className="home-section-heading"><div><h2><LocaleText>{"어떤 콘텐츠를 좋아하시나요?"}</LocaleText></h2><p><LocaleText>{"좋아하는 유형에서 전국의 K-콘텐츠 장소를 찾아보세요."}</LocaleText></p></div><Link href="/explore"><LocaleText>{"전체 보기 "}</LocaleText><AppIcon name="arrow" size={16} /></Link></div>
        <div className="category-card-grid">{homeCategories.map((category) => <CategoryCard category={{ ...category, count: contents.filter((content) => content.type === category.label).length }} key={category.id} />)}</div>
      </section>

      <section className="planner-banner">
        <div className="planner-art" aria-hidden="true"><AppIcon name="pin" size={34} /><span>▣</span><span>▤</span></div>
        <div><h2><LocaleText>{"나만의 여행 코스를 추천받아보세요!"}</LocaleText></h2><p><LocaleText>{"관심 콘텐츠와 취향을 선택하면 맞춤 여행 코스를 추천해드려요."}</LocaleText></p></div>
        <Link href="/planner"><LocaleText>{"코스 추천 시작하기 "}</LocaleText><AppIcon name="arrow" size={18} /></Link>
      </section>

      <p className="home-data-disclaimer"><LocaleText>{"관리자 검수를 통과한 콘텐츠 장소와 한국관광공사 관광정보를 함께 제공합니다."}</LocaleText></p>
    </main>
  );
}
