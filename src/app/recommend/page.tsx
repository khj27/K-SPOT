import Link from "next/link";
import { getPublicExploreContents } from "@/lib/content-repository";
import { normalizeRegion, rankPlaces } from "@/lib/recommendation";
import { exploreTypes } from "@/mocks/explore-data";
import { ContentThumbnail } from "@/components/common/content-thumbnail";

export default async function RecommendPage({ searchParams }: { searchParams: Promise<{ region?: string; type?: string }> }) {
  const params = await searchParams;
  const contents = await getPublicExploreContents();
  const types = exploreTypes.filter((type) => type !== "전체");
  const regions = [...new Set(contents.map((item) => normalizeRegion(item.region)))].sort();
  const type = types.find((value) => value === params.type) ?? "";
  const region = regions.includes(params.region ?? "") ? params.region! : "";
  const ranked = rankPlaces({ places: contents, region, selectedTypes: new Set(type ? [type] : types) });
  return <main className="explore-page"><section className="planner-heading"><p className="kspot-eyebrow">LOCAL DISCOVERY</p><h1>취향으로 찾는<br /><em>다음 여행지</em></h1><p>지역과 콘텐츠 취향을 고르면 추천 이유와 함께 장소를 보여드립니다.</p></section>
    <form className="recommend-filter" action="/recommend"><label>지역<select name="region" defaultValue={region}><option value="">전국</option>{regions.map((value) => <option key={value}>{value}</option>)}</select></label><label>콘텐츠 유형<select name="type" defaultValue={type}><option value="">전체</option>{types.map((value) => <option key={value}>{value}</option>)}</select></label><button className="kspot-primary-button" type="submit">추천 보기</button></form>
    <p className="planner-demo-note">지역 35점 · 콘텐츠 취향 30점 · 비수도권 20점 기준의 규칙 기반 추천입니다. 데모 항목은 별도로 표시합니다.</p>
    <p role="status">추천 장소 {ranked.length}개</p>
    {ranked.length ? <div className="explore-result-grid">{ranked.map(({ place, score, reasons }) => <article className="explore-content-card" key={place.id}><Link href={`/spots/${place.id}`}><div className={`explore-card-visual visual-${place.visual}`}><span>{place.type}</span><ContentThumbnail src={place.imageUrl} title={place.title} /></div></Link><div className="explore-card-body"><p>{place.region} · {place.managed ? "등록 콘텐츠" : "데모"}</p><h2>{place.spotName}</h2><span>{place.title}</span><div className="recommendation-reasons" aria-label={`추천 ${score}점`}>{reasons.map((reason) => <small key={reason}>{reason}</small>)}</div><div className="admin-csv-actions"><Link href={`/spots/${place.id}`}>장소 상세</Link><Link href={`/planner?spot=${encodeURIComponent(place.id)}`}>이 장소로 일정 만들기</Link></div></div></article>)}</div> : <section className="saved-empty"><h2>조건에 맞는 장소가 없습니다.</h2><p>다른 지역 또는 전체 콘텐츠 유형을 선택해 주세요.</p><Link href="/recommend">전체 추천 보기</Link></section>}
  </main>;
}
