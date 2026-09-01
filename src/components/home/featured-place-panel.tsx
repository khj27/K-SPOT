import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import { featuredPlace } from "@/mocks/home-data";

export function FeaturedPlacePanel() {
  return (
    <aside className="featured-place-panel">
      <div className="place-cover">
        <span className="place-region"><AppIcon name="pin" size={13} /> {featuredPlace.region}</span>
        <h2>{featuredPlace.name}</h2>
        <p>★ {featuredPlace.rating} <span>({featuredPlace.reviewCount})</span></p>
        <div className="cover-skyline" />
      </div>
      <div className="place-tabs" role="tablist" aria-label="장소 정보 탭"><button className="is-active" type="button" role="tab" aria-selected="true">콘텐츠 정보</button><button type="button" role="tab" aria-selected="false">즐길거리 요약</button><button type="button" role="tab" aria-selected="false">상세 정보</button></div>
      <div className="place-panel-body">
        <h3>이 지역에서 촬영된 콘텐츠</h3>
        <div className="mini-content-grid">
          {featuredPlace.contents.map((content) => <Link href={`/explore?content=${content.id}`} key={content.id}><span className={`mini-thumb thumb-${content.visual}`}>{content.title.slice(0, 1)}</span><small>{content.type}</small><strong>{content.title}</strong><em>{content.meta}</em></Link>)}
        </div>
        <h3>주변 즐길거리 요약</h3>
        <div className="nearby-grid">
          {featuredPlace.nearby.map((item) => <div key={item.label}><span>{item.icon}</span><strong>{item.label} {item.count}</strong></div>)}
        </div>
        <Link className="kspot-primary-button" href="/planner">이 지역 코스 추천받기 <AppIcon name="arrow" size={18} /></Link>
        <p className="demo-data-notice">화면 검증용 데모 정보입니다. 실제 관계 데이터는 출처 확인 후 제공됩니다.</p>
      </div>
    </aside>
  );
}
