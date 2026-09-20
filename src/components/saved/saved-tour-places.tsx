"use client";
import Link from "next/link";
import { useTravelSnapshot } from "@/components/account/travel-snapshot-provider";
import { ContentThumbnail } from "@/components/common/content-thumbnail";
import { useTranslation } from "@/components/common/locale-provider";
import { TourBookmarkButton } from "@/components/spots/tour-bookmark-button";
import { TOUR_TYPE_LABELS } from "@/lib/place-categories";
import type { SavedTourPlace } from "@/lib/travel-data";
export function SavedTourPlaces() {
  const { t } = useTranslation();
  const places = JSON.parse(useTravelSnapshot("tours")) as SavedTourPlace[];
  if (!places.length) return null;
  return <section><h3>{t("주변 즐길거리")}</h3><div className="saved-content-grid">{places.map((place) => <article className="saved-content-card" key={place.contentId}><Link className="saved-content-visual visual-sky" href={`/tour-spots/${place.contentId}`}><ContentThumbnail src={place.imageUrl} title={place.title} /></Link><div className="saved-content-body"><small>{t(TOUR_TYPE_LABELS[place.contentTypeId] ?? "기타")}</small><h3><Link href={`/tour-spots/${place.contentId}`}>{place.title}</Link></h3><p>{place.address}</p><TourBookmarkButton place={place} /></div></article>)}</div></section>;
}
