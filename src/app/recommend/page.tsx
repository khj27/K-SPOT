import Form from "next/form";
import { REGIONS } from "@/lib/regions";
import { getTranslation } from "@/lib/i18n-server";

import { LocaleText } from "@/components/common/locale-provider";
import Link from "next/link";
import { NearbyTourism } from "@/components/spots/nearby-tourism";
import { getPublicExploreContents } from "@/lib/content-repository";
import { rankPlaces } from "@/lib/recommendation";
import { exploreTypes } from "@/mocks/explore-data";
import { ContentThumbnail } from "@/components/common/content-thumbnail";

export default async function RecommendPage({ searchParams }: { searchParams: Promise<{ region?: string; type?: string; spot?: string; tab?: string }> }) {
  const { t } = await getTranslation();

  const params = await searchParams;
  const contents = await getPublicExploreContents();
  const types = exploreTypes.filter((type) => type !== "전체");
  const regions = [...REGIONS];
  const type = types.find((value) => value === params.type) ?? "";
  const region = regions.includes(params.region ?? "") ? params.region! : "";
  const ranked = rankPlaces({ places: contents, region, selectedTypes: new Set(type ? [type] : types) });
  const anchor = ranked.find(({ place }) => place.id === params.spot)?.place ?? ranked[0]?.place;
  return <main className="explore-page"><section className="planner-heading"><p className="kspot-eyebrow">LOCAL DISCOVERY</p><h1><LocaleText>{"취향으로 찾는"}</LocaleText><br /><em><LocaleText>{"다음 여행지"}</LocaleText></em></h1><p><LocaleText>{"지역과 콘텐츠 취향을 고르면 추천 이유와 함께 장소를 보여드립니다."}</LocaleText></p></section>
    <Form className="recommend-filter" action="/recommend">{params.tab === "activities" && <input type="hidden" name="tab" value="activities" />}<label><LocaleText>{"지역"}</LocaleText><select name="region" defaultValue={region}><option value=""><LocaleText>{"전국"}</LocaleText></option>{regions.map((value) => <option key={value} value={value}><LocaleText>{value}</LocaleText></option>)}</select></label><label><LocaleText>{"콘텐츠 유형"}</LocaleText><select name="type" defaultValue={type}><option value=""><LocaleText>{"전체"}</LocaleText></option>{types.map((value) => <option key={value} value={value}><LocaleText>{value}</LocaleText></option>)}</select></label><button className="kspot-primary-button" type="submit"><LocaleText>{"추천 보기"}</LocaleText></button></Form>
    <nav className="recommend-tabs" aria-label={t("추천 항목")}><Link aria-current={params.tab !== "activities" ? "page" : undefined} href={`/recommend?region=${encodeURIComponent(region)}&type=${encodeURIComponent(type)}`}><LocaleText>{"등록 콘텐츠"}</LocaleText></Link><Link aria-current={params.tab === "activities" ? "page" : undefined} href={`/recommend?region=${encodeURIComponent(region)}&type=${encodeURIComponent(type)}&tab=activities`}><LocaleText>{"주변 즐길거리"}</LocaleText></Link></nav>
    {params.tab === "activities" ? <section><h2><LocaleText>{"콘텐츠 여행에 더할 즐길거리"}</LocaleText></h2><p><LocaleText>{"선택한 촬영지 주변 5km의 관광지·음식점·문화시설을 사진과 함께 확인하세요."}</LocaleText></p>{anchor ? <><Form action="/recommend" className="recommend-filter"><input type="hidden" name="tab" value="activities" /><input type="hidden" name="region" value={region} /><input type="hidden" name="type" value={type} /><label><LocaleText>{"기준 촬영지"}</LocaleText><select name="spot" defaultValue={anchor.id}>{ranked.map(({ place }) => <option key={place.id} value={place.id}>{place.spotName} · {place.title}</option>)}</select></label><button type="submit" className="kspot-primary-button"><LocaleText>{"즐길거리 찾기"}</LocaleText></button></Form><NearbyTourism key={anchor.id} latitude={anchor.coordinates.latitude} longitude={anchor.coordinates.longitude} /></> : <p><LocaleText>{"이 지역에 공개된 콘텐츠가 없습니다. 다른 지역을 선택해 주세요."}</LocaleText></p>}</section> : <><p role="status"><LocaleText>{"추천 장소 "}</LocaleText>{ranked.length}<LocaleText>{"개"}</LocaleText></p>
    {ranked.length ? <div className="explore-result-grid">{ranked.map(({ place, score, reasons }) => <article className="explore-content-card" key={place.id}><Link href={`/spots/${place.id}`}><div className={`explore-card-visual visual-${place.visual}`}><span><LocaleText>{place.type}</LocaleText></span><ContentThumbnail src={place.imageUrl} title={place.title} /></div></Link><div className="explore-card-body"><p>{place.region} · <LocaleText>{place.managed ? "등록 콘텐츠" : "데모"}</LocaleText></p><h2>{place.spotName}</h2><span>{place.title}</span><div className="recommendation-reasons" aria-label={t(`추천 ${score}점`)}>{reasons.map((reason) => <small key={reason}><LocaleText>{reason}</LocaleText></small>)}</div><div className="admin-csv-actions"><Link href={`/spots/${place.id}`}><LocaleText>{"장소 상세"}</LocaleText></Link><Link href={`/planner?spot=${encodeURIComponent(place.id)}`}><LocaleText>{"이 장소로 일정 만들기"}</LocaleText></Link></div></div></article>)}</div> : <section className="saved-empty"><h2><LocaleText>{"조건에 맞는 장소가 없습니다."}</LocaleText></h2><p><LocaleText>{"다른 지역 또는 전체 콘텐츠 유형을 선택해 주세요."}</LocaleText></p><Link href="/recommend"><LocaleText>{"전체 추천 보기"}</LocaleText></Link></section>}
  </>}</main>;
}
