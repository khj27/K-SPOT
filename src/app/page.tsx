import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import { CategoryCard } from "@/components/home/category-card";
import { HomeMapExperience } from "@/components/home/home-map-experience";
import { getPublicExploreContents } from "@/lib/content-repository";
import { homeCategories } from "@/mocks/home-data";

export default async function HomePage() {
  const contents = await getPublicExploreContents();
  return (
    <main className="home-dashboard">
      <HomeMapExperience kakaoMapKey={process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? ""} contents={contents} />

      <section className="home-categories">
        <div className="home-section-heading"><div><h2>어떤 콘텐츠를 좋아하시나요?</h2><p>좋아하는 유형에서 전국의 K-콘텐츠 장소를 찾아보세요.</p></div><Link href="/explore">전체 보기 <AppIcon name="arrow" size={16} /></Link></div>
        <div className="category-card-grid">{homeCategories.map((category) => <CategoryCard category={category} key={category.id} />)}</div>
      </section>

      <section className="planner-banner">
        <div className="planner-art" aria-hidden="true"><AppIcon name="pin" size={34} /><span>▣</span><span>▤</span></div>
        <div><h2>나만의 여행 코스를 추천받아보세요!</h2><p>관심 콘텐츠와 취향을 선택하면 맞춤 여행 코스를 추천해드려요.</p></div>
        <Link href="/planner">코스 추천 시작하기 <AppIcon name="arrow" size={18} /></Link>
      </section>

      <p className="home-data-disclaimer">관리자 검수를 통과한 콘텐츠 장소와 한국관광공사 관광정보를 함께 제공합니다.</p>
    </main>
  );
}
