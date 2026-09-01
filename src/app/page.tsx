import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import { CategoryCard } from "@/components/home/category-card";
import { FeaturedPlacePanel } from "@/components/home/featured-place-panel";
import { MapCanvas } from "@/components/home/map-canvas";
import { homeCategories } from "@/mocks/home-data";

const contentFilters = ["전체", "드라마", "예능", "영화", "뮤직비디오", "아이돌", "웹툰/웹소설"];

export default function HomePage() {
  return (
    <main className="home-dashboard">
      <section className="home-filter-row" aria-label="콘텐츠 유형 필터">
        {contentFilters.map((filter, index) => <Link className={index === 0 ? "is-active" : undefined} href={index === 0 ? "/explore" : `/explore?type=${encodeURIComponent(filter)}`} key={filter}>{filter}</Link>)}
      </section>

      <section className="home-map-layout">
        <MapCanvas />
        <FeaturedPlacePanel />
      </section>

      <section className="home-categories">
        <div className="home-section-heading"><div><h2>어떤 콘텐츠를 좋아하시나요?</h2><p>좋아하는 유형에서 전국의 K-콘텐츠 장소를 찾아보세요.</p></div><Link href="/explore">전체 보기 <AppIcon name="arrow" size={16} /></Link></div>
        <div className="category-card-grid">{homeCategories.map((category) => <CategoryCard category={category} key={category.id} />)}</div>
      </section>

      <section className="planner-banner">
        <div className="planner-art" aria-hidden="true"><AppIcon name="pin" size={34} /><span>▣</span><span>▤</span></div>
        <div><h2>나만의 여행 코스를 추천받아보세요!</h2><p>관심 콘텐츠와 취향을 선택하면 맞춤 여행 코스를 추천해드려요.</p></div>
        <Link href="/planner">코스 추천 시작하기 <AppIcon name="arrow" size={18} /></Link>
      </section>

      <p className="home-data-disclaimer">현재 화면은 제공된 UI 시안을 반영한 기능 검증용 데모입니다. 실제 관광·콘텐츠 관계는 출처 검수 후 공개됩니다.</p>
    </main>
  );
}
