import { getTranslation } from "@/lib/i18n-server";

import { LocaleText } from "@/components/common/locale-provider";
import Link from "next/link";
import { ContentThumbnail } from "@/components/common/content-thumbnail";

import { AppIcon } from "@/components/common/app-icon";
import { getPublicExploreContents } from "@/lib/content-repository";
import { exploreRegions, exploreTypes } from "@/mocks/explore-data";
import { translate } from "@/lib/i18n";
import { normalizeRegion } from "@/lib/recommendation";

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

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { t } = await getTranslation();

  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const selectedType = getSelectedType(params.type);
  const exploreContents = await getPublicExploreContents();
  const regions = ["전체 지역", ...new Set([...exploreRegions.filter((region) => region !== "전체 지역"), ...exploreContents.map((content) => content.region)])];
  const selectedRegion = regions.includes(params.region ?? "") ? params.region! : "전체 지역";
  const selectedContentId = params.content?.trim();
  const contents = exploreContents.filter((content) => {
    const matchesContent = !selectedContentId || content.id === selectedContentId;
    const matchesQuery = !query || [content.title, content.spotName, content.region, translate(normalizeRegion(content.region), "en"), translate(content.type, "en")].some((value) => value.toLowerCase().includes(query.toLowerCase()));
    const matchesType = selectedType === "전체" || content.type === selectedType;
    const matchesRegion = selectedRegion === "전체 지역" || content.region === selectedRegion;
    return matchesContent && matchesQuery && matchesType && matchesRegion;
  });

  return (
    <main className="explore-page">
      <section className="explore-heading">
        <div>
          <p className="kspot-eyebrow">K-CONTENT EXPLORE</p>
          <h1><LocaleText>{"좋아하는 콘텐츠의"}</LocaleText><br /><em><LocaleText>{"촬영지를 찾아보세요."}</LocaleText></em></h1>
          <p className="explore-description"><LocaleText>{"드라마, 예능, 영화 속 장면을 따라 전국의 로컬 장소를 발견해 보세요."}</LocaleText></p>
        </div>
        <div className="explore-summary"><strong>{contents.length}</strong><span><LocaleText>{"검색 결과"}</LocaleText></span></div>
      </section>

      <form className="explore-filter-panel" action="/explore">
        <label className="explore-query"><AppIcon name="search" size={19} /><span className="sr-only"><LocaleText>{"콘텐츠 또는 장소 검색"}</LocaleText></span><input name="q" defaultValue={query} placeholder={t("콘텐츠명, 장소명, 지역을 검색해보세요")} /></label>
        <label><span><LocaleText>{"콘텐츠 유형"}</LocaleText></span><select name="type" defaultValue={selectedType}>{exploreTypes.map((type) => <option key={type} value={type}><LocaleText>{type}</LocaleText></option>)}</select></label>
        <label><span><LocaleText>{"지역"}</LocaleText></span><select name="region" defaultValue={selectedRegion}>{regions.map((region) => <option key={region} value={region}><LocaleText>{region}</LocaleText></option>)}</select></label>
        <button className="kspot-primary-button" type="submit"><LocaleText>{"검색 "}</LocaleText><AppIcon name="arrow" size={16} /></button>
      </form>

      <div className="explore-toolbar">
        <div className="explore-type-links" aria-label={t("콘텐츠 유형 빠른 필터")}>
          {exploreTypes.map((type) => {
            const search = new URLSearchParams();
            if (query) search.set("q", query);
            if (type !== "전체") search.set("type", type);
            if (selectedRegion !== "전체 지역") search.set("region", selectedRegion);
            const href = search.toString() ? `/explore?${search.toString()}` : "/explore";
            return <Link className={selectedType === type ? "is-active" : undefined} href={href} key={type}><LocaleText>{type}</LocaleText></Link>;
          })}
        </div>
        <Link className="explore-map-link" href="/map"><AppIcon name="map" size={16} /><LocaleText>{" 지도에서 보기"}</LocaleText></Link>
      </div>

      {contents.length > 0 ? (
        <div className="explore-result-grid">
          {contents.map((content) => <Link className="explore-content-card" href={`/spots/${content.id}`} key={content.id}>
            <div className={`explore-card-visual visual-${content.visual}`}><span><LocaleText>{content.type}</LocaleText></span><ContentThumbnail src={content.imageUrl} title={content.title} /><small>{content.episode}</small></div>
            <div className="explore-card-body"><p><AppIcon name="pin" size={14} /> {content.region} · {content.spotName}</p><h2>{content.title}</h2><span>{content.description}</span><b><LocaleText>{"장소 상세 보기 "}</LocaleText><AppIcon name="arrow" size={14} /></b></div>
          </Link>)}
        </div>
      ) : (
        <section className="explore-empty"><div aria-hidden="true">⌕</div><h2><LocaleText>{"검색 결과가 없습니다."}</LocaleText></h2><p><LocaleText>{"검색어 또는 필터를 바꿔 다시 찾아보세요."}</LocaleText></p><Link className="button button-secondary" href="/explore"><LocaleText>{"전체 결과 보기"}</LocaleText></Link></section>
      )}
      <p className="explore-data-notice"><LocaleText>{"관리자가 공개한 데이터는 작품·장소 관계의 출처와 검수일을 함께 관리합니다."}</LocaleText></p>
    </main>
  );
}
