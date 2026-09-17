"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

import { AppIcon } from "@/components/common/app-icon";
import { ContentThumbnail } from "@/components/common/content-thumbnail";
import type { ExploreContent } from "@/types/content";
import { SAVED_SPOTS_KEY, subscribeToSavedSpots, getSavedSpotsSnapshot, getEmptySnapshot, parseSavedSpotIds, writeTravelStorage } from "@/lib/travel-storage";

export function SavedSpotsList({ contents }: { contents: ExploreContent[] }) {
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
        <h2>아직 저장한 장소가 없습니다.</h2>
        <p>마음에 드는 촬영지를 저장하면 이곳에서 한눈에 확인할 수 있어요.</p>
        <Link className="kspot-primary-button saved-empty-link" href="/explore">장소 탐색하기 <AppIcon name="arrow" size={16} /></Link>
      </section>
    );
  }

  function removeSaved(id: string) {
    try {
      const nextIds = parseSavedSpotIds(getSavedSpotsSnapshot()).filter((savedId) => savedId !== id);
      writeTravelStorage(SAVED_SPOTS_KEY, nextIds); setError("");
    } catch (error) { setError(error instanceof Error ? error.message : "저장 해제에 실패했습니다."); }
  }

  return (
    <section><p role="status">{error}</p>{unavailable.length > 0 && <div className="saved-unavailable"><p>현재 조회할 수 없는 저장 장소 {unavailable.length}개가 있습니다. 비공개 또는 일시적인 연결 문제일 수 있습니다.</p>{unavailable.map((id) => <button key={id} type="button" onClick={() => removeSaved(id)}>{id} 저장 해제</button>)}</div>}<div className="saved-content-grid">
      {savedContents.map((content) => (
        <article className="saved-content-card" key={content.id}>
          <Link href={`/spots/${content.id}`} className={`saved-content-visual visual-${content.visual}`}>
            <span>{content.type}</span><ContentThumbnail src={content.imageUrl} title={content.title} /><small>{content.episode}</small>
          </Link>
          <div className="saved-content-body">
            <p><AppIcon name="pin" size={14} /> {content.region} · {content.spotName}</p>
            <h2><Link href={`/spots/${content.id}`}>{content.spotName}</Link></h2>
            <span>{content.title} · {content.description}</span>
            <div className="saved-card-footer">
              <Link href={`/spots/${content.id}`}>상세 보기 <AppIcon name="arrow" size={14} /></Link>
              <Link href={`/planner?spot=${encodeURIComponent(content.id)}`}>일정 만들기</Link>
              <button onClick={() => removeSaved(content.id)} type="button" aria-label={`${content.spotName} 저장 해제`}><AppIcon name="bookmark" size={16} /> 저장 해제</button>
            </div>
          </div>
        </article>
      ))}
    </div></section>
  );
}
