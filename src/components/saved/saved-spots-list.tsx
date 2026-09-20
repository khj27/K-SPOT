"use client";
import { useTranslation } from "@/components/common/locale-provider";

import { LocaleText } from "@/components/common/locale-provider";


import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { ContentThumbnail } from "@/components/common/content-thumbnail";
import type { ExploreContent } from "@/types/content";
import { subscribeToSavedSpots, getSavedSpotsSnapshot, getEmptySnapshot, parseSavedSpotIds, setSpotSaved } from "@/lib/travel-storage";

export function SavedSpotsList({ contents }: { contents: ExploreContent[] }) {
  const { t } = useTranslation();

  const [error, setError] = useState("");
  const savedSpotsSnapshot = useSyncExternalStore(subscribeToSavedSpots, getSavedSpotsSnapshot, getEmptySnapshot);
  const savedIds = parseSavedSpotIds(savedSpotsSnapshot);

  const savedContents = savedIds
    .map((id) => contents.find((content) => content.id === id))
    .filter((content): content is ExploreContent => content !== undefined);
  const unavailable = savedIds.filter((id) => !contents.some((content) => content.id === id));

  if (savedIds.length === 0) {
    return (
      <section className="saved-empty">
        <div className="saved-empty-icon" aria-hidden="true"><AppIcon name="bookmark" size={30} /></div>
        <h2><LocaleText>{"아직 저장한 장소가 없습니다."}</LocaleText></h2>
        <p><LocaleText>{"마음에 드는 촬영지를 저장하면 이곳에서 한눈에 확인할 수 있어요."}</LocaleText></p>
        <Link className="kspot-primary-button saved-empty-link" href="/explore"><LocaleText>{"장소 탐색하기 "}</LocaleText><AppIcon name="arrow" size={16} /></Link>
      </section>
    );
  }

  async function removeSaved(id: string) {
    try {
      await setSpotSaved(id, false); setError("");
    } catch (error) { setError(error instanceof Error ? error.message : "저장 해제에 실패했습니다."); }
  }

  return (
    <section><p role="status"><LocaleText>{error}</LocaleText></p>{unavailable.length > 0 && <div className="saved-unavailable"><p><LocaleText>{"현재 조회할 수 없는 저장 장소 "}</LocaleText>{unavailable.length}<LocaleText>{"개가 있습니다. 비공개 또는 일시적인 연결 문제일 수 있습니다."}</LocaleText></p>{unavailable.map((id) => <button key={id} type="button" onClick={() => removeSaved(id)}>{id}<LocaleText>{" 저장 해제"}</LocaleText></button>)}</div>}<div className="saved-content-grid">
      {savedContents.map((content) => (
        <article className="saved-content-card" key={content.id}>
          <Link href={`/spots/${content.id}`} className={`saved-content-visual visual-${content.visual}`}>
            <span><LocaleText>{content.type}</LocaleText></span><ContentThumbnail src={content.imageUrl} title={content.title} /><small>{content.episode}</small>
          </Link>
          <div className="saved-content-body">
            <p><AppIcon name="pin" size={14} /> {content.region} · {content.spotName}</p>
            <h2><Link href={`/spots/${content.id}`}>{content.spotName}</Link></h2>
            <span>{content.title} · {content.description}</span>
            <div className="saved-card-footer">
              <Link href={`/spots/${content.id}`}><LocaleText>{"상세 보기 "}</LocaleText><AppIcon name="arrow" size={14} /></Link>
              <Link href={`/planner?spot=${encodeURIComponent(content.id)}`}><LocaleText>{"일정 만들기"}</LocaleText></Link>
              <button onClick={() => removeSaved(content.id)} type="button" aria-label={t(`${content.spotName} 저장 해제`)}><AppIcon name="bookmark" size={16} /><LocaleText>{" 저장 해제"}</LocaleText></button>
            </div>
          </div>
        </article>
      ))}
    </div></section>
  );
}
