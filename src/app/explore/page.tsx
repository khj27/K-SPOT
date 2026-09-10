import Link from "next/link";

import { AppIcon } from "@/components/common/app-icon";
import { exploreContents, exploreRegions, exploreTypes } from "@/mocks/explore-data";

type ExplorePageProps = {
  searchParams: Promise<{ q?: string; type?: string; region?: string; content?: string }>;
};

const typeAliases: Record<string, (typeof exploreTypes)[number]> = {
  drama: "드라마",
  variety: "예능",
  movie: "영화",
  "music-video": "뮤직비디오",
  idol: "아이돌",
  webtoon: "웹툰/웹소설",
};

function getSelectedType(value: string | undefined): (typeof exploreTypes)[number] {
  const normalized = typeAliases[value ?? ""] ?? value;
  return exploreTypes.find((type) => type === normalized) ?? "전체";
}

function getSelectedRegion(value: string | undefined): (typeof exploreRegions)[number] {
  return exploreRegions.find((region) => region === value) ?? "전체 지역";
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const selectedType = getSelectedType(params.type);
  const selectedRegion = getSelectedRegion(params.region);
  const selectedContentId = params.content?.trim();
  const contents = exploreContents.filter((content) => {
    const matchesContent = !selectedContentId || content.id === selectedContentId;
    const matchesQuery = !query || [content.title, content.spotName, content.region].some((value) => value.toLowerCase().includes(query.toLowerCase()));
    const matchesType = selectedType === "전체" || content.type === selectedType;
    const matchesRegion = selectedRegion === "전체 지역" || content.region === selectedRegion;
    return matchesContent && matchesQuery && matchesType && matchesRegion;
  });

  return (
    <main className="explore-page">
      <section className="explore-heading">
        <div>
          <p className="kspot-eyebrow">K-CONTENT EXPLORE</p>
          <h1>좋아하는 콘텐츠의<br /><em>촬영지를 찾아보세요.</em></h1>
          <p className="explore-description">드라마, 예능, 영화 속 장면을 따라 전국의 로컬 장소를 발견해 보세요.</p>
        </div>
        <div className="explore-summary"><strong>{contents.length}</strong><span>검색 결과</span></div>
      </section>

      <form className="explore-filter-panel" action="/explore">
        <label className="explore-query"><AppIcon name="search" size={19} /><span className="sr-only">콘텐츠 또는 장소 검색</span><input name="q" defaultValue={query} placeholder="콘텐츠명, 장소명, 지역을 검색해보세요" /></label>
        <label><span>콘텐츠 유형</span><select name="type" defaultValue={selectedType}>{exploreTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
        <label><span>지역</span><select name="region" defaultValue={selectedRegion}>{exploreRegions.map((region) => <option key={region} value={region}>{region}</option>)}</select></label>
        <button className="kspot-primary-button" type="submit">검색 <AppIcon name="arrow" size={16} /></button>
      </form>

      <div className="explore-toolbar">
        <div className="explore-type-links" aria-label="콘텐츠 유형 빠른 필터">
          {exploreTypes.map((type) => {
            const search = new URLSearchParams();
            if (query) search.set("q", query);
            if (type !== "전체") search.set("type", type);
            if (selectedRegion !== "전체 지역") search.set("region", selectedRegion);
            const href = search.toString() ? `/explore?${search.toString()}` : "/explore";
            return <Link className={selectedType === type ? "is-active" : undefined} href={href} key={type}>{type}</Link>;
          })}
        </div>
        <Link className="explore-map-link" href="/map"><AppIcon name="map" size={16} /> 지도에서 보기</Link>
      </div>

      {contents.length > 0 ? (
        <div className="explore-result-grid">
          {contents.map((content) => <Link className="explore-content-card" href={`/spots/${content.id}`} key={content.id}>
            <div className={`explore-card-visual visual-${content.visual}`}><span>{content.type}</span><strong>{content.title.slice(0, 1)}</strong><small>{content.episode}</small></div>
            <div className="explore-card-body"><p><AppIcon name="pin" size={14} /> {content.region} · {content.spotName}</p><h2>{content.title}</h2><span>{content.description}</span><b>장소 상세 보기 <AppIcon name="arrow" size={14} /></b></div>
          </Link>)}
        </div>
      ) : (
        <section className="explore-empty"><div aria-hidden="true">⌕</div><h2>검색 결과가 없습니다.</h2><p>검색어 또는 필터를 바꿔 다시 찾아보세요.</p><Link className="button button-secondary" href="/explore">전체 결과 보기</Link></section>
      )}
      <p className="explore-data-notice">현재 결과는 기능 검증용 데모 데이터입니다. 공개 전 장소 정보와 촬영 출처를 검수합니다.</p>
    </main>
  );
}
