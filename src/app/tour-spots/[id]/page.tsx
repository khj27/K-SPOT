import Link from "next/link";
import { notFound } from "next/navigation";
import { getTourismDetail } from "@/lib/tour-api";
import { ContentThumbnail } from "@/components/common/content-thumbnail";
import { LocaleText } from "@/components/common/locale-provider";
import { TourBookmarkButton } from "@/components/spots/tour-bookmark-button";
import { TOUR_TYPE_LABELS } from "@/lib/place-categories";
export default async function TourSpotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d{1,20}$/.test(id)) notFound();
  const result = await getTourismDetail(id);
  const place = result.item;
  return <main className="saved-page"><Link className="ui-button" href="/recommend?tab=activities"><LocaleText>주변 즐길거리</LocaleText></Link>{place ? <section className="spot-detail-card"><div className="tour-detail-photo"><ContentThumbnail src={place.imageUrl || place.thumbnailUrl} title={place.title} /></div><small><LocaleText>{TOUR_TYPE_LABELS[place.contentTypeId] ?? "기타"}</LocaleText></small><h1>{place.title}</h1><p>{place.address}</p>{place.tel && <p>{place.tel}</p>}<p>{place.overview}</p><TourBookmarkButton place={{ contentId: place.contentId, title: place.title, address: place.address, latitude: place.latitude, longitude: place.longitude, contentTypeId: place.contentTypeId, ...(place.imageUrl ? { imageUrl: place.imageUrl } : {}) }} /></section> : <section className="saved-empty"><h1><LocaleText>상세정보를 잠시 불러올 수 없습니다.</LocaleText></h1><Link href="/mypage#saved-places"><LocaleText>찜한 장소</LocaleText></Link></section>}</main>;
}
